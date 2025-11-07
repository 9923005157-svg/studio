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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { FdaApprovalItem } from '@/lib/types';
import { FileCheck2, PackagePlus } from 'lucide-react';
import { TraceabilityTimeline } from './traceability-timeline';
import { supplyChainData } from '@/lib/data';

// Re-exporting the type with a more specific name for clarity on other pages
export type ApprovedDrugItem = FdaApprovalItem;

interface ApprovedDrugsProps {
  onCreateShipment: (selectedDrugs: ApprovedDrugItem[]) => void;
}

export function ApprovedDrugs({ onCreateShipment }: ApprovedDrugsProps) {
  const firestore = useFirestore();
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);

  const approvedDrugsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'fda_approvals'),
      where('status', '==', 'Approved'),
      where('shipmentStatus', '==', 'Pending Distributor Pickup')
    );
  }, [firestore]);

  const { data: approvedDrugs, isLoading } = useCollection<ApprovedDrugItem>(approvedDrugsQuery);
  
  const handleSelectDrug = (id: string) => {
    setSelectedDrugs((prev) =>
      prev.includes(id) ? prev.filter((drugId) => drugId !== id) : [...prev, id]
    );
  };

  const handleCreateShipmentClick = () => {
    if (!approvedDrugs) return;
    const drugsToShip = approvedDrugs.filter(drug => selectedDrugs.includes(drug.id));
    onCreateShipment(drugsToShip);
    setSelectedDrugs([]); // Clear selection after creating shipment
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <FileCheck2 />
          FDA Approved Drugs
        </CardTitle>
        <CardDescription>
          Select drugs to create a new shipment for dispatch to a pharmacy.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <p>Loading approved drugs...</p>}
        {!isLoading && (!approvedDrugs || approvedDrugs.length === 0) && (
          <p className="text-muted-foreground">No approved drugs available for shipment.</p>
        )}
        {approvedDrugs && approvedDrugs.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Drug Name</TableHead>
                <TableHead>Batch Number</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Approval Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvedDrugs.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedDrugs.includes(item.id)}
                      onCheckedChange={() => handleSelectDrug(item.id)}
                      aria-label={`Select ${item.drugName}`}
                    />
                  </TableCell>
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
                  <TableCell>
                    {new Date(item.submissionDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
       <CardFooter>
        <Button 
            disabled={selectedDrugs.length === 0}
            onClick={handleCreateShipmentClick}
        >
          <PackagePlus className="mr-2 h-4 w-4" />
          Create Shipment ({selectedDrugs.length})
        </Button>
      </CardFooter>
    </Card>
  );
}
