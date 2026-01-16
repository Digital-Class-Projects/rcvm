'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useProfile } from '../profile-provider';
import { useFirebase } from '@/firebase/provider';
import { ref, update } from 'firebase/database';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';

const familyInfoSchema = z.object({
  familyType: z.string().min(1, 'Family type is required'),
  fatherOccupation: z.string().min(1, 'Father\'s occupation is required'),
  motherOccupation: z.string().min(1, 'Mother\'s occupation is required'),
  familyStatus: z.string().min(1, 'Family status is required'),
  familyIncome: z.string().optional(),
  brothers: z.string().min(1, 'Number of brothers is required'),
  sisters: z.string().min(1, 'Number of sisters is required'),
  marriedBrothers: z.string().optional(),
  marriedSisters: z.string().optional(),
  familyLivingIn: z.string().optional(),
  nativePlace: z.string().optional(),
  contactAddress: z.string().optional(),
  familyValues: z.string().min(1, 'Family values are required'),
  lifestyleHabits: z.array(z.string()).optional(),
  aboutFamily: z.string().optional(),
});

const dropdownOptions = {
  familyType: ["Joint", "Nuclear", "Others"],
  occupation: ["Businessman", "Government", "Private Job", "Retired", "Other", "Housewife", "Teacher"],
  familyStatus: ["Middle Class", "Upper Middle Class", "Rich", "Affluent"],
  income: ["₹0-2L", "₹2-5L", "₹5-10L", "₹10-20L", "₹20L+"],
  number: ["0", "1", "2", "3", "3+"],
  familyValues: ["Traditional", "Moderate", "Liberal"],
  lifestyleHabits: [
    { id: "smoking", label: "Smoking" },
    { id: "drinking", label: "Drinking" },
    { id: "vegetarian", label: "Vegetarian" },
    { id: "non-vegetarian", label: "Non-Vegetarian" },
    { id: "eggetarian", label: "Eggetarian" },
  ],
};


export function FamilyInfoStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void; }) {
  const { fetchUserData } = useProfile();
  const { auth, database } = useFirebase();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof familyInfoSchema>>({
    resolver: zodResolver(familyInfoSchema),
    defaultValues: {
      familyType: '',
      fatherOccupation: '',
      motherOccupation: '',
      familyStatus: '',
      familyIncome: '',
      brothers: '',
      sisters: '',
      marriedBrothers: '',
      marriedSisters: '',
      familyLivingIn: '',
      nativePlace: '',
      contactAddress: '',
      familyValues: '',
      lifestyleHabits: [],
      aboutFamily: '',
    },
  });

  const handleSave = async (data: z.infer<typeof familyInfoSchema>) => {
    if (!auth?.currentUser || !database) {
      toast({
        variant: 'destructive',
        title: "Submission Failed",
        description: "User not authenticated or database not available."
      });
      return;
    }
    
    try {
      const userRef = ref(database, `users/${auth.currentUser.uid}`);
      const updates: { [key: string]: any } = {};
      updates['/familyInfo'] = data;
      updates['/progress/4'] = true;

      await update(userRef, updates);
      
      toast({
        title: "Family & Lifestyle Info Saved!",
        description: "Your final details have been updated.",
      });
      onContinue();

    } catch(error: any) {
       toast({
        variant: 'destructive',
        title: "Error",
        description: error.message || "Failed to save your details."
      });
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" className="mr-4 hover:bg-gray-100 rounded-full" type="button" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Family & Lifestyle</h2>
          <p className="text-muted-foreground">Share details about your family and living habits.</p>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="familyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                      <SelectContent>{dropdownOptions.familyType.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fatherOccupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Father's Occupation</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select occupation" /></SelectTrigger></FormControl>
                      <SelectContent>{dropdownOptions.occupation.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="motherOccupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mother's Occupation</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select occupation" /></SelectTrigger></FormControl>
                      <SelectContent>{dropdownOptions.occupation.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="familyStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                      <SelectContent>{dropdownOptions.familyStatus.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="familyIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family Income</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select income" /></SelectTrigger></FormControl>
                      <SelectContent>{dropdownOptions.income.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brothers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Brothers</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select count" /></SelectTrigger></FormControl>
                      <SelectContent>{dropdownOptions.number.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sisters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Sisters</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select count" /></SelectTrigger></FormControl>
                      <SelectContent>{dropdownOptions.number.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marriedBrothers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Married Brothers</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select count" /></SelectTrigger></FormControl>
                      <SelectContent>{dropdownOptions.number.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marriedSisters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Married Sisters</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select count" /></SelectTrigger></FormControl>
                      <SelectContent>{dropdownOptions.number.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="familyValues"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family Values</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select values" /></SelectTrigger></FormControl>
                      <SelectContent>{dropdownOptions.familyValues.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
           </div>

            <FormField
              control={form.control}
              name="lifestyleHabits"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Lifestyle Habits</FormLabel>
                  </div>
                  <div className="flex flex-wrap gap-4">
                  {dropdownOptions.lifestyleHabits.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="lifestyleHabits"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

           <FormField
              control={form.control}
              name="aboutFamily"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Write About Your Family</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="Share some details about your family background and values." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          <Button
            type="submit"
            size="lg"
            className="w-full bg-primary hover:bg-accent text-primary-foreground rounded-full mt-8"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Saving...' : 'Save Family & Lifestyle'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
