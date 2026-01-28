import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MOCK_ALERTS = [
  {
    id: 1,
    title: "New Registrations",
    message: "15 attendees registered today",
    type: "info",
  },
  {
    id: 2,
    title: "Session Updated",
    message: "Keynote session time was changed",
    type: "warning",
  },
];

export default function AdminAlertsPanel() {
  return (
    <div className="space-y-4">
      {MOCK_ALERTS.map((alert) => (
        <Card key={alert.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">{alert.title}</CardTitle>
            <Badge variant="secondary">{alert.type}</Badge>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {alert.message}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
