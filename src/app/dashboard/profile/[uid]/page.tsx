
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useFirebase } from '@/firebase/provider';
import { ref, onValue } from 'firebase/database';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

function DetailItem({ label, value }: { label: string, value?: string | null }) {
    if (!value) return null;
    return (
        <div><span className="font-semibold">{label}:</span> {value}</div>
    );
}

function ProfileDetails({ profile }: { profile: any }) {
    const lifestyleHabits = profile.familyInfo?.lifestyleHabits || [];
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>About</CardTitle></CardHeader>
                <CardContent>
                    <p>{profile.careerInfo?.aboutYourself || 'No details provided.'}</p>
                </CardContent>
            </Card>

             <Card>
                <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Gender" value={profile.basicInfo?.gender} />
                    <DetailItem label="Date of Birth" value={profile.basicInfo?.dob} />
                    <DetailItem label="Age" value={profile.basicInfo?.age} />
                    <DetailItem label="Religion" value={profile.basicInfo?.religion} />
                    <DetailItem label="Mother Tongue" value={profile.basicInfo?.motherTongue} />
                    <DetailItem label="Caste" value={profile.basicInfo?.caste} />
                </CardContent>
            </Card>

             <Card>
                <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Marital Status" value={profile.personalInfo?.maritalStatus} />
                    <DetailItem label="Birth Place" value={profile.personalInfo?.birthPlace} />
                    <DetailItem label="Nationality" value={profile.personalInfo?.nationality} />
                    <DetailItem label="Blood Group" value={profile.personalInfo?.bloodGroup} />
                    <DetailItem label="Contact Number" value={profile.personalInfo?.contactNumber} />
                    <DetailItem label="Current Address" value={profile.personalInfo?.currentAddress} />
                    <DetailItem label="Permanent Address" value={profile.personalInfo?.permanentAddress} />
                    <DetailItem label="Hobbies" value={profile.personalInfo?.hobbies} />
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader><CardTitle>Career Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Highest Qualification" value={profile.careerInfo?.highestQualification} />
                    <DetailItem label="Additional Qualification" value={profile.careerInfo?.additionalQualification} />
                    <DetailItem label="University" value={profile.careerInfo?.university} />
                    <DetailItem label="Occupation" value={profile.careerInfo?.occupation} />
                    <DetailItem label="Employed In" value={profile.careerInfo?.employedIn} />
                    <DetailItem label="Company Name" value={profile.careerInfo?.companyName} />
                    <DetailItem label="Designation" value={profile.careerInfo?.designation} />
                    <DetailItem label="Work Location" value={profile.careerInfo?.workLocation} />
                    <DetailItem label="Annual Income" value={profile.careerInfo?.annualIncome} />
                    <DetailItem label="Skills" value={profile.careerInfo?.skills} />
                    <DetailItem label="Manglik" value={profile.careerInfo?.manglik} />
                </CardContent>
            </Card>

             <Card>
                <CardHeader><CardTitle>Family Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailItem label="Family Type" value={profile.familyInfo?.familyType} />
                        <DetailItem label="Family Status" value={profile.familyInfo?.familyStatus} />
                        <DetailItem label="Family Income" value={profile.familyInfo?.familyIncome} />
                        <DetailItem label="Family Values" value={profile.familyInfo?.familyValues} />
                        <DetailItem label="Father's Occupation" value={profile.familyInfo?.fatherOccupation} />
                        <DetailItem label="Mother's Occupation" value={profile.familyInfo?.motherOccupation} />
                        <DetailItem label="Brothers" value={profile.familyInfo?.brothers} />
                        <DetailItem label="Sisters" value={profile.familyInfo?.sisters} />
                        <DetailItem label="Married Brothers" value={profile.familyInfo?.marriedBrothers} />
                        <DetailItem label="Married Sisters" value={profile.familyInfo?.marriedSisters} />
                        <DetailItem label="Native Place" value={profile.familyInfo?.nativePlace} />
                    </div>
                    {lifestyleHabits.length > 0 && (
                        <div>
                            <span className="font-semibold">Lifestyle Habits:</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {lifestyleHabits.map((habit: string) => <Badge key={habit} variant="secondary">{habit.charAt(0).toUpperCase() + habit.slice(1)}</Badge>)}
                            </div>
                        </div>
                    )}
                    {profile.familyInfo?.aboutFamily && <p className="mt-4"><span className="font-semibold">About Family:</span> {profile.familyInfo.aboutFamily}</p>}
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
                    <Dialog key={index}>
                        <DialogTrigger asChild>
                            <div className="relative aspect-square w-full overflow-hidden rounded-lg cursor-pointer group">
                                <Image src={photo} alt={`Profile photo ${index + 1}`} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl p-0 border-0 bg-transparent shadow-none">
                            <Image src={photo} alt={`Profile photo ${index + 1}`} width={800} height={1000} className="w-full h-auto rounded-lg object-contain" />
                        </DialogContent>
                    </Dialog>
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
                    <PhotoGallery photos={profile.photos || [profile.photoURL].filter(Boolean)} />
                </TabsContent>
            </Tabs>

        </div>
    );
}
