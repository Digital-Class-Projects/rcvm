
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

export const plans = [
  {
    name: 'Silver',
    price: 1000,
    duration: "6 Months",
    features: ['View unlimited profiles', 'Send 50 interests', 'Basic chat access', 'Standard customer support'],
    popular: false,
  },
  {
    name: 'Gold',
    price: 1500,
    duration: "1 Year",
    features: ['All Silver features', 'Send unlimited interests', 'Priority customer support', 'Profile boost for better visibility', 'View matching horoscopes'],
    popular: true,
  },
];

const schema = z.object({
  planName: z.string({ required_error: "Please select a plan." }),
});

export default function UpgradePage() {
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      planName: 'Gold',
    },
  });

  const selectedPlanName = methods.watch('planName');
  
  const onSubmit = (data: any) => {
    console.log(data);
    // Navigate to checkout page with selected plan
  };

  return (
     <div className="w-full max-w-5xl mx-auto py-8">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground">Choose Your Perfect Plan</h1>
            <p className="text-muted-foreground mt-2">Unlock premium features to find your ideal match faster.</p>
        </div>
        <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 gap-8 items-start">
            {plans.map((plan) => (
                <Card
                key={plan.name}
                className={cn(
                    'cursor-pointer transition-all relative overflow-hidden',
                    selectedPlanName === plan.name
                    ? 'border-primary ring-2 ring-primary shadow-lg'
                    : 'border-border hover:shadow-md'
                )}
                onClick={() => methods.setValue('planName', plan.name)}
                >
                {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5" style={{clipPath: 'polygon(100% 0, 0 0, 100% 100%)'}}>
                        <Star className="w-4 h-4 absolute top-1 right-5 text-white" />
                    </div>
                )}
                <CardHeader className="pt-8">
                    <CardTitle className="text-3xl font-bold">{plan.name}</CardTitle>
                    <CardDescription>
                        <span className="text-4xl font-bold text-foreground">₹{plan.price}</span> / {plan.duration}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4 text-sm">
                    {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span>{feature}</span>
                        </li>
                    ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button
                        type="button"
                        className={cn('w-full', selectedPlanName === plan.name ? '' : 'bg-muted text-muted-foreground')}
                        variant={selectedPlanName === plan.name ? 'default' : 'outline'}
                        onClick={() => methods.setValue('planName', plan.name)}
                    >
                        {selectedPlanName === plan.name ? 'Plan Selected' : 'Select Plan'}
                    </Button>
                </CardFooter>
                </Card>
            ))}
            </div>

            <div className="mt-12 flex justify-center">
                <Button asChild size="lg" className="rounded-full px-12 py-6 text-lg">
                    <Link href={`/dashboard/checkout?plan=${selectedPlanName}`}>
                        Proceed to Checkout
                    </Link>
                </Button>
            </div>
        </form>
        </FormProvider>
     </div>
  );
}
