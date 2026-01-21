// frontend/src/services/events.ts
import { apiFetch } from "@/lib/api";

/* ========= TYPES ========= */

/**
 * MUST MATCH backend/app/api/schemas/events.py -> SessionCreate
 */
export interface SessionCreatePayload {
  session_topic?: string | null;
  session_speaker_id?: number | null;

  // Date + time split (matches DB + backend schema)
  session_date: string; // YYYY-MM-DD
  session_start_time: string; // HH:mm:ss
  session_end_time: string; // HH:mm:ss

  // Location FKs (required by DB constraints)
  session_building_id: number;
  session_floor_id: number;
  session_room_id: number;
}

/**
 * MUST MATCH backend/app/api/schemas/events.py -> EventCreate
 */
export interface EventCreatePayload {
  event_name: string;
  event_description?: string;
  start_datetime: string;
  end_datetime: string;
  sessions?: SessionCreatePayload[];
}
export interface EventSessionDetails {
  id: number;
  topic: string;
  date: string;
  start_time: string;
  end_time: string;
  speaker?: {
    id: number;
    name: string;
    email?: string;
  } | null;
  venue?: {
    building?: string;
    floor?: string;
    room?: string;
  } | null;
}

export interface EventDetails {
  id: number;
  event_name: string;
  event_description?: string;
  start_datetime: string;
  end_datetime: string;
  status: string;
  sessions: EventSessionDetails[];
}

/* ========= API CALLS ========= */

export const getEvents = async () => {
  return await apiFetch("/api/v1/events");
};

export const getEventDetails = (eventId: number) => {
  return apiFetch(`/api/v1/events/${eventId}`);
};

export const createEvent = (payload: EventCreatePayload) => {
  return apiFetch("/api/v1/events", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const publishEvent = (eventId: number) => {
  return apiFetch(`/api/v1/events/${eventId}/publish`, {
    method: "PATCH",
  });
};
