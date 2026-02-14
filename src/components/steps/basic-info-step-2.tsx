'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

const schema = z.object({
  name: z.string().min(2, 'Full name is required.'),
  day: z.string().min(1, 'Day is required.').max(2),
  month: z.string().min(1, 'Month is required.').max(2),
  year: z.string().min(4, 'Year is required.').max(4),
});

type BasicInfoStep2Props = {
  onBack: () => void;
  onContinue: (data: z.infer<typeof schema>) => void;
  initialData: any;
};

export function BasicInfoStep2({ onBack, onContinue, initialData }: BasicInfoStep2Props) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData.name || '',
      day: initialData.day || '',
      month: initialData.month || '',
      year: initialData.year || ''
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onContinue)} className="p-8 space-y-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-4 hover:bg-gray-100 rounded-full" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Your Details</h2>
            <p className="text-muted-foreground">Tell us a bit about the person.</p>
          </div>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Label>Date of birth</Label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <FormField
              control={form.control}
              name="day"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="DD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="MM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="YYYY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-primary hover:bg-accent text-primary-foreground rounded-full mt-8"
        >
          Save & Continue
        </Button>
      </form>
    </Form>
  );
}
