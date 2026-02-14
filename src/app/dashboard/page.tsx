
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProfileSetup } from '@/components/profile-setup';
import { useProfile } from '@/components/profile-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Star, Crown } from 'lucide-react';
import Link from 'next/link';

function ProfileSetupHandler() {
  const searchParams = useSearchParams();
  const showSetup = searchParams.get('showSetup');
  const stepId = searchParams.get('stepId');

  if (showSetup || stepId) {
    return <ProfileSetup />;
  }

  return null;
}


function DashboardHome() {
    const { hasMembership, userData } = useProfile();
    const planName = userData?.membership?.plan || "Free";

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Your Plan</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            {hasMembership ? (
                                <>
                                    <Crown className="h-12 w-12 text-yellow-500 mx-auto" />
                                    <p className="text-xl font-bold mt-2">{planName} Plan</p>
                                    <p className="text-sm text-muted-foreground">You have full access to all features.</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-lg font-semibold">Free Plan</p>
                                    <p className="text-sm text-muted-foreground">Upgrade to connect with members.</p>
                                </>
                            )}
                            <Button asChild className="mt-4 w-full max-w-sm mx-auto">
                                <Link href="/dashboard/upgrade">
                                    <Star className="mr-2 h-4 w-4" />
                                    {hasMembership ? 'Manage Plan' : 'Upgrade Plan'}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}


export default function DashboardPage() {
    const { progress } = useProfile();
    const isProfileComplete = progress === 100;

    return (
        <div className="min-h-full">
            <main>
                { isProfileComplete ? (
                    <DashboardHome />
                ) : (
                    <div>
                        <h2 className="text-3xl font-bold">Welcome to Your Dashboard</h2>
                        <p className="text-muted-foreground mt-2">Please complete your profile to unlock all features.</p>
                         <Button asChild size="lg" className="mt-6">
                            <Link href="/dashboard/profile">
                                <Heart className="mr-2 h-5 w-5" />
                                Complete Your Profile
                            </Link>
                        </Button>
                    </div>
                )}
            </main>

            <Suspense fallback={null}>
              <ProfileSetupHandler />
            </Suspense>
        </div>
    )
}
