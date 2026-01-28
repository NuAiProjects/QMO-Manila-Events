// frontend/src/services/notifications.ts
import { apiFetch } from "@/lib/api";

export interface Notification {
  id: number;
  title: string;
  content: string;
  target_type: string;
  message_type: string;
  is_active: boolean;
  published_at: string | null;
  created_at: string;
}

export interface CreateNotificationPayload {
  title: string;
  content: string;
  message_type: "announcement" | "alert" | "reminder" | "warning";
  target_type: "all" | "event" | "session" | "user";
  event_ids?: number[];
  session_ids?: number[];
  target_user_ids?: number[];
}

export const getNotifications = () => {
  return apiFetch("/api/v1/notifications");
};

export const createNotificationDraft = (payload: CreateNotificationPayload) => {
  return apiFetch("/api/v1/notifications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const publishNotifications = (notification_ids: number[]) => {
  return apiFetch("/api/v1/notifications/publish", {
    method: "POST",
    body: JSON.stringify({ notification_ids }),
  });
};

export const updateNotificationDraft = (
  notificationId: number,
  payload: Partial<Notification>
) => {
  return apiFetch(`/api/v1/notifications/${notificationId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};
