import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  QrCode,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  Calendar,
  TrendingUp,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AttendanceRecord {
  id: string;
  attendee: {
    name: string;
    email: string;
    initials: string;
    ticketType: string;
  };
  session: string;
  checkInTime: string;
  checkOutTime?: string;
  status: "checked-in" | "checked-out" | "no-show";
  method: "qr" | "manual" | "auto";
}

const mockAttendance: AttendanceRecord[] = [
  {
    id: "1",
    attendee: {
      name: "Dr. Sarah Chen",
      email: "sarah.chen@university.edu",
      initials: "SC",
      ticketType: "VIP",
    },
    session: "Opening Keynote",
    checkInTime: "08:45 AM",
    checkOutTime: "10:35 AM",
    status: "checked-out",
    method: "qr",
  },
  {
    id: "2",
    attendee: {
      name: "Michael Brown",
      email: "m.brown@company.com",
      initials: "MB",
      ticketType: "Standard",
    },
    session: "Workshop: AI Basics",
    checkInTime: "11:02 AM",
    status: "checked-in",
    method: "qr",
  },
  {
    id: "3",
    attendee: {
      name: "Emily Watson",
      email: "emily.w@research.org",
      initials: "EW",
      ticketType: "Academic",
    },
    session: "Panel Discussion",
    checkInTime: "-",
    status: "no-show",
    method: "auto",
  },
  {
    id: "4",
    attendee: {
      name: "James Wilson",
      email: "jwilson@tech.co",
      initials: "JW",
      ticketType: "VIP",
    },
    session: "Networking Lunch",
    checkInTime: "12:58 PM",
    status: "checked-in",
    method: "manual",
  },
];

const statusStyles = {
  "checked-in": "bg-success/10 text-success",
  "checked-out": "bg-info/10 text-info",
  "no-show": "bg-destructive/10 text-destructive",
};

const statusIcons = {
  "checked-in": CheckCircle2,
  "checked-out": Clock,
  "no-show": XCircle,
};

const methodStyles = {
  qr: "bg-secondary/20 text-secondary-foreground",
  manual: "bg-primary/10 text-primary",
  auto: "bg-muted text-muted-foreground",
};

export default function Attendance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionFilter, setSessionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const sessions = [
    "Opening Keynote",
    "Workshop: AI Basics",
    "Panel Discussion",
    "Networking Lunch",
  ];

  return (
    <AdminLayout
      title="Attendance"
      subtitle="Track check-ins, monitor session attendance, and manage registrations"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card-elevated p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-primary">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <Badge className="bg-success/10 text-success text-xs">+12%</Badge>
          </div>
          <p className="text-3xl font-bold text-foreground">892</p>
          <p className="text-sm text-muted-foreground">Total Check-ins Today</p>
          <Progress value={74} className="mt-3 h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">74% of registered</p>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-secondary">
              <Calendar className="h-5 w-5 text-secondary-foreground" />
            </div>
            <Badge className="bg-info/10 text-info text-xs">Live</Badge>
          </div>
          <p className="text-3xl font-bold text-foreground">12</p>
          <p className="text-sm text-muted-foreground">Active Sessions</p>
          <Progress value={85} className="mt-3 h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">85% avg. attendance</p>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-success">
              <CheckCircle2 className="h-5 w-5 text-success-foreground" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">98.2%</p>
          <p className="text-sm text-muted-foreground">QR Scan Success</p>
          <Progress value={98} className="mt-3 h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">2,156 scans processed</p>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-warning">
              <TrendingUp className="h-5 w-5 text-warning-foreground" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">4.2</p>
          <p className="text-sm text-muted-foreground">Avg. Sessions/Person</p>
          <Progress value={60} className="mt-3 h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">Above target (3.5)</p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex flex-1 gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search attendees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sessionFilter} onValueChange={setSessionFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Session" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Sessions</SelectItem>
              {sessions.map((session) => (
                <SelectItem key={session} value={session}>
                  {session}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="checked-in">Checked In</SelectItem>
              <SelectItem value="checked-out">Checked Out</SelectItem>
              <SelectItem value="no-show">No Show</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <QrCode className="h-4 w-4" />
            Open Scanner
          </Button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Attendee</TableHead>
              <TableHead className="font-semibold">Ticket Type</TableHead>
              <TableHead className="font-semibold">Session</TableHead>
              <TableHead className="font-semibold">Check-in</TableHead>
              <TableHead className="font-semibold">Check-out</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAttendance.map((record, index) => {
              const StatusIcon = statusIcons[record.status];
              return (
                <TableRow
                  key={record.id}
                  className="animate-fade-in hover:bg-muted/30"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-border">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {record.attendee.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">
                          {record.attendee.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {record.attendee.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "text-xs",
                        record.attendee.ticketType === "VIP"
                          ? "bg-secondary/20 text-secondary-foreground"
                          : record.attendee.ticketType === "Academic"
                          ? "bg-info/10 text-info"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {record.attendee.ticketType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{record.session}</TableCell>
                  <TableCell className="text-sm">{record.checkInTime}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {record.checkOutTime || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("gap-1.5 text-xs", statusStyles[record.status])}>
                      <StatusIcon className="h-3 w-3" />
                      {record.status.replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs uppercase", methodStyles[record.method])}>
                      {record.method}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
