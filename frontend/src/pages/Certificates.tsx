import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Award,
  Download,
  Send,
  Upload,
  QrCode,
  RefreshCw,
  MoreHorizontal,
  Eye,
  XCircle,
  CheckCircle2,
  Clock,
  FileText,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Certificate {
  id: string;
  attendee: {
    name: string;
    email: string;
    initials: string;
  };
  type: "attendance" | "speaker" | "workshop" | "award";
  status: "issued" | "pending" | "revoked";
  issuedAt?: string;
  verificationCode: string;
  downloads: number;
}

const mockCertificates: Certificate[] = [
  {
    id: "1",
    attendee: { name: "Dr. Sarah Chen", email: "sarah.chen@university.edu", initials: "SC" },
    type: "speaker",
    status: "issued",
    issuedAt: "2024-03-15",
    verificationCode: "NUCONF-2024-SC001",
    downloads: 3,
  },
  {
    id: "2",
    attendee: { name: "Michael Brown", email: "m.brown@company.com", initials: "MB" },
    type: "attendance",
    status: "issued",
    issuedAt: "2024-03-15",
    verificationCode: "NUCONF-2024-MB002",
    downloads: 1,
  },
  {
    id: "3",
    attendee: { name: "Emily Watson", email: "emily.w@research.org", initials: "EW" },
    type: "workshop",
    status: "pending",
    verificationCode: "NUCONF-2024-EW003",
    downloads: 0,
  },
  {
    id: "4",
    attendee: { name: "James Wilson", email: "jwilson@tech.co", initials: "JW" },
    type: "award",
    status: "issued",
    issuedAt: "2024-03-14",
    verificationCode: "NUCONF-2024-JW004",
    downloads: 5,
  },
  {
    id: "5",
    attendee: { name: "Anna Martinez", email: "anna.m@startup.io", initials: "AM" },
    type: "attendance",
    status: "revoked",
    verificationCode: "NUCONF-2024-AM005",
    downloads: 0,
  },
];

const typeStyles = {
  attendance: "bg-primary/10 text-primary border-primary/20",
  speaker: "bg-secondary/20 text-secondary-foreground border-secondary/30",
  workshop: "bg-info/10 text-info border-info/20",
  award: "bg-warning/10 text-warning border-warning/20",
};

const statusStyles = {
  issued: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  revoked: "bg-destructive/10 text-destructive",
};

const statusIcons = {
  issued: CheckCircle2,
  pending: Clock,
  revoked: XCircle,
};

export default function Certificates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCertificates = mockCertificates.filter((cert) => {
    const matchesSearch =
      cert.attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.verificationCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || cert.type === typeFilter;
    const matchesStatus = statusFilter === "all" || cert.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <AdminLayout
      title="Certificate Management"
      subtitle="Generate, issue, and verify conference certificates"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="card-elevated">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-success">
                <Award className="h-5 w-5 text-success-foreground" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">645</p>
            <p className="text-sm text-muted-foreground">Issued</p>
            <Progress value={92} className="mt-3 h-1.5" />
            <p className="text-xs text-muted-foreground mt-1">92% of eligible</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-warning">
                <Clock className="h-5 w-5 text-warning-foreground" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">58</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-info">
                <Download className="h-5 w-5 text-info-foreground" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">1.2K</p>
            <p className="text-sm text-muted-foreground">Downloads</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-secondary">
                <QrCode className="h-5 w-5 text-secondary-foreground" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">89</p>
            <p className="text-sm text-muted-foreground">Verifications</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Button className="h-auto py-4 flex-col gap-2 bg-primary hover:bg-primary/90">
          <RefreshCw className="h-5 w-5" />
          <span>Generate All</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2">
          <Send className="h-5 w-5" />
          <span>Send Batch</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2">
          <Upload className="h-5 w-5" />
          <span>Upload Template</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2">
          <QrCode className="h-5 w-5" />
          <span>Verify Code</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex flex-1 gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="attendance">Attendance</SelectItem>
              <SelectItem value="speaker">Speaker</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="award">Award</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="issued">Issued</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="revoked">Revoked</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Certificates Table */}
      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Recipient</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Verification Code</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Issued Date</TableHead>
              <TableHead className="font-semibold">Downloads</TableHead>
              <TableHead className="font-semibold w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCertificates.map((cert, index) => {
              const StatusIcon = statusIcons[cert.status];
              return (
                <TableRow
                  key={cert.id}
                  className="animate-fade-in hover:bg-muted/30"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-border">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {cert.attendee.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{cert.attendee.name}</p>
                        <p className="text-sm text-muted-foreground">{cert.attendee.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs capitalize", typeStyles[cert.type])}>
                      {cert.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                      {cert.verificationCode}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("gap-1.5 text-xs capitalize", statusStyles[cert.status])}>
                      <StatusIcon className="h-3 w-3" />
                      {cert.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell className="text-sm font-medium">{cert.downloads}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" /> Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Download className="h-4 w-4" /> Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Send className="h-4 w-4" /> Send to Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <RefreshCw className="h-4 w-4" /> Regenerate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <XCircle className="h-4 w-4" /> Revoke
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Template Settings */}
      <Card className="card-elevated mt-6">
        <CardHeader>
          <CardTitle>Certificate Templates</CardTitle>
          <CardDescription>Manage certificate designs and eligibility rules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {["Attendance", "Speaker", "Workshop", "Award"].map((type) => (
              <div
                key={type}
                className="p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{type}</p>
                    <p className="text-xs text-muted-foreground">Certificate</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {type === "Attendance" ? "700" : type === "Speaker" ? "45" : type === "Workshop" ? "120" : "12"} eligible
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
