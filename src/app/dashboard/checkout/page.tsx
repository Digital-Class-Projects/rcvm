
'use client';

import { useSearchParams } from 'next/navigation';
import { plans } from '../upgrade/page';
import { Suspense } from 'react';
import { useFirebase } from '@/firebase/provider';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Check, CreditCard, Landmark, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  fatherName: z.string().min(2, "Father's name is required"),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'A valid phone number is required'),
  address: z.string().min(10, 'Address is required'),
});

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planName = searchParams.get('plan');
  const selectedPlan = plans.find((p) => p.name === planName);
  const { auth } = useFirebase();

  const methods = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: auth?.currentUser?.displayName || '',
      email: auth?.currentUser?.email || '',
      phone: auth?.currentUser?.phoneNumber || '',
      fatherName: '',
      address: '',
    },
  });

  const onSubmit = (data: z.infer<typeof checkoutSchema>) => {
    // In a real app, you would save this data and then proceed to payment
    console.log('Checkout Data:', data);
    router.push(`/dashboard/payment?plan=${planName}`);
  };

  if (!selectedPlan) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Invalid Plan</h2>
        <p className="text-muted-foreground">Please go back and select a valid plan.</p>
        <Button onClick={() => router.push('/dashboard/upgrade')} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-2 gap-12">
          {/* Form Fields */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Billing Information</h2>
            <div className="space-y-4">
              <FormField
                control={methods.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={methods.control}
                name="fatherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Father's Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={methods.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={methods.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={methods.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:mt-12">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your selected plan before proceeding.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between font-bold">
                    <span>{selectedPlan.name} Plan</span>
                    <span>₹{selectedPlan.price}</span>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {selectedPlan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{selectedPlan.price}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                 <Button type="submit" size="lg" className="w-full">
                    Proceed to Payment
                  </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}


export default function CheckoutPage() {
    return (
        <div className="w-full max-w-6xl mx-auto py-12">
            <Suspense fallback={<div>Loading plan...</div>}>
                <CheckoutForm />
            </Suspense>
        </div>
    );
}
