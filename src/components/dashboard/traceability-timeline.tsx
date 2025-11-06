import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SupplyChainEvent } from "@/lib/types"
import {
  Factory,
  FlaskConical,
  Truck,
  Package,
  Stethoscope,
  FileCheck2,
  Package2,
} from "lucide-react"

const stageIcons: { [key: string]: React.ElementType } = {
  Supplier: FlaskConical,
  Manufacturing: Factory,
  Repackaging: Package2,
  Distribution: Truck,
  Pharmacy: Package,
  Patient: Stethoscope,
}

interface TraceabilityTimelineProps {
  events: SupplyChainEvent[]
}

export function TraceabilityTimeline({ events }: TraceabilityTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Traceability Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6">
          <div className="absolute left-6 top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
          {events.map((event, index) => {
            const Icon = stageIcons[event.stage] || Package
            return (
              <div key={event.id} className="relative mb-8 flex items-start gap-4">
                <div className="absolute left-0 top-0 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-card ring-4 ring-card">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-8 flex-1 pt-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{event.stage}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.actor}</p>
                  <p className="text-sm">{event.details}</p>
                  {event.fdaStatus && (
                    <Badge variant={event.fdaStatus === 'Approved' ? 'default' : 'destructive'} className="mt-2 bg-green-600">
                      <FileCheck2 className="mr-1 h-3 w-3" />
                      FDA: {event.fdaStatus}
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
