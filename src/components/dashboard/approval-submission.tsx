
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';
import { FileUp, Loader2 } from 'lucide-react';
import { useState } from 'react';

const submissionSchema = z.object({
  drugName: z.string().min(1, 'Drug name is required.'),
});

type SubmissionValues = z.infer<typeof submissionSchema>;

export function ApprovalSubmission() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SubmissionValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      drugName: '',
    },
  });

  async function onSubmit(values: SubmissionValues) {
    if (!user || !firestore) return;
    setIsLoading(true);

    const submissionData = {
      drugName: values.drugName,
      manufacturerId: user.uid,
      manufacturerName: user.displayName || user.email || 'Unknown Manufacturer',
      submissionDate: new Date().toISOString(),
      status: 'Pending' as const,
    };

    const approvalsCollection = collection(firestore, 'fda_approvals');
    addDocumentNonBlocking(approvalsCollection, submissionData);

    // This is a non-blocking call, UI can update immediately.
    // We'll simulate a delay to show loading state.
    setTimeout(() => {
        setIsLoading(false);
        form.reset();
    }, 1500);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <FileUp />
          Submit for FDA Approval
        </CardTitle>
        <CardDescription>
          Submit a new drug or shipment for approval by the FDA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="drugName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Drug/Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CureAll-500mg, Batch #XYZ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
