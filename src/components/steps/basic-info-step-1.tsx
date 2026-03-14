'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Users, PersonStanding } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

const profileForOptions = [
  { value: 'Myself', label: 'Myself' },
  { value: 'My Son', label: 'My Son' },
  { value: 'My Daughter', label: 'My Daughter' },
  { value: 'My Brother', label: 'My Brother' },
  { value: 'My Sister', label: 'My Sister' },
  { value: 'My Friend', label: 'My Friend' },
  { value: 'My Relative', label: 'My Relative' },
];

const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
];

const schema = z.object({
  profileFor: z.string({ required_error: 'Please select who this profile is for.' }),
  gender: z.string({ required_error: 'Please select a gender.' }),
});


type BasicInfoStep1Props = {
  onContinue: (data: z.infer<typeof schema>) => void;
  initialData: any;
};

export function BasicInfoStep1({ onContinue, initialData }: BasicInfoStep1Props) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      profileFor: initialData.profileFor || '',
      gender: initialData.gender || ''
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onContinue)} className="p-8 space-y-8">
        <div className="text-left">
          <h2 className="text-2xl font-bold">Basic Information</h2>
          <p className="text-muted-foreground">Who are we creating this profile for?</p>
        </div>

        <FormField
          control={form.control}
          name="profileFor"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="font-semibold">This profile is for</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-4"
                >
                  {profileForOptions.map((option) => (
                    <FormItem key={option.value} className="flex items-center">
                       <RadioGroupItem value={option.value} id={`profileFor-${option.value}`} className="peer sr-only"/>
                       <Label htmlFor={`profileFor-${option.value}`} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary w-full cursor-pointer h-28">
                        <Users className="mb-3 h-6 w-6" />
                        {option.label}
                       </Label>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="font-semibold">Gender</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-4"
                >
                  {genderOptions.map((option) => (
                    <FormItem key={option.value} className="flex items-center">
                       <RadioGroupItem value={option.value} id={`gender-${option.value}`} className="peer sr-only"/>
                       <Label htmlFor={`gender-${option.value}`} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary w-full cursor-pointer h-28">
                        <PersonStanding className="mb-3 h-6 w-6" />
                        {option.label}
                       </Label>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full"
        >
          Next
        </Button>
      </form>
    </Form>
  );
}
