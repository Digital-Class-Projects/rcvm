'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { plans } from '../upgrade/page';
import { CreditCard, Landmark, Wallet, CheckCircle, XCircle, Loader2, Copy, QrCode } from 'lucide-react';
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
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'qr'>('upi'); // default: UPI ID

  const upiId = '7038704804@ybl';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    toast({
      title: "UPI ID Copied!",
      description: upiId + " has been copied to your clipboard.",
      duration: 2000,
    });
  };

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
          paymentMode: paymentMethod === 'upi' ? 'UPI ID' : 'QR Scan',
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
        <p className="text-muted-foreground mt-2">
          Your {selectedPlan?.name} plan is now active. Redirecting...
        </p>
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
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>
          Pay <span className="font-bold">₹{selectedPlan.price}</span> for the{' '}
          <span className="font-bold">{selectedPlan.name}</span> plan
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Payment Method Selection */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={paymentMethod === 'upi' ? 'default' : 'outline'}
            className="h-14 flex flex-col gap-1"
            onClick={() => setPaymentMethod('upi')}
          >
            <Wallet className="h-5 w-5" />
            <span>UPI ID</span>
          </Button>

          <Button
            variant={paymentMethod === 'qr' ? 'default' : 'outline'}
            className="h-14 flex flex-col gap-1"
            onClick={() => setPaymentMethod('qr')}
          >
            <QrCode className="h-5 w-5" />
            <span>QR Code</span>
          </Button>
        </div>

        {/* Payment Content based on selection */}
        {paymentMethod === 'upi' ? (
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/20 text-center">
              <p className="text-lg font-medium mb-2">UPI ID</p>
              <div className="flex items-center justify-center gap-3">
                <code className="text-xl font-bold bg-background px-4 py-2 rounded border">
                  {upiId}
                </code>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCopyUpi}
                  className="h-10 w-10"
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Open your UPI app and pay to this ID
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 border rounded-md bg-muted/20 flex justify-center items-center">
            <Image
              src="https://ik.imagekit.io/rgazxzsxr/WhatsApp%20Image%202026-01-09%20at%204.16.57%20PM.jpeg"
              alt="Payment QR Code"
              width={250}
              height={250}
              className="rounded-md"
            />
          </div>
        )}

        <Button
          onClick={handlePayment}
          size="lg"
          className="w-full"
          disabled={paymentStatus === 'processing'}
        >
          {paymentStatus === 'processing' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'I have made the payment → Confirm'
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          This is a simulated payment process. After paying, click "Confirm Payment" to complete.
        </p>
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