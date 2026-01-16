'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useFirebase } from '@/firebase/provider';
import { ref, onValue } from 'firebase/database';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, User, Briefcase, Home, Star, Camera } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge';

function ProfileDetails({ profile }: { profile: any }) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>About</CardTitle></CardHeader>
                <CardContent>
                    <p>{profile.careerInfo?.aboutYourself || 'No details provided.'}</p>
                </CardContent>
            </Card>

             <Card>
                <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div><span className="font-semibold">Born:</span> {profile.personalInfo?.dob}</div>
                    <div><span className="font-semibold">Birth Place:</span> {profile.personalInfo?.birthPlace}</div>
                    <div><span className="font-semibold">Nationality:</span> {profile.personalInfo?.nationality}</div>
                    <div><span className="font-semibold">Marital Status:</span> {profile.personalInfo?.maritalStatus}</div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader><CardTitle>Career Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div><span className="font-semibold">Occupation:</span> {profile.careerInfo?.occupation}</div>
                    <div><span className="font-semibold">Income:</span> {profile.careerInfo?.annualIncome}</div>
                    <div><span className="font-semibold">Employed In:</span> {profile.careerInfo?.employedIn}</div>
                    <div><span className="font-semibold">Highest Qualification:</span> {profile.careerInfo?.highestQualification}</div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader><CardTitle>Family Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div><span className="font-semibold">Family Type:</span> {profile.familyInfo?.familyType}</div>
                    <div><span className="font-semibold">Family Status:</span> {profile.familyInfo?.familyStatus}</div>
                    <div><span className="font-semibold">Father's Occupation:</span> {profile.familyInfo?.fatherOccupation}</div>
                    <div><span className="font-semibold">Mother's Occupation:</span> {profile.familyInfo?.motherOccupation}</div>
                </CardContent>
            </Card>
        </div>
    )
}

function PhotoGallery({ photos }: { photos: string[] }) {
    if (!photos || photos.length === 0) {
        return (
            <Card>
                <CardHeader><CardTitle>Photo Gallery</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No photos uploaded yet.</p>
                </CardContent>
            </Card>
        );
    }

    return (
         <Card>
            <CardHeader><CardTitle>Photo Gallery</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square w-full overflow-hidden rounded-lg">
                        <Image src={photo} alt={`Profile photo ${index + 1}`} fill className="object-cover" />
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

export default function ProfilePage() {
    const params = useParams();
    const { uid } = params;
    const { database } = useFirebase();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!uid || !database) return;
        setLoading(true);
        const userRef = ref(database, `users/${uid}`);
        const unsubscribe = onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                setProfile(snapshot.val());
            } else {
                console.log("No profile found");
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [uid, database]);

    if (loading) {
        return <div>Loading profile...</div>;
    }

    if (!profile) {
        return <div>Profile not found.</div>;
    }

    return (
        <div className="max-w-6xl mx-auto">
            <Card className="mb-8 overflow-hidden">
                <div className="relative h-48 bg-gray-200">
                    <Image src={profile.photos?.[1] || `https://picsum.photos/seed/${uid}-banner/1200/200`} alt="Profile banner" fill className="object-cover"/>
                     <div className="absolute inset-0 bg-black/30" />
                </div>
                <div className="p-6 sm:flex sm:items-end sm:gap-6 -mt-20">
                   <div className="relative w-36 h-36 rounded-full border-4 border-white shadow-lg">
                     <Image src={profile.photoURL || `https://picsum.photos/seed/${uid}/200/200`} alt={profile.name} fill className="object-cover rounded-full" />
                   </div>
                   <div className="mt-4 sm:mt-0">
                     <h1 className="text-3xl font-bold">{profile.name}</h1>
                     <p className="text-muted-foreground">{profile.careerInfo?.occupation} | {profile.personalInfo?.birthPlace}</p>
                     <Badge variant="secondary" className="mt-2">{profile.membership?.plan ? `${profile.membership.plan} Member` : 'Free Member'}</Badge>
                   </div>
                   <div className="sm:ml-auto mt-4 sm:mt-0 flex gap-2">
                        <Button size="lg"><Heart className="mr-2 h-5 w-5"/> Send Interest</Button>
                        <Button size="lg" variant="outline"><MessageCircle className="mr-2 h-5 w-5"/> Message</Button>
                   </div>
                </div>
            </Card>

            <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Full Details</TabsTrigger>
                    <TabsTrigger value="gallery">Photo Gallery</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-6">
                   <ProfileDetails profile={profile} />
                </TabsContent>
                <TabsContent value="gallery" className="mt-6">
                    <PhotoGallery photos={profile.photos || []} />
                </TabsContent>
            </Tabs>

        </div>
    );
}
