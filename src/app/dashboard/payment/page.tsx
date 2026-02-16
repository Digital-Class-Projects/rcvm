'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { plans } from '../upgrade/page';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useFirebase } from '@/firebase/provider';
import { ref, update } from 'firebase/database';
import { useProfile } from '@/components/profile-provider';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import * as z from 'zod';


const paymentDetailsSchema = z.object({
  utr: z.string().length(12, 'UTR number must be exactly 12 characters long.'),
  bankName: z.string().min(3, 'Bank name is required.'),
  upiId: z.string().min(3, 'A valid UPI ID is required.'),
});


function PaymentGateway() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planName = searchParams.get('plan');
  const selectedPlan = plans.find((p) => p.name === planName);
  
  const { auth, database } = useFirebase();
  const { fetchUserData } = useProfile();

  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'pending_verification' | 'failed'>('idle');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const form = useForm<z.infer<typeof paymentDetailsSchema>>({
    resolver: zodResolver(paymentDetailsSchema),
    defaultValues: {
      utr: '',
      bankName: '',
      upiId: '',
    }
  });


  const handlePaymentDetailsSubmit = async (values: z.infer<typeof paymentDetailsSchema>) => {
    if (!auth?.currentUser || !database || !selectedPlan) {
        setPaymentStatus('failed');
        return;
    }

    setPaymentStatus('processing');
    
    try {
        const userRef = ref(database, `users/${auth.currentUser.uid}`);
        
        const paymentData = {
            planName: selectedPlan.name,
            planPrice: selectedPlan.price,
            paymentMode: 'QR Scan',
            paymentStatus: "Pending",
            transactionId: values.utr,
            utr: values.utr,
            bankName: values.bankName,
            upiId: values.upiId,
            paymentDate: new Date().toISOString(),
        };

        const updates: { [key: string]: any } = {};
        updates['/payment'] = paymentData;

        await update(userRef, updates);
        fetchUserData();
        
        setPaymentStatus('pending_verification');
        setIsFormOpen(false);
        
        setTimeout(() => {
            router.push('/dashboard');
        }, 3000);

    } catch (error) {
        console.error("Failed to save payment info:", error);
        setPaymentStatus('failed');
    }
  };
  
  if (paymentStatus === 'pending_verification') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <CheckCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-yellow-600">Verification Pending</h2>
        <p className="text-muted-foreground mt-2">Your payment details have been submitted. Your plan will be activated after admin approval. Redirecting...</p>
      </motion.div>
    );
  }

  if (paymentStatus === 'failed') {
     return (
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-destructive">Submission Failed</h2>
        <p className="text-muted-foreground mt-2">Something went wrong. Please try again.</p>
        <Button onClick={() => { setPaymentStatus('idle'); form.reset(); }} className="mt-4">
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

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button
                    size="lg"
                    className="w-full mt-6"
                    disabled={paymentStatus === 'processing'}
                >
                    Confirm Payment
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Your Payment</DialogTitle>
                    <DialogDescription>
                        Please enter the transaction details to help us verify your payment.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handlePaymentDetailsSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="utr"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>UTR / Transaction ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter 12-digit UTR" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="bankName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bank Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your bank's name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="upiId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your UPI ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="yourname@bank" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <DialogFooter>
                            <Button type="submit" disabled={form.formState.isSubmitting || paymentStatus === 'processing'}>
                                {paymentStatus === 'processing' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {paymentStatus === 'processing' ? 'Submitting...' : 'Submit for Verification'}
                            </Button>
                         </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
        <p className="text-xs text-muted-foreground text-center mt-4">After payment, click "Confirm Payment" and enter transaction details.</p>
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
