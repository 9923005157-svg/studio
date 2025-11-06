import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Alert } from "@/lib/types"
import { ShieldAlert } from "lucide-react"

interface AlertFeedProps {
  alerts: Alert[]
}

const severityColors = {
  High: "bg-destructive text-destructive-foreground",
  Medium: "bg-yellow-500 text-black",
  Low: "bg-blue-500 text-white",
}

export function AlertFeed({ alerts }: AlertFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <ShieldAlert />
            <span>Alerts &amp; Events</span>
        </CardTitle>
        <CardDescription>Recent anomalies and notifications.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3">
              <div className="mt-1">
                <Badge className={severityColors[alert.severity]}>
                  {alert.severity}
                </Badge>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{alert.description}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
