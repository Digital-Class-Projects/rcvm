
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Image as ImageIcon, Upload, Loader2, X } from 'lucide-react';
import { useFirebase } from '@/firebase/provider';
import { ref as dbRef, update, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useToast } from '@/hooks/use-toast';
import { Card } from '../ui/card';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { Progress } from '../ui/progress';
import { useProfile } from '../profile-provider';
import { updateProfile } from 'firebase/auth';

export function PhotoUploadStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void; }) {
  const { auth, database } = useFirebase();
  const { fetchUserData } = useProfile();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Clean up the object URL on component unmount
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);
  
  const handleUpload = (file: File) => {
    if (!auth?.currentUser || !database) {
      toast({
        variant: 'destructive',
        title: "Upload Failed",
        description: "User not authenticated or database not available."
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    const storage = getStorage();
    const imageRef = storageRef(storage, `user-photos/${auth.currentUser.uid}/${uuidv4()}`);
    const uploadTask = uploadBytesResumable(imageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      }, 
      (error) => {
        setIsUploading(false);
        toast({
          variant: 'destructive',
          title: "Upload Error",
          description: error.message || "Failed to upload your photo. Please try again."
        });
        removePreview();
      }, 
      async () => {
        try {
          const newPhotoUrl = await getDownloadURL(uploadTask.snapshot.ref);
          const user = auth.currentUser!;
          const userRef = dbRef(database, `users/${user.uid}`);
          
          const userSnapshot = await get(userRef);
          const existingData = userSnapshot.val();
          const existingPhotos = existingData.photos || [];

          const allPhotoUrls = [...existingPhotos, newPhotoUrl];
          
          const isFirstUpload = !existingData.photoURL;

          const updates: { [key: string]: any } = {};
          updates['/photos'] = allPhotoUrls;
          if (isFirstUpload) {
              updates['/photoURL'] = allPhotoUrls[0]; 
          }
          updates['/progress/5'] = true;

          await update(userRef, updates);

          if (isFirstUpload) {
            await updateProfile(user, { photoURL: allPhotoUrls[0] });
          }
          
          fetchUserData();
          
          toast({
            title: "Photo Uploaded Successfully!",
            description: "Your new photo has been added to your profile.",
          });
          onContinue();

        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: "Database Error",
            description: error.message || "Failed to save photo details."
          });
        } finally {
          setIsUploading(false);
          removePreview();
        }
      }
    );
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (preview) {
          URL.revokeObjectURL(preview);
      }
      setPreview(URL.createObjectURL(file));
      handleUpload(file);
    }
  };
  
  const removePreview = () => {
      if (preview) {
          URL.revokeObjectURL(preview);
      }
      setPreview(null);
      // Also reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
  }


  return (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" className="mr-4 hover:bg-gray-100 rounded-full" type="button" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Add a Photo to Your Profile</h2>
           <p className="text-muted-foreground">A picture is worth a thousand words. Show your best self!</p>
        </div>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        className="hidden" 
        accept="image/png, image/jpeg, image/webp"
        disabled={isUploading}
      />

      {isUploading ? (
        <div className="mb-6 text-center">
            <h3 className="text-lg font-medium mb-2">Uploading...</h3>
             {preview && (
              <div className="relative group w-40 h-40 mx-auto">
                  <Image src={preview} alt="Preview" width={160} height={160} className="rounded-lg object-cover w-full aspect-square" />
                   <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                   </div>
              </div>
            )}
            <div className="mt-4 max-w-sm mx-auto">
                <Progress value={uploadProgress} className="w-full h-2" />
                <p className="text-sm text-center text-muted-foreground mt-1">{Math.round(uploadProgress)}%</p>
            </div>
        </div>
      ) : (
        <Card className="p-6 border-dashed hover:border-primary transition-colors mb-6" onClick={() => fileInputRef.current?.click()} role="button">
            <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Click to select a photo
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your upload will start immediately.
                </p>
            </div>
        </Card>
      )}

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-500">Photo Guidelines:</h3>
        <ul className="mt-2 list-disc list-inside text-sm text-gray-500 space-y-1">
            <li>Photos must be less than 5 MB.</li>
            <li>Use a recent, clear photo of yourself.</li>
            <li>No group photos for the main profile picture.</li>
        </ul>
      </div>

       <div className="mt-8 flex justify-end">
        <Button onClick={onContinue} variant="secondary">
          Done
        </Button>
      </div>

    </div>
  );
}
