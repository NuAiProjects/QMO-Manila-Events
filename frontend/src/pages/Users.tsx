import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Shield,
  UserCog,
  Download,
  Eye,
  Edit,
  Trash2,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "organizer" | "reviewer" | "speaker" | "attendee";
  status: "active" | "pending" | "inactive";
  avatar?: string;
  initials: string;
  registeredAt: string;
  lastActive: string;
  sessionsAttended: number;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    email: "sarah.chen@university.edu",
    role: "speaker",
    status: "active",
    initials: "SC",
    registeredAt: "2024-01-15",
    lastActive: "2 hours ago",
    sessionsAttended: 8,
  },
  {
    id: "2",
    name: "Michael Brown",
    email: "m.brown@company.com",
    role: "attendee",
    status: "active",
    initials: "MB",
    registeredAt: "2024-02-20",
    lastActive: "5 minutes ago",
    sessionsAttended: 12,
  },
  {
    id: "3",
    name: "Emily Watson",
    email: "emily.w@research.org",
    role: "reviewer",
    status: "active",
    initials: "EW",
    registeredAt: "2024-01-08",
    lastActive: "1 day ago",
    sessionsAttended: 5,
  },
  {
    id: "4",
    name: "James Wilson",
    email: "jwilson@tech.co",
    role: "organizer",
    status: "active",
    initials: "JW",
    registeredAt: "2023-12-01",
    lastActive: "Just now",
    sessionsAttended: 24,
  },
  {
    id: "5",
    name: "Anna Martinez",
    email: "anna.m@startup.io",
    role: "attendee",
    status: "pending",
    initials: "AM",
    registeredAt: "2024-03-10",
    lastActive: "Never",
    sessionsAttended: 0,
  },
  {
    id: "6",
    name: "Robert Lee",
    email: "r.lee@corp.com",
    role: "attendee",
    status: "inactive",
    initials: "RL",
    registeredAt: "2024-02-05",
    lastActive: "2 weeks ago",
    sessionsAttended: 3,
  },
];

const roleStyles = {
  admin: "bg-destructive/10 text-destructive border-destructive/20",
  organizer: "bg-primary/10 text-primary border-primary/20",
  reviewer: "bg-info/10 text-info border-info/20",
  speaker: "bg-secondary/20 text-secondary-foreground border-secondary/30",
  attendee: "bg-muted text-muted-foreground border-muted",
};

const statusStyles = {
  active: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  inactive: "bg-muted text-muted-foreground",
};

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || user.status === activeTab;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesTab && matchesRole;
  });

  return (
    <AdminLayout
      title="User Management"
      subtitle="Manage attendees, speakers, organizers, and reviewers"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">1,284</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Shield className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">1,156</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/20">
              <UserCog className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">45</p>
              <p className="text-xs text-muted-foreground">Speakers</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <Mail className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">28</p>
              <p className="text-xs text-muted-foreground">Reviewers</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <UserPlus className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">72</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex flex-1 gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="organizer">Organizer</SelectItem>
              <SelectItem value="reviewer">Reviewer</SelectItem>
              <SelectItem value="speaker">Speaker</SelectItem>
              <SelectItem value="attendee">Attendee</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Users Table */}
      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Registered</TableHead>
              <TableHead className="font-semibold">Last Active</TableHead>
              <TableHead className="font-semibold">Sessions</TableHead>
              <TableHead className="font-semibold w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow
                key={user.id}
                className="animate-fade-in hover:bg-muted/30"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-border">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={cn("text-xs capitalize", roleStyles[user.role])}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={cn("text-xs capitalize", statusStyles[user.status])}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(user.registeredAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.lastActive}
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {user.sessionsAttended}
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
                        <Eye className="h-4 w-4" /> View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Edit className="h-4 w-4" /> Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Mail className="h-4 w-4" /> Send Email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 text-destructive">
                        <Trash2 className="h-4 w-4" /> Remove User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
