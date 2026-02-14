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
import AuthCard from '@/components/auth-card';
import { Eye, EyeOff } from 'lucide-react';
import { useFirebase } from '@/firebase/provider';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseProvider } from '@/firebase/provider';
import { get, ref } from 'firebase/database';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
  loginAs: z.enum(['User', 'Admin'], { required_error: 'Please select a role.' }),
});

function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { auth, database } = useFirebase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      loginAs: 'User',
    },
  });

  const loginAs = form.watch('loginAs');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.loginAs === 'Admin') {
      // Manual validation for admin credentials
      if (values.email === 'rcvvsm@gmail.com' && values.password === '12345678') {
        toast({
          title: 'Admin Login Successful!',
          description: "You'll be redirected to the admin dashboard.",
        });
        // In a real app, you would set an admin session here
        router.push('/admin/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid Admin Credentials ❌',
        });
      }
    } else {
      // Regular user login with Firebase
      if (!auth || !database) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Firebase not initialized. Please try again later.',
        });
        return;
      }
      try {
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;
        
        const userProgressRef = ref(database, `users/${user.uid}/progress`);
        const snapshot = await get(userProgressRef);

        toast({
          title: 'Login Successful!',
          description: "You'll be redirected shortly.",
        });

        if (snapshot.exists() && snapshot.val().basic === 100) {
          router.push('/dashboard');
        } else {
          router.push('/dashboard?showSetup=true');
        }
      } catch (error: any) {
        console.error('Login Error:', error);
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: error.message || 'An unexpected error occurred.',
        });
      }
    }
  }

  return (
    <AuthCard
      title={loginAs === 'Admin' ? 'Admin Access' : 'Welcome Back'}
      subtitle={loginAs === 'Admin' ? 'Enter credentials to manage the application.' : 'Enter your credentials to access your account.'}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FormField
              control={form.control}
              name="loginAs"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Login as</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <RadioGroupItem value="User" id="r1" />
                        <Label htmlFor="r1">User</Label>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <RadioGroupItem value="Admin" id="r2" />
                        <Label htmlFor="r2">Admin</Label>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={loginAs === 'Admin' ? "rcvvsm@gmail.com" : "you@example.com"}
                      {...field}
                      className="bg-background/80"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
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
                        placeholder="••••••••"
                        {...field}
                        className="bg-background/80"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </motion.div>
        </form>
      </Form>
      {loginAs === 'User' && (
         <motion.div
          className="mt-6 text-center text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
              Register
            </Link>
          </p>
        </motion.div>
      )}
    </AuthCard>
  );
}

export default function LoginPage() {
    return (
      <FirebaseProvider>
        <LoginForm />
      </FirebaseProvider>
    );
  }
