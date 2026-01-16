'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useProfile } from '@/components/profile-provider';
import { Button } from './ui/button';
import { CheckCircle, Circle, Edit, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirebase } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';


export default function ProfileCompletion() {
  const { progress, steps, hasMembership } = useProfile();
  const { auth } = useFirebase();
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!auth?.currentUser) {
    return null;
  }

  const handleStepClick = (stepId: string) => {
    // Prevent opening step forms if a setup flow is already active
     if (searchParams.has('showSetup') && !searchParams.has('stepId')) return;

     router.push(`/dashboard?stepId=${stepId}`, { scroll: false });
  };

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
              {progress < 100
                ? "You're almost there! Complete the following steps to get the best matches."
                : "Congratulations! Your profile is complete."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Progress value={progress} className="w-full" />
              <span className="text-lg font-semibold text-primary">
                {progress}%
              </span>
            </div>
            <ul className="space-y-4 mt-6">
              {steps.map((step) => (
                <li key={step.id}>
                  <div
                    className={cn(
                      'flex justify-between items-center p-4 h-auto border rounded-lg transition-colors',
                      'cursor-pointer hover:bg-accent/20'
                    )}
                    onClick={() => handleStepClick(step.id)}
                    role={'button'}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleStepClick(step.id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {step.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-muted-foreground" />
                      )}
                      <div>
                        <span className="font-semibold text-lg">{step.title}</span>
                         <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleStepClick(step.id); }} aria-label={`Edit ${step.title}`}>
                      <Edit className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
          {progress === 100 && !hasMembership && (
            <CardFooter className="border-t px-6 py-4">
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h3 className="font-bold">Unlock Your Matches</h3>
                        <p className="text-sm text-muted-foreground">Upgrade your plan to start connecting with profiles.</p>
                    </div>
                    <Button asChild>
                        <Link href="/dashboard/upgrade">
                            <Star className="mr-2 h-4 w-4" />
                            Upgrade Your Plan
                        </Link>
                    </Button>
                </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </section>
  );
}
