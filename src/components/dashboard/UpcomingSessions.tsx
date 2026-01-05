import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Session {
  id: string;
  title: string;
  speaker: string;
  time: string;
  venue: string;
  attendees: number;
  capacity: number;
  type: "keynote" | "workshop" | "panel" | "networking";
  status: "upcoming" | "live" | "completed";
}

const mockSessions: Session[] = [
  {
    id: "1",
    title: "Opening Keynote: The Future of Technology",
    speaker: "Dr. James Wilson",
    time: "09:00 - 10:30",
    venue: "Main Hall A",
    attendees: 385,
    capacity: 400,
    type: "keynote",
    status: "live",
  },
  {
    id: "2",
    title: "Workshop: Building Scalable Systems",
    speaker: "Emily Zhang",
    time: "11:00 - 12:30",
    venue: "Room 201",
    attendees: 45,
    capacity: 50,
    type: "workshop",
    status: "upcoming",
  },
  {
    id: "3",
    title: "Panel: Ethics in AI Development",
    speaker: "Multiple Speakers",
    time: "14:00 - 15:30",
    venue: "Conference Room B",
    attendees: 120,
    capacity: 150,
    type: "panel",
    status: "upcoming",
  },
];

const typeStyles = {
  keynote: "bg-primary/10 text-primary border-primary/20",
  workshop: "bg-secondary/20 text-secondary-foreground border-secondary/30",
  panel: "bg-info/10 text-info border-info/20",
  networking: "bg-success/10 text-success border-success/20",
};

const statusStyles = {
  live: "bg-destructive text-destructive-foreground animate-pulse-soft",
  upcoming: "bg-muted text-muted-foreground",
  completed: "bg-success/10 text-success",
};

export function UpcomingSessions() {
  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Today's Sessions</h3>
          <p className="text-sm text-muted-foreground">Manage and monitor live sessions</p>
        </div>
        <Button variant="outline" size="sm">
          View Schedule
        </Button>
      </div>

      <div className="space-y-4">
        {mockSessions.map((session, index) => (
          <div
            key={session.id}
            className={cn(
              "p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-all duration-200",
              "animate-slide-in-up"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge className={cn("text-xs", typeStyles[session.type])}>
                  {session.type}
                </Badge>
                <Badge className={cn("text-xs", statusStyles[session.status])}>
                  {session.status === "live" ? "● Live" : session.status}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">
                Manage
              </Button>
            </div>

            <h4 className="font-medium text-foreground mb-2 line-clamp-1">
              {session.title}
            </h4>

            <p className="text-sm text-muted-foreground mb-3">
              Speaker: {session.speaker}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{session.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{session.venue}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>
                  {session.attendees}/{session.capacity}
                </span>
              </div>
            </div>

            {/* Capacity Bar */}
            <div className="mt-3">
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    session.attendees / session.capacity > 0.9
                      ? "bg-warning"
                      : "bg-primary"
                  )}
                  style={{
                    width: `${(session.attendees / session.capacity) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
