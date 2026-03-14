'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import { useFirebase } from '@/firebase/provider';
import { useProfile } from '@/components/profile-provider';

import { ref as dbRef, get, update } from 'firebase/database';
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

const MAX_PHOTOS = 5;
const MIN_FILE_SIZE = 20 * 1024;       // 20 KB
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

export function PhotoUploadStep({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  const { auth, database } = useFirebase();
  const { fetchUserData } = useProfile();
  const { toast } = useToast();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [lastUploadedUrl, setLastUploadedUrl] = useState<string | null>(null);
  const [currentPhotoCount, setCurrentPhotoCount] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load current photo count when component mounts
  useEffect(() => {
    if (!auth?.currentUser || !database) return;

    const userRef = dbRef(database, `users/${auth.currentUser.uid}`);
    get(userRef).then((snap) => {
      const data = snap.val();
      const photos = data?.photos ?? [];
      setCurrentPhotoCount(photos.length);
    });
  }, [auth?.currentUser?.uid, database]);

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const canUploadMore = currentPhotoCount < MAX_PHOTOS;

  const validateFile = (file: File): boolean => {
    if (file.size < MIN_FILE_SIZE) {
      toast({
        variant: 'destructive',
        title: 'File too small',
        description: `Minimum file size is 20 KB. Your file is ${(file.size / 1024).toFixed(1)} KB.`,
      });
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: 'destructive',
        title: 'File too large',
        description: `Maximum allowed size is 2 MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)} MB.`,
      });
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!canUploadMore) {
      toast({
        variant: 'destructive',
        title: 'Photo limit reached',
        description: `You can upload maximum ${MAX_PHOTOS} photos.`,
      });
      return;
    }

    if (!validateFile(file)) {
      e.target.value = ''; // clear input
      return;
    }

    // Clean previous preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreview = URL.createObjectURL(file);
    setPreviewUrl(newPreview);
    setUploadStatus('uploading');
    setIsUploading(true);
    setUploadProgress(0);

    uploadPhoto(file);
  };

  const uploadPhoto = (file: File) => {
    if (!auth?.currentUser || !database) {
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'Authentication or database issue.',
      });
      resetUploadState();
      return;
    }

    const storage = getStorage();
    const uniqueId = uuidv4();
    const imageRef = storageRef(storage, `user-photos/${auth.currentUser.uid}/${uniqueId}`);

    const uploadTask = uploadBytesResumable(imageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (error) => {
        toast({
          variant: 'destructive',
          title: 'Upload failed',
          description: error.message || 'Something went wrong.',
        });
        setUploadStatus('error');
        resetUploadState();
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          const user = auth.currentUser!;
          const userRef = dbRef(database, `users/${user.uid}`);

          const snap = await get(userRef);
          const data = snap.val() ?? {};
          const photos: string[] = data.photos ?? [];

          if (photos.length >= MAX_PHOTOS) {
            toast({
              variant: 'destructive',
              title: 'Limit reached',
              description: `You already have ${MAX_PHOTOS} photos.`,
            });
            resetUploadState();
            return;
          }

          const updatedPhotos = [...photos, downloadURL];
          const isFirstPhoto = !data.photoURL;

          const updates: Record<string, any> = {
            photos: updatedPhotos,
            'progress/5': true,
          };

          if (isFirstPhoto) {
            updates.photoURL = downloadURL;
            await updateProfile(user, { photoURL: downloadURL });
          }

          await update(userRef, updates);
          fetchUserData();

          // Update local count
          setCurrentPhotoCount(updatedPhotos.length);

          toast({
            title: 'Photo uploaded',
            description: `Added to your profile (${updatedPhotos.length}/${MAX_PHOTOS})`,
          });

          setLastUploadedUrl(downloadURL);
          setUploadStatus('success');
          setIsUploading(false);

          // Optional: clear preview after few seconds or keep it
          // setTimeout(() => setPreviewUrl(null), 4000);

        } catch (err: any) {
          toast({
            variant: 'destructive',
            title: 'Profile update failed',
            description: err.message || 'Could not save photo info.',
          });
          setUploadStatus('error');
          resetUploadState();
        }
      }
    );
  };

  const resetUploadState = () => {
    setIsUploading(false);
    // Keep preview if success → user can see what was just uploaded
  };

  const handleNewUploadClick = () => {
    if (!isUploading && canUploadMore) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-3"
            onClick={onBack}
            disabled={isUploading}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Add Profile Photos</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {currentPhotoCount}/{MAX_PHOTOS} photos uploaded
            </p>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading || !canUploadMore}
      />

      {/* Preview / Upload area */}
      <div
        className={`
          border-2 rounded-xl mb-6 overflow-hidden transition-all relative
          ${uploadStatus === 'success' ? 'border-green-400 shadow-md' : ''}
          ${uploadStatus === 'uploading' ? 'border-primary/40 bg-primary/5' : ''}
          ${!canUploadMore && uploadStatus !== 'uploading' 
            ? 'border-gray-200 bg-gray-50 opacity-70 cursor-not-allowed' 
            : 'border-dashed border-gray-300 hover:border-primary cursor-pointer'}
          ${uploadStatus === 'error' ? 'border-red-400' : ''}
        `}
        onClick={
          !isUploading && canUploadMore && uploadStatus !== 'uploading'
            ? handleNewUploadClick
            : undefined
        }
      >
        {previewUrl ? (
          <div className="relative">
            <div className="aspect-square w-full max-w-[320px] mx-auto">
              <Image
                src={previewUrl}
                alt="Profile photo preview"
                fill
                className="object-cover"
              />
            </div>

            {/* Overlays */}
            {uploadStatus === 'uploading' && (
              <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 text-white animate-spin mb-4" />
                <div className="w-4/5 max-w-xs">
                  <Progress value={uploadProgress} className="h-2.5 bg-white/30" />
                </div>
                <p className="text-white mt-3 font-medium">
                  {uploadProgress}% uploading...
                </p>
              </div>
            )}

            {uploadStatus === 'success' && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center pointer-events-none">
                <div className="bg-green-600 text-white rounded-full p-3 shadow-lg">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center">
                <p className="text-white font-medium px-6 text-center">
                  Upload failed — click to try another photo
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-16 text-center">
            {canUploadMore ? (
              <>
                <ImageIcon className="mx-auto h-14 w-14 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {currentPhotoCount === 0 ? 'Click to select your first photo' : 'Add another photo'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG, WebP — 20 KB to 2 MB
                </p>
              </>
            ) : (
              <>
                <AlertCircle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
                <h3 className="text-lg font-medium mb-2 text-amber-800">
                  Maximum limit reached
                </h3>
                <p className="text-sm text-muted-foreground">
                  You have uploaded {MAX_PHOTOS} photos already
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Guidelines */}
      <div className="mb-8 text-sm text-gray-600">
        <h4 className="font-medium text-gray-800 mb-2">Photo rules:</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Maximum {MAX_PHOTOS} photos allowed</li>
          <li>Each photo: 20 KB – 2 MB</li>
          <li>Clear, recent photo of yourself</li>
          <li>No group photos for profile picture</li>
        </ul>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isUploading}
        >
          Back
        </Button>

        <Button
          onClick={onContinue}
          disabled={isUploading || currentPhotoCount === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}