import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Calendar, ChevronsRight } from "lucide-react"
import type { DrugInfo } from "@/lib/types"

interface DrugOverviewCardProps {
  drugInfo: DrugInfo
}

export function DrugOverviewCard({ drugInfo }: DrugOverviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline">{drugInfo.name}</CardTitle>
          <Badge variant="secondary">{drugInfo.status}</Badge>
        </div>
        <CardDescription>Batch ID: {drugInfo.batchId}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Batch: {drugInfo.batchId}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Expires: {drugInfo.expiryDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
