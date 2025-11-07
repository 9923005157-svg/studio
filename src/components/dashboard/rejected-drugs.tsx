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
import { FileX2 } from 'lucide-react';

export function RejectedDrugs() {
  const firestore = useFirestore();

  const rejectedDrugsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'fda_approvals'), where('status', '==', 'Rejected'));
  }, [firestore]);

  const { data: rejectedDrugs, isLoading } = useCollection<FdaApprovalItem>(rejectedDrugsQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <FileX2 />
          FDA Rejected Drugs
        </CardTitle>
        <CardDescription>
          A list of all drugs and shipments rejected by the FDA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <p>Loading rejected drugs...</p>}
        {!isLoading && (!rejectedDrugs || rejectedDrugs.length === 0) && (
          <p className="text-muted-foreground">No rejected drugs found.</p>
        )}
        {rejectedDrugs && rejectedDrugs.length > 0 && (
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
              {rejectedDrugs.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.drugName}
                  </TableCell>
                  <TableCell>{item.manufacturerName}</TableCell>
                  <TableCell>
                    {new Date(item.submissionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="destructive">
                      Rejected by FDA
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
