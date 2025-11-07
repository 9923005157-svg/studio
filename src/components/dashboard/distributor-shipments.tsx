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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import type { FdaApprovalItem } from '@/lib/types';
import { Truck } from 'lucide-react';
import { TraceabilityTimeline } from './traceability-timeline';
import { supplyChainData } from '@/lib/data';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export function DistributorShipments() {
  const firestore = useFirestore();

  const shipmentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'fda_approvals'),
      where('status', '==', 'Approved'),
      where('shipmentStatus', '==', 'Pending Distributor Pickup')
    );
  }, [firestore]);

  const { data: shipments, isLoading } = useCollection<FdaApprovalItem>(shipmentsQuery);

  const handleDispatch = (id: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'fda_approvals', id);
    updateDocumentNonBlocking(docRef, { shipmentStatus: 'In Transit to Pharmacy' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Truck />
          Shipments for Dispatch
        </CardTitle>
        <CardDescription>
          A list of FDA-approved drugs ready to be dispatched to pharmacies.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <p>Loading shipments...</p>}
        {!isLoading && (!shipments || shipments.length === 0) && (
          <p className="text-muted-foreground">No shipments ready for dispatch.</p>
        )}
        {shipments && shipments.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Drug Name</TableHead>
                <TableHead>Batch Number</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.map((item) => (
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
                  <TableCell>{item.batchNumber}</TableCell>
                  <TableCell>{item.manufacturerName}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => handleDispatch(item.id)}>
                      <Truck className="mr-2 h-4 w-4" />
                      Dispatch to Pharmacy
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
