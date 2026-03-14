
'use client';
import ProfileCompletion from '@/components/profile-completion';
import { useProfile } from '@/components/profile-provider';

export default function MyProfilePage() {
    const { progress } = useProfile();
    const isProfileComplete = progress === 100;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">My Profile</h1>
            <p className="text-muted-foreground mb-8">
                {isProfileComplete ? "Your profile is complete. You can edit your details below." : "Complete your profile to find the best matches."}
            </p>
            <ProfileCompletion />
        </div>
    );
}
