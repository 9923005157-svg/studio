'use client';

import { useState } from 'react';
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
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import type { FdaApprovalItem } from '@/lib/types';
import { Loader2, Search, AlertCircle } from 'lucide-react';
import { TraceabilityTimeline } from './traceability-timeline';
import { supplyChainData } from '@/lib/data';

const searchSchema = z.object({
  batchId: z.string().min(1, 'Batch ID is required.'),
});

type SearchValues = z.infer<typeof searchSchema>;

export function BatchVerification() {
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundDrug, setFoundDrug] = useState<FdaApprovalItem | null>(null);

  const form = useForm<SearchValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      batchId: '',
    },
  });

  async function onSubmit(values: SearchValues) {
    if (!firestore) {
      setError('Database connection is not available.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setFoundDrug(null);

    try {
      const q = query(
        collection(firestore, 'fda_approvals'),
        where('batchNumber', '==', values.batchId),
        limit(1)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('No drug found with that batch ID. Please check the ID and try again.');
      } else {
        const doc = querySnapshot.docs[0];
        setFoundDrug({ id: doc.id, ...doc.data() } as FdaApprovalItem);
      }
    } catch (e) {
      console.error('Error searching for batch:', e);
      setError('An error occurred while searching. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Search />
          Verify Your Medication
        </CardTitle>
        <CardDescription>
          Enter the batch ID from your medication package to verify its authenticity and view its supply chain history.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-4">
            <FormField
              control={form.control}
              name="batchId"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Batch ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., BATCH-XYZ-123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Verify
            </Button>
          </form>
        </Form>

        {error && (
            <div className="mt-6 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive flex items-center gap-3">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
            </div>
        )}

        {foundDrug && (
          <div className="mt-6">
             <h3 className="mb-4 text-lg font-semibold tracking-tight">Traceability Report for: <span className="text-primary">{foundDrug.drugName} (Batch: {foundDrug.batchNumber})</span></h3>
            <TraceabilityTimeline events={supplyChainData} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
