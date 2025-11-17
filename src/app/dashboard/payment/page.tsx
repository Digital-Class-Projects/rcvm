
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { plans } from '../upgrade/page';
import { CreditCard, Landmark, Wallet, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useFirebase } from '@/firebase/provider';
import { ref, update, serverTimestamp } from 'firebase/database';
import { useProfile } from '@/components/profile-provider';

function PaymentGateway() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planName = searchParams.get('plan');
  const selectedPlan = plans.find((p) => p.name === planName);
  
  const { auth, database } = useFirebase();
  const { fetchUserData } = useProfile();

  const [selectedMethod, setSelectedMethod] = useState('UPI');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  const paymentMethods = [
    { name: 'UPI', icon: <p className='font-bold text-sm'>UPI</p> },
    { name: 'Credit/Debit Card', icon: <CreditCard /> },
    { name: 'Net Banking', icon: <Landmark /> },
    { name: 'Wallet', icon: <Wallet /> },
  ];

  const handlePayment = async () => {
    if (!auth?.currentUser || !database || !selectedPlan) {
        setPaymentStatus('failed');
        return;
    }

    setPaymentStatus('processing');
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    // In a real app, payment would be confirmed by a backend service
    const isSuccess = Math.random() > 0.1; // 90% success rate

    if (isSuccess) {
      try {
        const userRef = ref(database, `users/${auth.currentUser.uid}`);
        const transactionId = `FAKE-${Date.now()}`;
        const paymentDate = new Date().toISOString();
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + (selectedPlan.name === 'Gold' ? 6 : 2));

        const updates: { [key: string]: any } = {};
        updates['/payment'] = {
            planName: selectedPlan.name,
            planPrice: selectedPlan.price,
            paymentMode: selectedMethod,
            paymentStatus: "Success",
            transactionId: transactionId,
            paymentDate: paymentDate,
        };
        updates['/membership'] = {
            plan: selectedPlan.name,
            expiryDate: expiryDate.toISOString(),
            features: selectedPlan.features,
        };

        await update(userRef, updates);
        fetchUserData(); // Force a refetch of user data
        
        setPaymentStatus('success');
        await new Promise((resolve) => setTimeout(resolve, 2000));
        router.push('/dashboard'); // Redirect to dashboard after success

      } catch (error) {
        console.error("Failed to save payment info:", error);
        setPaymentStatus('failed');
      }
    } else {
      setPaymentStatus('failed');
    }
  };

  if (paymentStatus === 'success') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-green-500">Payment Successful!</h2>
        <p className="text-muted-foreground mt-2">Your {selectedPlan?.name} plan is now active. Redirecting...</p>
      </motion.div>
    );
  }

  if (paymentStatus === 'failed') {
     return (
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-destructive">Payment Failed</h2>
        <p className="text-muted-foreground mt-2">Something went wrong. Please try again.</p>
        <Button onClick={() => setPaymentStatus('idle')} className="mt-4">
          Try Again
        </Button>
      </motion.div>
    );
  }

  if (!selectedPlan) {
    return <div>Invalid plan selected.</div>;
  }
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>
          You are paying <span className="font-bold">₹{selectedPlan.price}</span> for the{' '}
          <span className="font-bold">{selectedPlan.name}</span> plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="font-semibold mb-2">Select Payment Method:</p>
          <div className="flex gap-2">
            {paymentMethods.map((method) => (
              <Button
                key={method.name}
                variant={selectedMethod === method.name ? 'default' : 'outline'}
                onClick={() => setSelectedMethod(method.name)}
                className="flex-1"
              >
                {method.icon}
                <span className="ml-2 hidden sm:inline">{method.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Fake payment form based on selection */}
        <div className="p-4 border rounded-md bg-muted/20 min-h-[150px]">
          <p className="text-sm text-muted-foreground">This is a simulated payment gateway. No real transaction will occur.</p>
           {selectedMethod === 'UPI' && (
            <div className="mt-4 text-center">
                <p className="font-semibold">Scan to Pay with any UPI App</p>
                <div className="w-32 h-32 bg-gray-200 mx-auto mt-2 flex items-center justify-center">
                   <p className='text-xs p-2'>Fake QR Code</p>
                </div>
            </div>
           )}
            {selectedMethod === 'Credit/Debit Card' && (
            <div className="mt-4 space-y-2">
                <Input placeholder="Card Number (e.g., 1234...)" />
                <div className="flex gap-2">
                    <Input placeholder="MM/YY" />
                    <Input placeholder="CVV" />
                </div>
            </div>
           )}
           {/* Other methods would have similar fake UI */}
        </div>

        <Button
          onClick={handlePayment}
          size="lg"
          className="w-full mt-6"
          disabled={paymentStatus === 'processing'}
        >
          {paymentStatus === 'processing' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {paymentStatus === 'processing' ? 'Processing...' : `Pay ₹${selectedPlan.price}`}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function PaymentPage() {
    return (
        <div className="w-full flex items-center justify-center py-12">
            <Suspense fallback={<div>Loading payment options...</div>}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key="payment-gateway"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <PaymentGateway />
                    </motion.div>
                </AnimatePresence>
            </Suspense>
        </div>
    );
}
