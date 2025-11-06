'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, useFirestore } from '@/firebase';
import { initiateEmailSignUp, initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Loader2 } from 'lucide-react';
import { UserRole } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const roles: UserRole[] = ["Manufacturer", "Distributor", "Pharmacy", "FDA", "Patient"];

const signInSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

const signUpSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string(),
  role: z.enum(roles, { required_error: 'Please select a role.' }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

const formSchema = z.union([signInSchema, signUpSchema]);

type Tab = 'signin' | 'signup';

export function AuthForm() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [activeTab, setActiveTab] = useState<Tab>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentSchema = activeTab === 'signin' ? signInSchema : signUpSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: 'Manufacturer',
    },
  });
  
  useEffect(() => {
    form.trigger();
  }, [activeTab, form]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as Tab);
    form.reset();
    setError(null);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    if (activeTab === 'signin') {
      const { email, password } = values as z.infer<typeof signInSchema>;
      initiateEmailSignIn(auth, email, password);
    } else {
      const { email, password, role } = values as z.infer<typeof signUpSchema>;
      try {
        const userCredential = await initiateEmailSignUp(auth, email, password);
        // Because signup is now awaited, we can get the user and save their role.
        if (userCredential && userCredential.user) {
          const userDocRef = doc(firestore, 'users', userCredential.user.uid);
          setDocumentNonBlocking(userDocRef, { role: role }, {});
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred during sign-up.');
        setIsLoading(false);
      }
    }
  }

  // Effect to handle post-login/signup loading state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, stop loading. Redirects are handled elsewhere.
        setIsLoading(false);
      }
      // if no user, form remains as-is for login/signup
    });

    return () => unsubscribe();
  }, []);

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <TabsContent value="signin" forceMount>
            <div className="space-y-2">
               <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
          </TabsContent>
          <TabsContent value="signup" forceMount>
            <div className="space-y-2">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
          </TabsContent>

          {error && <p className="text-sm text-destructive">{error}</p>}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {activeTab === 'signin' ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
      </Form>
    </Tabs>
  );
}
