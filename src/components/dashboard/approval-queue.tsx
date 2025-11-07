
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';
import type { FdaApprovalItem } from '@/lib/types';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { FileClock, Check, X, Thermometer, Droplets, ShieldCheck, Package, Hash } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const statusColors = {
  Pending: 'bg-yellow-500',
  Approved: 'bg-green-500',
  Rejected: 'bg-red-500',
};

export function ApprovalQueue() {
  const firestore = useFirestore();

  const approvalsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'fda_approvals'), where('status', '==', 'Pending'));
  }, [firestore]);

  const { data: approvals, isLoading } = useCollection<FdaApprovalItem>(approvalsQuery);

  const handleUpdateStatus = (
    id: string,
    status: 'Approved' | 'Rejected'
  ) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'fda_approvals', id);
    updateDocumentNonBlocking(docRef, { status });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <FileClock />
          FDA Approval Queue
        </CardTitle>
        <CardDescription>
          Review and process pending submissions from manufacturers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <p>Loading submissions...</p>}
        {!isLoading && (!approvals || approvals.length === 0) && (
          <p className="text-muted-foreground">No pending submissions.</p>
        )}
        {approvals && approvals.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            {approvals.map((item) => (
              <AccordionItem value={item.id} key={item.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex w-full items-center justify-between pr-4">
                    <div className="flex-1 text-left font-medium">{item.drugName}</div>
                    <div className="flex-1 text-left text-sm text-muted-foreground">{item.manufacturerName}</div>
                    <div className="hidden md:block flex-1 text-left text-sm text-muted-foreground">
                      {new Date(item.submissionDate).toLocaleDateString()}
                    </div>
                    <Badge className={statusColors[item.status]}>
                      {item.status}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 px-4 py-2">
                    <div>
                      <h4 className="font-semibold">Drug Details</h4>
                      <p className="text-muted-foreground">{item.drugDetails}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t pt-4">
                        <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            <div>
                                <p className="text-xs text-muted-foreground">Batch No.</p>
                                <p className="font-semibold">{item.batchNumber}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Hash className="h-5 w-5 text-primary" />
                            <div>
                                <p className="text-xs text-muted-foreground">Sample Count</p>
                                <p className="font-semibold">{item.sampleCount}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-2">
                            <Thermometer className="h-5 w-5 text-destructive" />
                            <div>
                                <p className="text-xs text-muted-foreground">Temperature</p>
                                <p className="font-semibold">{item.temperature}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-2">
                            <Droplets className="h-5 w-5 text-blue-500" />
                            <div>
                                <p className="text-xs text-muted-foreground">Humidity</p>
                                <p className="font-semibold">{item.humidity}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-xs text-muted-foreground">Tamper Status</p>
                                <p className="font-semibold">{item.tamperStatus}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                       <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(item.id, 'Approved')}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        <Check className="mr-1 h-4 w-4" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(item.id, 'Rejected')}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <X className="mr-1 h-4 w-4" /> Reject
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
