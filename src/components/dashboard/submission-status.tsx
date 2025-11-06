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
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { FdaApprovalItem } from '@/lib/types';
import { ListChecks } from 'lucide-react';

const statusColors: { [key: string]: string } = {
  Pending: 'bg-yellow-500 hover:bg-yellow-500/80',
  Approved: 'bg-green-600 hover:bg-green-600/80',
  Rejected: 'bg-destructive hover:bg-destructive/80',
};

export function SubmissionStatus() {
  const firestore = useFirestore();
  const { user } = useUser();

  const approvalsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'fda_approvals'), where('manufacturerId', '==', user.uid));
  }, [firestore, user]);

  const { data: approvals, isLoading } = useCollection<FdaApprovalItem>(approvalsQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <ListChecks />
          My Submissions
        </CardTitle>
        <CardDescription>
          Track the status of your FDA approval requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <p>Loading submissions...</p>}
        {!isLoading && (!approvals || approvals.length === 0) && (
          <p className="text-muted-foreground">You have not made any submissions yet.</p>
        )}
        {approvals && approvals.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Drug Name</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvals.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.drugName}</TableCell>
                  <TableCell>
                    {new Date(item.submissionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className={`${statusColors[item.status]}`}>
                      {item.status}
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
