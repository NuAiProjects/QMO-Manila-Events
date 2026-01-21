import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";

interface Session {
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
    building: string;
    floor: string;
    room: string;
  };
}

interface EventDetails {
  id: number;
  event_name: string;
  event_description: string | null;
  start_datetime: string;
  end_datetime: string;
  status: string;
  sessions: Session[];
}

interface ViewEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: EventDetails | null;
}

export function ViewEventModal({
  open,
  onOpenChange,
  event,
}: ViewEventModalProps) {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {event.event_name}
            <Badge variant="outline">{event.status}</Badge>
          </DialogTitle>
        </DialogHeader>

        {event.event_description && (
          <p className="text-muted-foreground">{event.event_description}</p>
        )}

        <div className="flex gap-6 text-sm mt-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {new Date(event.start_datetime).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {new Date(event.start_datetime).toLocaleTimeString()} –{" "}
            {new Date(event.end_datetime).toLocaleTimeString()}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold mb-3">Sessions</h4>

          {event.sessions.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No sessions available.
            </p>
          )}

          <div className="space-y-3">
            {event.sessions.map((s) => (
              <div key={s.id} className="border rounded-lg p-3">
                <div className="font-medium">{s.topic}</div>
                <div className="text-sm text-muted-foreground">
                  {s.date} · {s.start_time} – {s.end_time}
                </div>
                {s.speaker && (
                  <div className="text-sm mt-1">
                    <span className="font-medium">Speaker:</span>{" "}
                    {s.speaker?.name ?? "TBA"}
                  </div>
                )}

                {s.venue && (
                  <div className="flex items-center gap-1 text-sm mt-1">
                    <MapPin className="h-3 w-3" />
                    {s.venue.building} · {s.venue.floor} · {s.venue.room}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
