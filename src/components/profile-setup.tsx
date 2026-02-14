'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useRouter, useSearchParams } from 'next/navigation';
import { BasicInfoStep1 } from '@/components/steps/basic-info-step-1';
import { BasicInfoStep2 } from '@/components/steps/basic-info-step-2';
import { BasicInfoStep3 } from '@/components/steps/basic-info-step-3';
import { useProfile } from './profile-provider';
import { useFirebase } from '@/firebase/provider';
import { ref, update } from 'firebase/database';
import { useToast } from '@/hooks/use-toast';
import { Progress } from './ui/progress';
import { DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { PersonalInfoStep } from './steps/personal-info-step';
import { CareerInfoStep } from './steps/career-info-step';
import { FamilyInfoStep } from './steps/family-info-step';
import { PhotoUploadStep } from './steps/photo-upload-step';


export function ProfileSetup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { fetchUserData } = useProfile();
  const { auth, database } = useFirebase();

  const showSetupParam = searchParams.get('showSetup');
  const stepIdParam = searchParams.get('stepId');
  
  const [isOpen, setIsOpen] = useState(!!showSetupParam || !!stepIdParam);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const isModalTriggered = !!showSetupParam || !!stepIdParam;
    setIsOpen(isModalTriggered);

    if (stepIdParam) {
      setCurrentStep(1); // Reset for multi-step forms within a page
    } else if (showSetupParam) {
      setCurrentStep(1);
    }
  }, [showSetupParam, stepIdParam]);
  
  const activeFlowId = stepIdParam || (showSetupParam ? '1' : null);

  const totalStepsForFlow: { [key: string]: number } = {
    '1': 3, // Basic Info
    '2': 1, // Personal Info
    '3': 1, // Career Details
    '4': 1, // Family & Lifestyle
    '5': 1, // Photo Upload
  };

  const totalSteps = activeFlowId ? totalStepsForFlow[activeFlowId] : 1;
  const stepProgress = totalSteps > 1 ? Math.round(((currentStep - 1) / totalSteps) * 100) : 0;


  const handleClose = () => {
    router.replace('/dashboard', { scroll: false });
    // No need to set isOpen(false) here, as the URL change will trigger the effect
  };
  
  const onOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  const handleNext = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      handleClose();
    }
  };
  
  const handleFinalSubmit = async (data: any) => {
    const finalData = { ...formData, ...data };

    if (!auth?.currentUser || !database) {
      toast({
        variant: 'destructive',
        title: "Submission Failed",
        description: "User not authenticated or database not available."
      });
      return;
    }
    
    try {
      const userRef = ref(database, `users/${auth.currentUser.uid}`);
      
      const updates: { [key: string]: any } = {};
      updates['/basicInfo'] = finalData;
      updates['/progress/1'] = true;

      await update(userRef, updates);
      
      toast({
        title: "Basic Information Verified ✅",
        description: "Your basic information has been saved successfully.",
      });
      handleClose();

    } catch(error: any) {
       toast({
        variant: 'destructive',
        title: "Error",
        description: error.message || "Failed to save your details."
      });
    }
  };

  const renderStep = () => {
    if (!activeFlowId) return null;

    // Logic for which form to show
    const isFullPage = ['2', '3', '4', '5'].includes(activeFlowId);

    let content;
    switch (activeFlowId) {
      case '1':
        switch (currentStep) {
          case 1:
            content = <BasicInfoStep1 onContinue={handleNext} initialData={formData} />;
            break;
          case 2:
            content = <BasicInfoStep2 onBack={handleBack} onContinue={handleNext} initialData={formData} />;
            break;
          case 3:
            content = <BasicInfoStep3 onBack={handleBack} onContinue={handleFinalSubmit} initialData={formData} />;
            break;
          default:
            handleClose();
            return null;
        }
        break;
      case '2':
        content = <PersonalInfoStep onBack={handleClose} onContinue={handleClose} />;
        break;
      case '3':
        content = <CareerInfoStep onBack={handleClose} onContinue={handleClose} />;
        break;
      case '4':
        content = <FamilyInfoStep onBack={handleClose} onContinue={handleClose} />;
        break;
      case '5':
        content = <PhotoUploadStep onBack={handleClose} onContinue={handleClose} />;
        break;
      default:
        if (isOpen) handleClose();
        return null;
    }
    
    // Wrapper logic
    if (isFullPage) {
        return (
             <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
                <div className="container mx-auto px-4 py-8">
                    {content}
                </div>
            </div>
        )
    }

    // Default to modal for basic info
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[525px] p-0">
            <DialogHeader className="p-6 pb-0">
            <DialogTitle>Profile Setup</DialogTitle>
            <DialogDescription>
                Complete your profile to get the best matches.
            </DialogDescription>
            </DialogHeader>
            {totalSteps > 1 && (
                 <div className="px-6 pt-2 pb-4">
                    <Progress value={stepProgress} className="w-full" />
                    <p className="text-xs text-muted-foreground mt-2 text-center">Step {currentStep} of {totalSteps}</p>
                </div>
            )}
            <ScrollArea className="max-h-[70vh] border-t">
            {content}
            </ScrollArea>
        </DialogContent>
        </Dialog>
    )
  }

  return renderStep();
}
