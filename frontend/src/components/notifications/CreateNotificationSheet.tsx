// frontend/src/components/notifications/CreateNotificationSheet.tsx

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  createNotificationDraft,
  updateNotificationDraft,
} from "@/services/notifications";
import { NotificationTargetSelector } from "./NotificationTargetSelector";
import { useToast } from "@/hooks/use-toast";

export function CreateNotificationSheet({
  open,
  onClose,
  onSaved,
  mode = "create",
  notification,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  mode?: "create" | "edit";
  notification?: any;
}) {
  const { toast } = useToast();

  const [form, setForm] = useState<any>({
    title: "",
    content: "",
    message_type: "announcement",
    target_type: "all",
  });

  /**
   * Populate form when editing
   */
  useEffect(() => {
    if (mode === "edit" && notification) {
      setForm({
        title: notification.title ?? "",
        content: notification.content ?? "",
        message_type: notification.message_type ?? "announcement",
        target_type: notification.target_type ?? "all",
      });
    }

    if (mode === "create") {
      setForm({
        title: "",
        content: "",
        message_type: "announcement",
        target_type: "all",
      });
    }
  }, [mode, notification, open]);

  /**
   * SAVE (Create or Update)
   */
  const handleSave = async () => {
    try {
      if (mode === "edit" && notification?.id) {
        await updateNotificationDraft(notification.id, form);
        toast({ title: "Draft updated" });
      } else {
        await createNotificationDraft(form);
        toast({ title: "Draft created" });
      }

      onSaved();
      onClose();
    } catch (err: any) {
      toast({
        title: "Failed to save notification",
        description: err?.detail || "Invalid payload",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[420px]">
        <SheetHeader>
          <SheetTitle>
            {mode === "edit" ? "Edit Notification" : "Create Notification"}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-4">
          {/* TITLE */}
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm((prev: any) => ({ ...prev, title: e.target.value }))
            }
          />

          {/* CONTENT */}
          <Textarea
            placeholder="Content"
            value={form.content}
            onChange={(e) =>
              setForm((prev: any) => ({ ...prev, content: e.target.value }))
            }
          />

          {/* MESSAGE TYPE */}
          <Select
            value={form.message_type}
            onValueChange={(v) =>
              setForm((prev: any) => ({ ...prev, message_type: v }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Message type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="announcement">Announcement</SelectItem>
              <SelectItem value="alert">Alert</SelectItem>
              <SelectItem value="reminder">Reminder</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
            </SelectContent>
          </Select>

          {/* TARGET TYPE */}
          <Select
            value={form.target_type}
            onValueChange={(v) =>
              setForm((prev: any) => ({
                ...prev,
                target_type: v,
                // reset target IDs when switching type
                event_ids: undefined,
                session_ids: undefined,
                target_user_ids: undefined,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Target users" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="event">By Event</SelectItem>
              <SelectItem value="session">By Session</SelectItem>
              <SelectItem value="user">Specific Users</SelectItem>
            </SelectContent>
          </Select>

          {/* CONDITIONAL TARGET SELECTOR */}
          <NotificationTargetSelector
            targetType={form.target_type}
            onChange={(t) =>
              setForm((prev: any) => ({
                ...prev,
                ...t,
              }))
            }
          />

          <Button className="w-full" onClick={handleSave}>
            {mode === "edit" ? "Update Draft" : "Save Draft"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
