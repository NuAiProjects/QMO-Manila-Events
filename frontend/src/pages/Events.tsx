// frontend/src/pages/Events.tsx
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { getEvents, publishEvent, getEventDetails } from "@/services/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateEventModal } from "@/components/events/CreateEventModal";
import { ViewEventModal } from "@/components/events/ViewEventModal";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Edit,
  Trash2,
  Copy,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ================= TYPES ================= */
type BackendStatus = "draft" | "published" | "archived";

interface BackendEvent {
  id: number;
  event_name: string;
  event_description: string | null;
  start_datetime: string | null;
  end_datetime: string | null;
  venue: string | null;
  sessions_count: number;
  status: BackendStatus;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  sessionsCount: number;
  status: UIStatus;
}

type UIStatus = "draft" | "upcoming" | "ongoing" | "completed";
const deriveStatus = (
  backendStatus: BackendStatus,
  start: string | null,
  end: string | null
): UIStatus => {
  if (backendStatus === "draft") return "draft";

  if (!start || !end) return "draft";

  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (now < startDate) return "upcoming";
  if (now >= startDate && now <= endDate) return "ongoing";

  return "completed";
};

/* ================= STYLES ================= */

const typeStyles = {
  workshop: "bg-secondary/20 text-secondary-foreground border-secondary/30",
};

const statusStyles: Record<UIStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  upcoming: "bg-blue-100 text-blue-700",
  ongoing: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-600",
};

/* ================= PAGE ================= */

export default function Events() {
  const [activeTab, setActiveTab] = useState("all");
  const [events, setEvents] = useState<Event[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  /* ================= FETCH ================= */

  const fetchEvents = async () => {
    try {
      const data: BackendEvent[] = await getEvents();

      console.log("EVENTS API DATA:", data);

      if (!Array.isArray(data)) {
        setEvents([]);
        return;
      }

      const mapped: Event[] = data.map((e) => {
        const start = new Date(e.start_datetime);
        const end = new Date(e.end_datetime);

        return {
          id: String(e.id),
          title: e.event_name,
          date: e.start_datetime
            ? new Date(e.start_datetime).toISOString().split("T")[0]
            : "—",
          time:
            e.start_datetime && e.end_datetime
              ? `${new Date(e.start_datetime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })} – ${new Date(e.end_datetime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "—",
          venue: e.venue ?? "TBD",
          sessionsCount: e.sessions_count ?? 0,
          status: deriveStatus(e.status, e.start_datetime, e.end_datetime),
        };
      });

      setEvents(mapped);
    } catch (err) {
      console.error("Failed to fetch events", err);
      setEvents([]);
    }
  };
  /* ================= ACTIONS ================= */
  const handlePublish = async (eventId: string) => {
    try {
      await publishEvent(Number(eventId));
      await fetchEvents(); // refresh list
    } catch (err) {
      console.error("Failed to publish event", err);
      alert("Failed to publish event");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleViewDetails = async (eventId: string) => {
    try {
      const data = await getEventDetails(Number(eventId));
      setSelectedEvent(data);
      setViewOpen(true);
    } catch (err) {
      console.error("Failed to load event details", err);
      alert("Failed to load event details");
    }
  };

  /* ================= FILTER ================= */

  const filteredEvents = events.filter((event) => {
    if (activeTab === "all") return true;

    if (activeTab === "draft") {
      return event.status === "draft";
    }

    if (activeTab === "published") {
      return event.status === "upcoming" || event.status === "ongoing";
    }

    if (activeTab === "completed") {
      return event.status === "completed";
    }

    return true;
  });

  /* ================= UI ================= */

  return (
    <AdminLayout
      title="Event Management"
      subtitle="Create and manage conference events, sessions, and schedules"
    >
      {/* Tabs + Create Event */}
      <div className="flex items-center justify-between mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          className="gap-2 bg-primary hover:bg-primary/90"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* Table */}
      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Event</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead className="text-center">Sessions</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.title}</TableCell>

                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <MapPin className="h-3 w-3 inline mr-1" />
                  {event.venue}
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {event.sessionsCount}
                  </div>
                </TableCell>

                {/* STATUS */}
                <TableCell className="text-center align-middle">
                  <Badge className={cn(statusStyles[event.status])}>
                    {event.status}
                  </Badge>
                </TableCell>

                {/* PUBLISH BUTTON */}
                <TableCell className="text-center align-middle">
                  {event.status === "draft" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-[96px]"
                      onClick={() => handlePublish(event.id)}
                    >
                      Publish
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-[96px]"
                      disabled
                    >
                      Published
                    </Button>
                  )}
                </TableCell>

                {/* ELLIPSIS */}
                <TableCell className="px-1 text-center align-middle">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleViewDetails(event.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={async () => {
                          try {
                            const data = await getEventDetails(
                              Number(event.id)
                            );
                            setEditingEvent(data);
                            setCreateOpen(true);
                          } catch (err) {
                            console.error(
                              "Failed to load event for editing",
                              err
                            );
                            alert("Failed to load event for editing");
                          }
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Event
                      </DropdownMenuItem>

                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Event
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateEventModal
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) {
            setEditingEvent(null);
          }
        }}
        onCreated={fetchEvents}
        event={editingEvent}
      />

      <ViewEventModal
        open={viewOpen}
        onOpenChange={setViewOpen}
        event={selectedEvent}
      />
    </AdminLayout>
  );
}
