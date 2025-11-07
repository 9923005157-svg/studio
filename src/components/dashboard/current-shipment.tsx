'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { ApprovedDrugItem } from '@/components/dashboard/approved-drugs';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Truck, PackageCheck, Loader2 } from 'lucide-react';

interface CurrentShipmentProps {
  shipment: ApprovedDrugItem[];
  onDispatch: () => void;
}

export function CurrentShipment({ shipment, onDispatch }: CurrentShipmentProps) {
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);

  const handleDispatchShipment = () => {
    if (!firestore || shipment.length === 0) return;
    setIsLoading(true);

    const dispatchPromises = shipment.map((item) => {
      const docRef = doc(firestore, 'fda_approvals', item.id);
      return updateDocumentNonBlocking(docRef, { shipmentStatus: 'In Transit to Pharmacy' });
    });

    // We don't await the promises here because the updates are non-blocking.
    // We'll simulate a delay for UX purposes and then call the parent callback.
    setTimeout(() => {
        onDispatch();
        setIsLoading(false);
    }, 1500)
  };

  return (
    <Card className="border-primary">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <PackageCheck />
          New Shipment Ready for Dispatch
        </CardTitle>
        <CardDescription>
          The following items have been added to a new shipment. Click dispatch to send them to the pharmacy.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Drug Name</TableHead>
              <TableHead>Batch Number</TableHead>
              <TableHead>Manufacturer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipment.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.drugName}</TableCell>
                <TableCell>{item.batchNumber}</TableCell>
                <TableCell>{item.manufacturerName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button onClick={handleDispatchShipment} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Truck className="mr-2 h-4 w-4" />
          )}
          Dispatch Shipment ({shipment.length} items)
        </Button>
      </CardFooter>
    </Card>
  );
}
