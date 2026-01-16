'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';

const religions = [
    'Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Jewish', 'Parsi', 'Spiritual - not religious', 'No Religion', 'Other'
];

const schema = z.object({
  religion: z.string({ required_error: 'Please select a religion.' }),
  motherTongue: z.string().min(1, 'Mother tongue is required.'),
});

type BasicInfoStep3Props = {
  onBack: () => void;
  onContinue: (data: z.infer<typeof schema>) => void;
  initialData: any;
};

export function BasicInfoStep3({ onBack, onContinue, initialData }: BasicInfoStep3Props) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      religion: initialData.religion || '',
      motherTongue: initialData.motherTongue || '',
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onContinue)} className="p-8 space-y-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-4 hover:bg-gray-100 rounded-full" type="button" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Religion & Community</h2>
            <p className="text-muted-foreground">Help us find matches from your community.</p>
          </div>
        </div>

        <FormField
          control={form.control}
          name="religion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Religion</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a religion" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {religions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="motherTongue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mother Tongue</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. Hindi" {...field} />
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-lg p-4 mt-6">
            <p className="font-semibold">Shaadi.com is built for genuine profiles.</p>
            <p>Please verify your details for the best experience.</p>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-primary hover:bg-accent text-primary-foreground rounded-full"
        >
          Submit Basic Information
        </Button>
      </form>
    </Form>
  );
}
