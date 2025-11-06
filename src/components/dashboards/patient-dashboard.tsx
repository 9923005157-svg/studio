import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function PatientDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Welcome to your Patient Dashboard. Here you can track your prescriptions and verify the authenticity of your medications.</p>
      </CardContent>
    </Card>
  );
}
