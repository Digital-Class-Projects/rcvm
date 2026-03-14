
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFirebase } from '@/firebase/provider';
import { useProfile } from '@/components/profile-provider';
import { ref, onValue, set, get, serverTimestamp } from 'firebase/database';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, Star, Filter } from 'lucide-react';
import Link from 'next/link';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from 'next/navigation';

const FilterSection = ({ filters, setFilters, cities, religions, occupations }: any) => {
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value === 'all' ? '' : value }));
  };

  return (
    <Card className="mb-8">
      <Collapsible>
        <CollapsibleTrigger asChild>
          <div className="p-4 flex justify-between items-center cursor-pointer">
            <h3 className="text-xl font-bold">Filter Profiles</h3>
            <Button variant="ghost" size="icon">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>City</Label>
              <Select onValueChange={(value) => handleFilterChange('city', value)} value={filters.city || 'all'}>
                <SelectTrigger>
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city: string) => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Religion</Label>
               <Select onValueChange={(value) => handleFilterChange('religion', value)} value={filters.religion || 'all'}>
                <SelectTrigger>
                  <SelectValue placeholder="All Religions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Religions</SelectItem>
                  {religions.map((r: string) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label>Manglik</Label>
              <Select onValueChange={(value) => handleFilterChange('manglik', value)} value={filters.manglik || 'all'}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Don't Know">Don't Know</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label>Occupation</Label>
              <Select onValueChange={(value) => handleFilterChange('occupation', value)} value={filters.occupation || 'all'}>
                <SelectTrigger>
                  <SelectValue placeholder="All Occupations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Occupations</SelectItem>
                   {occupations.map((o: string) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

function MatchingProfiles() {
    const { database, auth } = useFirebase();
    const { userData: currentUserData } = useProfile();
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [interests, setInterests] = useState<{[key: string]: any}>({});
    const [filters, setFilters] = useState({ city: '', religion: '', manglik: '', occupation: '' });
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (!database || !auth?.currentUser) return;
        const usersRef = ref(database, 'users');
        const interestsRef = ref(database, 'interests');

        const unsubscribeUsers = onValue(usersRef, (snapshot) => {
            const usersData = snapshot.val();
            if (usersData) {
                const usersList = Object.keys(usersData)
                  .map(key => ({
                      ...usersData[key],
                      uid: key,
                  }))
                  .filter(user => user && user.uid && user.name);
                setAllUsers(usersList);
            }
        });

        const unsubscribeInterests = onValue(interestsRef, (snapshot) => {
            setInterests(snapshot.val() || {});
        });

        return () => {
            unsubscribeUsers();
            unsubscribeInterests();
        };
    }, [database, auth?.currentUser]);

    const { cities, religions, occupations } = useMemo(() => {
        const citySet = new Set<string>();
        const religionSet = new Set<string>();
        const occupationSet = new Set<string>();

        allUsers.forEach(user => {
            if (user.personalInfo?.birthPlace) citySet.add(user.personalInfo.birthPlace);
            if (user.basicInfo?.religion) religionSet.add(user.basicInfo.religion);
            if (user.careerInfo?.occupation) occupationSet.add(user.careerInfo.occupation);
        });

        return {
            cities: Array.from(citySet).filter(Boolean),
            religions: Array.from(religionSet).filter(Boolean),
            occupations: Array.from(occupationSet).filter(Boolean),
        };
    }, [allUsers]);

    const filteredProfiles = useMemo(() => {
        if (!currentUserData) return [];

        const currentUserGender = currentUserData.basicInfo?.gender;
        const targetGender = currentUserGender === 'Male' ? 'Female' : 'Male';

        return allUsers.filter(user => {
            if (!user.uid || user.uid === auth?.currentUser?.uid) return false;
            if (user.basicInfo?.gender !== targetGender) return false;
            if (filters.city && user.personalInfo?.birthPlace !== filters.city) return false;
            if (filters.religion && user.basicInfo?.religion !== filters.religion) return false;
            if (filters.manglik && user.careerInfo?.manglik !== filters.manglik) return false;
            if (filters.occupation && user.careerInfo?.occupation !== filters.occupation) return false;
            return true;
        });
    }, [allUsers, currentUserData, filters, auth?.currentUser?.uid]);
    
    const handleSendInterest = async (receiverProfile: any) => {
        if (!auth?.currentUser || !database || !currentUserData) {
             toast({
                variant: 'destructive',
                title: 'Error',
                description: 'You must be logged in to send an interest.',
            });
            return;
        }

        const senderId = auth.currentUser.uid;
        const receiverId = receiverProfile.uid;
        const interestId = `${senderId}_${receiverId}`;
        const interestRef = ref(database, `interests/${interestId}`);

        try {
            const snapshot = await get(interestRef);
            if (snapshot.exists()) {
                toast({
                    title: 'Already Sent',
                    description: `You have already sent an interest to ${receiverProfile.name}.`,
                });
                return;
            }

            await set(interestRef, {
                senderId: senderId,
                senderName: currentUserData.name,
                receiverId: receiverId,
                receiverName: receiverProfile.name,
                status: 'pending',
                createdAt: serverTimestamp(),
            });

            toast({
                title: 'Interest Sent!',
                description: `Your interest has been sent to ${receiverProfile.name}.`,
            });
        } catch (error) {
            console.error("Failed to send interest:", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to send interest. Please try again.',
            });
        }
    };
    
    const hasSentInterest = (receiverId: string) => {
        if (!auth?.currentUser) return false;
        const interestId = `${auth.currentUser.uid}_${receiverId}`;
        return !!interests[interestId];
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">✨ Matching Profiles For You</h2>
            <FilterSection filters={filters} setFilters={setFilters} cities={cities} religions={religions} occupations={occupations} />

             {filteredProfiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProfiles.map(profile => (
                        <Card key={profile.uid} className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="p-0 cursor-pointer" onClick={() => router.push(`/dashboard/profile/${profile.uid}`)}>
                                <div className="relative aspect-[4/5]">
                                    <Image src={profile.photoURL || `https://picsum.photos/seed/${profile.uid}/400/500`} alt={profile.name} fill className="object-cover transition-transform duration-300 group-hover:scale-110" data-ai-hint="person portrait" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-4 text-white">
                                        <h3 className="text-xl font-bold">{profile.name}</h3>
                                        <p className="text-sm">{profile.careerInfo?.occupation} | {profile.personalInfo?.birthPlace}</p>
                                    </div>
                                    <div className="absolute top-2 right-2 bg-accent/80 text-accent-foreground p-2 rounded-full backdrop-blur-sm">
                                        <Star className="w-5 h-5 fill-current" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 flex justify-around items-center bg-background">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button className='rounded-full' disabled={hasSentInterest(profile.uid)}>
                                            <Heart className="w-4 h-4 mr-2" />
                                            {hasSentInterest(profile.uid) ? 'Interest Sent' : 'Send Interest'}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Confirm Interest</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to send an interest to {profile.name}?
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleSendInterest(profile)}>Send</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No matching profiles found. Try adjusting your filters.</p>
                </div>
            )}
        </div>
    );
}

export default function MatchesPage() {
    const { progress, hasMembership } = useProfile();
    const isProfileComplete = progress === 100;

    if (!isProfileComplete || !hasMembership) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold">Complete Your Profile & Upgrade</h2>
                <p className="text-muted-foreground mt-2">Please complete your profile and purchase a plan to view matches.</p>
                 <Button asChild className="mt-4">
                    <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
            </div>
        )
    }

    return <MatchingProfiles />;
}
