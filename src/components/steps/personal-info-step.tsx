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
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

const personalInfoSchema = z.object({
  dob: z.string().min(1, 'Date of Birth is required'),
  birthPlace: z.string().min(2, 'Birth place is required'),
  nationality: z.string().min(2, 'Nationality is required'),
  bloodGroup: z.string().optional(),
  panNumber: z.string().optional(),
  aadhaarNumber: z.string().optional(),
  idProofType: z.string().optional(),
  contactNumber: z.string().min(10, 'Contact number is required'),
  alternateContactNumber: z.string().optional(),
  permanentAddress: z.string().min(10, 'Permanent address is required'),
  currentAddress: z.string().min(10, 'Current address is required'),
  emergencyContactPerson: z.string().min(2, 'Emergency contact person is required'),
  emergencyContactNumber: z.string().min(10, 'Emergency contact number is required'),
  maritalStatus: z.string({ required_error: 'Marital status is required' }),
  hobbies: z.string().optional(),
});

export function PersonalInfoStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void; }) {
  const { fetchUserData } = useProfile();
  const { auth, database } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      dob: '',
      birthPlace: '',
      nationality: '',
      bloodGroup: '',
      panNumber: '',
      aadhaarNumber: '',
      idProofType: '',
      contactNumber: '',
      alternateContactNumber: '',
      permanentAddress: '',
      currentAddress: '',
      emergencyContactPerson: '',
      emergencyContactNumber: '',
      maritalStatus: '',
      hobbies: '',
    },
  });

  const handleSave = async (data: z.infer<typeof personalInfoSchema>) => {
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
      updates['/personalInfo'] = data;
      updates['/progress/2'] = true;

      await update(userRef, updates);
      
      toast({
        title: "Personal Information Saved!",
        description: "Your details have been updated.",
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
          <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
          <p className="text-muted-foreground">Verify your identity, contact, and background.</p>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
             <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthPlace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Place</FormLabel>
                  <FormControl>
                    <Input placeholder="City, Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Indian" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marital Status</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                       <SelectItem value="Separated">Separated</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <h3 className="text-lg font-semibold text-gray-700 pt-4 border-t">Identification Details</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="aadhaarNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aadhaar Number</FormLabel>
                  <FormControl>
                    <Input placeholder="XXXX-XXXX-XXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="panNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PAN Card Number</FormLabel>
                  <FormControl>
                    <Input placeholder="ABCDE1234F" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <h3 className="text-lg font-semibold text-gray-700 pt-4 border-t">Contact Information</h3>
           <div className="grid md:grid-cols-2 gap-6">
             <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 XXXXX XXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="alternateContactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternate Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 XXXXX XXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="permanentAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permanent Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your full permanent address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="currentAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your full current address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="emergencyContactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="emergencyContactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 XXXXX XXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
           <h3 className="text-lg font-semibold text-gray-700 pt-4 border-t">Lifestyle</h3>
            <FormField
              control={form.control}
              name="hobbies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hobbies</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g. Reading, Traveling, Cooking" {...field} />
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
            {form.formState.isSubmitting ? 'Saving...' : 'Save Personal Information'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
