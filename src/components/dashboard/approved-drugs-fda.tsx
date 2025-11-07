
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
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { FdaApprovalItem } from '@/lib/types';
import { FileCheck2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TraceabilityTimeline } from './traceability-timeline';
import { supplyChainData } from '@/lib/data';

export function ApprovedDrugs() {
  const firestore = useFirestore();

  const approvedDrugsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'fda_approvals'), where('status', '==', 'Approved'));
  }, [firestore]);

  const { data: approvedDrugs, isLoading } = useCollection<FdaApprovalItem>(approvedDrugsQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <FileCheck2 />
          FDA Approved Drugs
        </CardTitle>
        <CardDescription>
          A list of all drugs and shipments approved by the FDA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <p>Loading approved drugs...</p>}
        {!isLoading && (!approvedDrugs || approvedDrugs.length === 0) && (
          <p className="text-muted-foreground">No approved drugs found.</p>
        )}
        {approvedDrugs && approvedDrugs.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Drug Name</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvedDrugs.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                     <Dialog>
                      <DialogTrigger asChild>
                        <span className="cursor-pointer font-semibold text-primary hover:underline">
                          {item.drugName}
                        </span>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Traceability Timeline: {item.drugName}</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-[70vh] overflow-y-auto p-4">
                          <TraceabilityTimeline events={supplyChainData} />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>{item.manufacturerName}</TableCell>
                  <TableCell>
                    {new Date(item.submissionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className="bg-green-600 hover:bg-green-600/80">
                      Approved by FDA
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
