
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
import { FileUp, Loader2, Thermometer, Droplets, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Textarea } from '../ui/textarea';
import type { FdaApprovalItem } from '@/lib/types';

const submissionSchema = z.object({
  drugName: z.string().min(1, 'Drug name is required.'),
  drugDetails: z.string().min(1, 'Drug details are required.'),
  batchNumber: z.string().min(1, 'Batch number is required.'),
  sampleCount: z.string().min(1, 'Sample count is required.'),
});

type SubmissionValues = z.infer<typeof submissionSchema>;

export function ApprovalSubmission() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [realtimeData, setRealtimeData] = useState({
    temperature: '5.2°C',
    humidity: '61%',
    tamperStatus: 'Secure'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData({
        temperature: `${(4.8 + Math.random() * 0.8).toFixed(1)}°C`,
        humidity: `${(60 + Math.random() * 5).toFixed(0)}%`,
        tamperStatus: 'Secure'
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const form = useForm<SubmissionValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      drugName: '',
      drugDetails: '',
      batchNumber: '',
      sampleCount: '',
    },
  });

  async function onSubmit(values: SubmissionValues) {
    if (!user || !firestore) return;
    setIsLoading(true);

    const submissionData: Omit<FdaApprovalItem, 'id'> = {
      ...values,
      ...realtimeData,
      manufacturerId: user.uid,
      manufacturerName: user.displayName || user.email || 'Unknown Manufacturer',
      submissionDate: new Date().toISOString(),
      status: 'Pending',
      shipmentStatus: 'Pending Distributor Pickup',
    };

    const approvalsCollection = collection(firestore, 'fda_approvals');
    addDocumentNonBlocking(approvalsCollection, submissionData);

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
          Submit a new drug or shipment for approval by the FDA. Real-time data is captured upon submission.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-3 gap-4 rounded-lg border bg-muted/50 p-4 text-center">
            <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 text-lg font-bold text-destructive"><Thermometer size={20} />{realtimeData.temperature}</div>
                <span className="text-xs text-muted-foreground">Temperature</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 text-lg font-bold text-blue-600"><Droplets size={20} />{realtimeData.humidity}</div>
                <span className="text-xs text-muted-foreground">Humidity</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 text-lg font-bold text-green-600"><ShieldCheck size={20} />{realtimeData.tamperStatus}</div>
                <span className="text-xs text-muted-foreground">Tamper Status</span>
            </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="drugName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drug/Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CureAll-500mg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="batchNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., BATCH-XYZ-123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
              control={form.control}
              name="drugDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Drug Details</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the drug, its purpose, and dosage." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="sampleCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Samples in Batch</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 10000" {...field} />
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
