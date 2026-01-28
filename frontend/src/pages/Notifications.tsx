import { AdminLayout } from "@/components/layout/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminAlertsPanel from "../components/notifications/AdminAlertsPanel";
import UserNotificationsPanel from "../components/notifications/UserNotificationsPanel";

export default function Notifications() {
  return (
    <AdminLayout
      title="Notifications"
      subtitle="System alerts and user announcements"
    >
      <Tabs defaultValue="admin" className="space-y-6">
        <TabsList>
          <TabsTrigger value="admin">Admin Alerts</TabsTrigger>
          <TabsTrigger value="user">User Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="admin">
          <AdminAlertsPanel />
        </TabsContent>

        <TabsContent value="user">
          <UserNotificationsPanel />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
