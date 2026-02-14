
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
import Image from 'next/image';

function PaymentGateway() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planName = searchParams.get('plan');
  const selectedPlan = plans.find((p) => p.name === planName);
  
  const { auth, database } = useFirebase();
  const { fetchUserData } = useProfile();

  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

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
            paymentMode: 'QR Scan',
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
      <CardHeader className="text-center">
        <CardTitle>Scan to Pay</CardTitle>
        <CardDescription>
          Pay <span className="font-bold">₹{selectedPlan.price}</span> for the{' '}
          <span className="font-bold">{selectedPlan.name}</span> plan using any UPI app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 border rounded-md bg-muted/20 flex justify-center items-center">
             <Image src="https://ik.imagekit.io/rgazxzsxr/WhatsApp%20Image%202026-01-09%20at%204.16.57%20PM.jpeg" alt="Payment QR Code" width={250} height={250} />
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
          {paymentStatus === 'processing' ? 'Processing...' : `Confirm Payment`}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-4">This is a simulated payment. After scanning, click "Confirm Payment" to complete the process.</p>
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
