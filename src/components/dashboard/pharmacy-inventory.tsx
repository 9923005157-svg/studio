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
import { Badge } from '@/components/ui/badge';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { FdaApprovalItem } from '@/lib/types';
import { Package } from 'lucide-react';
import { TraceabilityTimeline } from './traceability-timeline';
import { supplyChainData } from '@/lib/data';

const shipmentStatusColors: { [key: string]: string } = {
  'In Transit to Pharmacy': 'bg-blue-500 hover:bg-blue-500/80',
  'Delivered to Pharmacy': 'bg-green-600 hover:bg-green-600/80',
};

export function PharmacyInventory() {
  const firestore = useFirestore();

  const inventoryQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'fda_approvals'),
      where('status', '==', 'Approved'),
      where('shipmentStatus', 'in', ['In Transit to Pharmacy', 'Delivered to Pharmacy'])
    );
  }, [firestore]);

  const { data: inventory, isLoading } = useCollection<FdaApprovalItem>(inventoryQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Package />
          Pharmacy Inventory & In-Transit
        </CardTitle>
        <CardDescription>
          A list of drugs currently in your inventory or on their way.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <p>Loading inventory...</p>}
        {!isLoading && (!inventory || inventory.length === 0) && (
          <p className="text-muted-foreground">No incoming or current inventory.</p>
        )}
        {inventory && inventory.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Drug Name</TableHead>
                <TableHead>Batch Number</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead className="text-right">Shipment Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
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
                    <Badge className={shipmentStatusColors[item.shipmentStatus]}>
                      {item.shipmentStatus}
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
