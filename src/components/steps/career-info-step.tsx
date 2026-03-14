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

const careerInfoSchema = z.object({
  highestQualification: z.string().min(1, 'Highest qualification is required'),
  additionalQualification: z.string().optional(),
  university: z.string().optional(),
  occupation: z.string().min(1, 'Occupation is required'),
  employedIn: z.string().min(1, 'Employment status is required'),
  companyName: z.string().optional(),
  designation: z.string().optional(),
  workLocation: z.string().optional(),
  annualIncome: z.string().min(1, 'Annual income is required'),
  careerStartYear: z.string().optional(),
  experience: z.string().optional(),
  professionalAchievements: z.string().optional(),
  manglik: z.string().min(1, 'This field is required'),
  jobType: z.string().optional(),
  skills: z.string().optional(),
  workEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  aboutYourself: z.string().optional(),
});

const qualifications = ["10th", "12th", "Diploma", "B.A", "B.Sc", "B.Tech", "B.Com", "MBA", "M.Tech", "PhD", "Other"];
const employmentTypes = ["Private", "Government", "Self-employed", "Defence", "Not Working"];
const incomeRanges = ["₹0-2L", "₹2-5L", "₹5-10L", "₹10-20L", "₹20L+"];
const years = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());

export function CareerInfoStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void; }) {
  const { fetchUserData } = useProfile();
  const { auth, database } = useFirebase();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof careerInfoSchema>>({
    resolver: zodResolver(careerInfoSchema),
    defaultValues: {
      highestQualification: '',
      additionalQualification: '',
      university: '',
      occupation: '',
      employedIn: '',
      companyName: '',
      designation: '',
      workLocation: '',
      annualIncome: '',
      careerStartYear: '',
      experience: '',
      professionalAchievements: '',
      manglik: '',
      jobType: '',
      skills: '',
      workEmail: '',
      aboutYourself: '',
    },
  });

  const handleSave = async (data: z.infer<typeof careerInfoSchema>) => {
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
      updates['/careerInfo'] = data;
      updates['/progress/3'] = true;

      await update(userRef, updates);
      
      toast({
        title: "Career Details Saved!",
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
          <h2 className="text-2xl font-bold text-gray-800">Career Details</h2>
          <p className="text-muted-foreground">Capture education, profession, and financial background.</p>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
           <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="highestQualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Highest Qualification</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select qualification" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {qualifications.map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="university"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University / College Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Harvard University" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employed In</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select employment type" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employmentTypes.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="annualIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Income</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select income range" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {incomeRanges.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="manglik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Are you Manglik?</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Don't Know">Don't Know</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
           </div>
           
           <FormField
              control={form.control}
              name="aboutYourself"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Write About Yourself</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="A personal statement about ambitions, goals, and lifestyle" {...field} />
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
            {form.formState.isSubmitting ? 'Saving...' : 'Save Career Details'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
