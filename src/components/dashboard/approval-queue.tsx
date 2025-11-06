
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
import { FileClock, Check, X } from 'lucide-react';

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Drug Name</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvals.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.drugName}</TableCell>
                  <TableCell>{item.manufacturerName}</TableCell>
                  <TableCell>
                    {new Date(item.submissionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[item.status]}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
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

