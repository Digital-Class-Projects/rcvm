'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PlanSelectionStep } from './steps/plan-selection-step';
// import { PaymentMethodStep } from './steps/payment-method-step';
// import { PaymentConfirmationStep } from './steps/payment-confirmation-step';
import { Progress } from './ui/progress';

export function Membership() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const totalSteps = 3;
  const stepProgress = Math.round(((currentStep - 1) / totalSteps) * 100);

  const handleNext = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleFinalSubmit = async (data: any) => {
    const finalData = { ...formData, ...data };
    console.log("Final submission:", finalData);
    // Logic to save to Firebase
    setIsOpen(false);
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PlanSelectionStep onContinue={handleNext} />;
    //   case 2:
    //     return <PaymentMethodStep onBack={handleBack} onContinue={handleNext} planData={formData} />;
    //   case 3:
    //     return <PaymentConfirmationStep onFinish={() => setIsOpen(false)} paymentData={formData} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold">Choose Your Membership Plan</DialogTitle>
          <DialogDescription>
            Congratulations! Your profile is complete. To start connecting, please select a membership plan.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-4">
          <Progress value={stepProgress} className="w-full" />
          <p className="text-xs text-muted-foreground mt-2 text-center">Step {currentStep} of {totalSteps}</p>
        </div>

        <div className="p-6 pt-0">
            {renderStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
