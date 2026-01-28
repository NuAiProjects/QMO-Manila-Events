import { useEffect, useState } from "react";
import {
  getNotifications,
  publishNotifications,
} from "@/services/notifications";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateNotificationSheet } from "./CreateNotificationSheet";
import { useToast } from "@/hooks/use-toast";

export default function UserNotificationsPanel() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<any>(null);
  const { toast } = useToast();

  const load = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

  useEffect(() => {
    load();
  }, []);

  const publish = async () => {
    try {
      await publishNotifications(selected);
      toast({ title: "Notifications published" });
      setSelected([]);
      load();
    } catch (err: any) {
      toast({
        title: "Publish failed",
        description: err?.detail || "Unable to publish notifications",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* CREATE */}
      <Button
        onClick={() => {
          setEditingNotification(null);
          setSheetOpen(true);
        }}
      >
        Create Notification
      </Button>

      {/* LIST */}
      {notifications.map((n) => (
        <Card key={n.id} className="p-4 flex gap-3 items-start">
          {/* BULK SELECT (draft only) */}
          {!n.is_active && (
            <Checkbox
              checked={selected.includes(n.id)}
              onCheckedChange={() =>
                setSelected((s) =>
                  s.includes(n.id) ? s.filter((i) => i !== n.id) : [...s, n.id]
                )
              }
            />
          )}

          <div className="flex-1 space-y-1">
            <h4 className="font-medium">{n.title}</h4>
            <p className="text-sm text-muted-foreground">{n.content}</p>
          </div>

          <div className="flex flex-col gap-2 items-end">
            {n.is_active ? (
              <Badge>Published</Badge>
            ) : (
              <>
                <Badge variant="secondary">Draft</Badge>

                {/* EDIT */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingNotification(n);
                    setSheetOpen(true);
                  }}
                >
                  Edit
                </Button>
              </>
            )}
          </div>
        </Card>
      ))}

      {/* BULK PUBLISH */}
      {selected.length > 0 && (
        <Button onClick={publish}>Publish Selected ({selected.length})</Button>
      )}

      {/* CREATE / EDIT SHEET */}
      <CreateNotificationSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSaved={load}
        mode={editingNotification ? "edit" : "create"}
        notification={editingNotification}
      />
    </div>
  );
}
