

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Heart } from 'lucide-react';
import { useFirebase } from '@/firebase/provider';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FirebaseProvider } from '@/firebase/provider';
import { ref, set } from 'firebase/database';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const profileForOptions = ['Myself', 'My Son', 'My Daughter', 'My Brother', 'My Sister', 'My Friend', 'My Relative'];
const employmentTypes = ["Private", "Government", "Self-employed", "Defence", "Not Working"];
const incomeRanges = ["₹0-2L", "₹2-5L", "₹5-10L", "₹10-20L", "₹20L+"];

const formSchema = z.object({
  profileFor: z.string().min(1, 'This field is required.'),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  gender: z.string().min(1, 'Please select a gender.'),
  dob: z.string().min(1, 'Date of Birth is required.'),
  motherTongue: z.string().min(1, 'Mother Tongue is required.'),
  caste: z.string().min(1, 'Caste is required.'),
  mobile: z.string().min(10, 'A valid mobile number is required.'),
  email: z.string().email('Please enter a valid email address.'),
  working: z.string().min(1, 'Working status is required.'),
  education: z.string().min(1, 'Education is required.'),
  salary: z.string().min(1, 'Salary is required.'),
  currentAddress: z.string().min(1, 'Current address is required.'),
  permanentAddress: z.string().min(1, 'Permanent address is required.'),
  expectations: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

function RegisterForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { auth, database } = useFirebase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileFor: '',
      name: '',
      gender: '',
      dob: '',
      motherTongue: '',
      caste: '',
      mobile: '',
      email: '',
      working: '',
      education: '',
      salary: '',
      currentAddress: '',
      permanentAddress: '',
      expectations: '',
      password: '',
    },
  });

  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth || !database) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firebase not initialized. Please try again later.',
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: values.name,
      });

      const userRef = ref(database, 'users/' + user.uid);
      const age = calculateAge(values.dob);

      await set(userRef, {
        uid: user.uid,
        name: values.name,
        email: values.email,
        createdAt: new Date().toISOString(),
        basicInfo: {
          profileFor: values.profileFor,
          gender: values.gender,
          dob: values.dob,
          age: age,
          motherTongue: values.motherTongue,
          caste: values.caste,
        },
        contactInfo: {
          mobile: values.mobile,
          currentAddress: values.currentAddress,
          permanentAddress: values.permanentAddress,
        },
        careerInfo: {
          working: values.working,
          education: values.education,
          salary: values.salary,
        },
        expectations: values.expectations,
        progress: {
          '1': true,
          '2': true,
          '3': true,
          '4': true,
          overall: 80,
        },
      });

      toast({
        title: 'Registration Successful!',
        description: "You're now logged in.",
      });

      router.push('/dashboard?showSetup=true&stepId=5');

    } catch (error: any) {
      console.error('Registration Error:', error);
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background romantic-gradient-shift p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <Link href="/" className="flex justify-center">
            <Heart className="w-12 h-12 text-primary" fill="currentColor" />
          </Link>
          <CardTitle className="font-serif text-4xl">Create Your Account</CardTitle>
          <CardDescription>Join Eternal Union and find your perfect match.</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Profile For */}
                <FormField
                  control={form.control}
                  name="profileFor"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Profile For</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-wrap gap-2"
                        >
                          {profileForOptions.map((o) => (
                            <FormItem key={o} className="flex items-center space-x-2">
                              <RadioGroupItem value={o} id={`profileFor-${o}`} />
                              <Label htmlFor={`profileFor-${o}`} className="font-normal">{o}</Label>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Name */}
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <RadioGroupItem value="Male" id="male" />
                            <Label htmlFor="male" className="font-normal">Male</Label>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <RadioGroupItem value="Female" id="female" />
                            <Label htmlFor="female" className="font-normal">Female</Label>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* DOB */}
                <FormField control={form.control} name="dob" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Mother Tongue */}
                <FormField control={form.control} name="motherTongue" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mother Tongue</FormLabel>
                    <FormControl><Input placeholder="e.g. Hindi" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Caste */}
                <FormField control={form.control} name="caste" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caste</FormLabel>
                    <FormControl><Input placeholder="Your caste" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Mobile */}
                <FormField control={form.control} name="mobile" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile No.</FormLabel>
                    <FormControl><Input placeholder="+91 XXXXX XXXXX" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Email */}
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Working */}
                <FormField
                  control={form.control}
                  name="working"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Working In</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employmentTypes.map(e => (
                            <SelectItem key={e} value={e}>{e}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Education */}
                <FormField control={form.control} name="education" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education</FormLabel>
                    <FormControl><Input placeholder="e.g. B.Tech" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Salary */}
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Salary</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {incomeRanges.map(i => (
                            <SelectItem key={i} value={i}>{i}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Current Address */}
                <FormField control={form.control} name="currentAddress" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Address</FormLabel>
                    <FormControl><Input placeholder="Your current address" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Permanent Address */}
                <FormField control={form.control} name="permanentAddress" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permanent Address</FormLabel>
                    <FormControl><Input placeholder="Your permanent address" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="•••••••"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

              {/* Expectations */}
              <FormField
                control={form.control}
                name="expectations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expectations from Partner</FormLabel>
                    <FormControl>
                      <Textarea placeholder="What are you looking for in a partner?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-4"
              >
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>
              </motion.div>
            </form>
          </Form>

          <motion.div
            className="mt-6 text-center text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Login
              </Link>
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <FirebaseProvider>
      <RegisterForm />
    </FirebaseProvider>
  );
}
