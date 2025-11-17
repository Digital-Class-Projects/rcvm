
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import { useFirebase } from '@/firebase/provider';
import { ref, update } from 'firebase/database';
import { useToast } from '@/hooks/use-toast';
import { Card } from '../ui/card';
import Image from 'next/image';

const FAKE_PHOTOS_COUNT = 6;

export function PhotoUploadStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void; }) {
  const { auth, database } = useFirebase();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!auth?.currentUser || !database) {
      toast({
        variant: 'destructive',
        title: "Upload Failed",
        description: "User not authenticated or database not available."
      });
      return;
    }
    
    setIsUploading(true);
    
    // This is a fake upload. In a real app, you'd use Firebase Storage.
    // We'll just save an array of placeholder URLs to the database.
    const fakePhotoUrls = Array.from({ length: FAKE_PHOTOS_COUNT }, (_, i) => 
      `https://picsum.photos/seed/${auth.currentUser!.uid}${i + 1}/400/500`
    );

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const userRef = ref(database, `users/${auth.currentUser.uid}`);
      const updates: { [key: string]: any } = {};
      updates['/photos'] = fakePhotoUrls;
      // Also update the primary photoURL to the first uploaded image
      updates['/photoURL'] = fakePhotoUrls[0]; 
      updates['/progress/5'] = true;

      await update(userRef, updates);
      
      toast({
        title: "Photos Uploaded!",
        description: "Your profile photos have been updated.",
      });
      onContinue();

    } catch(error: any) {
       toast({
        variant: 'destructive',
        title: "Error",
        description: error.message || "Failed to save your photos."
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" className="mr-4 hover:bg-gray-100 rounded-full" type="button" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Add Photos to Your Profile</h2>
           <p className="text-muted-foreground">A picture is worth a thousand words. Show your best self!</p>
        </div>
      </div>
      
      <Card className="p-6 border-dashed">
        <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Upload your photos
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You can upload up to 6 photos. Drag and drop or click to upload.
            </p>
            <div className="mt-6">
                <Button onClick={handleUpload} disabled={isUploading}>
                    {isUploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Upload className="mr-2 h-4 w-4" />
                    )}
                    {isUploading ? 'Uploading...' : 'Upload Photos'}
                </Button>
            </div>
        </div>
      </Card>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-500">Photo Guidelines:</h3>
        <ul className="mt-2 list-disc list-inside text-sm text-gray-500 space-y-1">
            <li>Photos must be less than 15 MB.</li>
            <li>Use recent, clear photos of yourself.</li>
            <li>Allowed formats: JPG, PNG, WEBP.</li>
            <li>No group photos for the main profile picture.</li>
        </ul>
      </div>

    </div>
  );
}
