import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function PharmacyDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pharmacy Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Welcome to the Pharmacy Dashboard. Here you can manage prescriptions, verify drug authenticity, and report any issues to the FDA.</p>
      </CardContent>
    </Card>
  );
}
