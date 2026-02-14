'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

const plans = [
  {
    name: 'Silver',
    price: 999,
    durations: [
        { label: '3 Months', value: 3, price: 999 },
    ],
    features: ['View contacts', 'Basic chat'],
    popular: false,
  },
  {
    name: 'Gold',
    price: 2499,
    durations: [
        { label: '6 Months', value: 6, price: 2499 },
        { label: '12 Months', value: 12, price: 4499 },
    ],
    features: ['Full access', 'Profile Boost', 'Priority Search'],
    popular: true,
  },
  {
    name: 'Premium',
    price: 4999,
    durations: [
        { label: '12 Months', value: 12, price: 4999 },
    ],
    features: ['All Gold features', 'Verified Badge', 'Top of search results'],
    popular: false,
  },
];

const schema = z.object({
  planName: z.string({ required_error: "Please select a plan." }),
  planDuration: z.string({ required_error: "Please select a duration." }),
});

type PlanSelectionStepProps = {
  onContinue: (data: z.infer<typeof schema>) => void;
};

export function PlanSelectionStep({ onContinue }: PlanSelectionStepProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
        planName: 'Gold',
        planDuration: '6',
    },
  });

  const selectedPlanName = form.watch('planName');
  const selectedPlan = plans.find(p => p.name === selectedPlanName);

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onContinue)}>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              'cursor-pointer transition-all',
              selectedPlanName === plan.name
                ? 'border-primary ring-2 ring-primary shadow-lg'
                : 'border-border hover:shadow-md'
            )}
            onClick={() => {
                form.setValue('planName', plan.name);
                // set default duration
                if(plan.durations.length > 0){
                    form.setValue('planDuration', plan.durations[0].value.toString());
                }
            }}
          >
            <CardHeader>
              {plan.popular && (
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 -mt-2 -mr-2">
                    <Star className="w-3 h-3" />
                    POPULAR
                  </div>
                </div>
              )}
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-foreground">₹{plan.price}</span> / {plan.durations.find(d => d.price === plan.price)?.label || ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPlan && selectedPlan.durations.length > 1 && (
        <div className="mt-8 max-w-md mx-auto">
            <FormField
              control={form.control}
              name="planDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Duration for {selectedPlan.name} Plan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedPlan.durations.map(d => (
                        <SelectItem key={d.value} value={d.value.toString()}>
                          {d.label} - ₹{d.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Button type="submit" size="lg">
          Proceed to Payment
        </Button>
      </div>
    </form>
    </Form>
  );
}
