import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Users,
  Edit,
  Trash2,
  Copy,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  type: "keynote" | "workshop" | "panel" | "networking" | "break";
  date: string;
  time: string;
  venue: string;
  speaker: string;
  capacity: number;
  registered: number;
  status: "draft" | "published" | "live" | "completed";
  track: string;
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Opening Keynote: Future of Innovation",
    type: "keynote",
    date: "2024-03-15",
    time: "09:00 - 10:30",
    venue: "Main Hall A",
    speaker: "Dr. Sarah Chen",
    capacity: 500,
    registered: 485,
    status: "published",
    track: "Main Track",
  },
  {
    id: "2",
    title: "Workshop: Building AI Applications",
    type: "workshop",
    date: "2024-03-15",
    time: "11:00 - 13:00",
    venue: "Room 201",
    speaker: "Michael Brown",
    capacity: 50,
    registered: 48,
    status: "published",
    track: "Technical",
  },
  {
    id: "3",
    title: "Panel: Ethics in Technology",
    type: "panel",
    date: "2024-03-15",
    time: "14:00 - 15:30",
    venue: "Conference Room B",
    speaker: "Multiple Speakers",
    capacity: 200,
    registered: 156,
    status: "draft",
    track: "Industry",
  },
  {
    id: "4",
    title: "Networking Lunch",
    type: "networking",
    date: "2024-03-15",
    time: "13:00 - 14:00",
    venue: "Expo Hall",
    speaker: "-",
    capacity: 600,
    registered: 520,
    status: "published",
    track: "General",
  },
  {
    id: "5",
    title: "Workshop: Cloud Architecture",
    type: "workshop",
    date: "2024-03-16",
    time: "09:00 - 11:00",
    venue: "Room 305",
    speaker: "Emily Watson",
    capacity: 40,
    registered: 35,
    status: "published",
    track: "Technical",
  },
];

const typeStyles = {
  keynote: "bg-primary/10 text-primary border-primary/20",
  workshop: "bg-secondary/20 text-secondary-foreground border-secondary/30",
  panel: "bg-info/10 text-info border-info/20",
  networking: "bg-success/10 text-success border-success/20",
  break: "bg-muted text-muted-foreground border-muted",
};

const statusStyles = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-success/10 text-success",
  live: "bg-destructive text-destructive-foreground",
  completed: "bg-primary/10 text-primary",
};

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" || event.type === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <AdminLayout
      title="Event Management"
      subtitle="Create and manage conference events, sessions, and schedules"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex flex-1 gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, speakers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="keynote">Keynotes</TabsTrigger>
          <TabsTrigger value="workshop">Workshops</TabsTrigger>
          <TabsTrigger value="panel">Panels</TabsTrigger>
          <TabsTrigger value="networking">Networking</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Events Table */}
      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Event</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Date & Time</TableHead>
              <TableHead className="font-semibold">Venue</TableHead>
              <TableHead className="font-semibold">Speaker</TableHead>
              <TableHead className="font-semibold">Capacity</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event, index) => (
              <TableRow
                key={event.id}
                className="animate-fade-in hover:bg-muted/30"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground line-clamp-1">
                      {event.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{event.track}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={cn("text-xs capitalize", typeStyles[event.type])}>
                    {event.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {event.time}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {event.venue}
                  </div>
                </TableCell>
                <TableCell className="text-sm">{event.speaker}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm">
                      {event.registered}/{event.capacity}
                    </span>
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          event.registered / event.capacity > 0.9
                            ? "bg-warning"
                            : "bg-primary"
                        )}
                        style={{
                          width: `${(event.registered / event.capacity) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={cn("text-xs capitalize", statusStyles[event.status])}>
                    {event.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                      <DropdownMenuItem className="gap-2">
                        <Eye className="h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Edit className="h-4 w-4" /> Edit Event
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Copy className="h-4 w-4" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-destructive">
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="card-elevated p-4 text-center">
          <p className="text-2xl font-bold text-foreground">50</p>
          <p className="text-sm text-muted-foreground">Total Events</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <p className="text-2xl font-bold text-foreground">42</p>
          <p className="text-sm text-muted-foreground">Published</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <p className="text-2xl font-bold text-foreground">8</p>
          <p className="text-sm text-muted-foreground">Drafts</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <p className="text-2xl font-bold text-success">89%</p>
          <p className="text-sm text-muted-foreground">Avg. Capacity</p>
        </div>
      </div>
    </AdminLayout>
  );
}
