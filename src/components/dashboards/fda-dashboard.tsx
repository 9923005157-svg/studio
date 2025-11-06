import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function FdaDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>FDA Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Welcome to the FDA Dashboard. Here you can monitor the supply chain for anomalies, review reports, and manage drug approvals.</p>
      </CardContent>
    </Card>
  );
}
