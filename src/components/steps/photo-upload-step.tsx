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
  const [lastUploadedUrl, setLastUploadedUrl] = useState<string | null>(null); // ← keeps success state

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

          toast({
            title: 'Photo uploaded',
            description: 'Added to your profile successfully.',
          });

          // Keep preview + mark as success
          setLastUploadedUrl(downloadURL);
          setUploadStatus('success');
          setIsUploading(false);

          // Optional: auto continue after success
          // onContinue();

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
    // Do NOT clear previewUrl here → we want it to stay after success
  };

  const handleNewUploadClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
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
          <h2 className="text-2xl font-bold">Add a Profile Photo</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Show everyone your best side!
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {/* Preview / Upload area */}
      <div
        className={`
          border-2 rounded-xl mb-6 overflow-hidden transition-all
          ${uploadStatus === 'success' ? 'border-green-400 shadow-md' : ''}
          ${uploadStatus === 'uploading' ? 'border-primary/40 bg-primary/5' : 'border-dashed border-gray-300 hover:border-primary cursor-pointer'}
          ${uploadStatus === 'error' ? 'border-red-400' : ''}
        `}
        onClick={uploadStatus !== 'uploading' ? handleNewUploadClick : undefined}
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
            <ImageIcon className="mx-auto h-14 w-14 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Click to select photo</h3>
            <p className="text-sm text-muted-foreground">
              JPG, PNG, WebP — max 5 MB
            </p>
          </div>
        )}
      </div>

      {/* Guidelines */}
      <div className="mb-8 text-sm text-gray-600">
        <h4 className="font-medium text-gray-800 mb-2">Photo guidelines:</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Less than 5 MB</li>
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
          disabled={isUploading || uploadStatus !== 'success'}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}