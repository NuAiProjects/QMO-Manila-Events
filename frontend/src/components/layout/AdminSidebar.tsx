import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getRoleLabel } from "@/utils/roles";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  ClipboardCheck,
  FileText,
  BarChart3,
  Award,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Event Management", href: "/events", icon: Calendar },
  { name: "Users", href: "/users", icon: Users },
  { name: "Attendance", href: "/attendance", icon: ClipboardCheck },
  { name: "Content", href: "/content", icon: FileText },
  { name: "Analytics & Reports", href: "/analytics", icon: BarChart3 },
  { name: "Certificates", href: "/certificates", icon: Award },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { profile } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-lg">
                QMO
              </span>
            </div>
            <div>
              <h1 className="text-sidebar-foreground font-semibold text-lg leading-tight">
                Manila Events
              </h1>
              <p className="text-sidebar-muted text-xs">Admin Panel</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center mx-auto">
            <span className="text-sidebar-primary-foreground font-bold text-lg">
              NU
            </span>
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div
        className={cn(
          "p-4 border-b border-sidebar-border",
          collapsed && "px-2"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center"
          )}
        >
          <Avatar className="h-11 w-11 ring-2 ring-sidebar-primary/30">
            <AvatarImage src="/placeholder.svg" alt="Admin" />
            <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground">
              {profile?.firstname?.charAt(0) ?? "A"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-foreground font-medium text-sm truncate">
                {profile?.firstname || "Admin"}
              </p>
              <p className="text-sidebar-muted text-xs truncate">
                {getRoleLabel(profile?.role)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-muted" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-muted focus:ring-sidebar-primary"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-2">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            const linkContent = (
              <NavLink
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                  isActive &&
                    "bg-sidebar-accent text-sidebar-foreground font-medium",
                  isActive && "border-l-4 border-sidebar-primary ml-0 pl-3",
                  collapsed && "justify-center px-3"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-colors",
                    isActive && "text-sidebar-primary"
                  )}
                />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            );

            if (collapsed) {
              return (
                <li key={item.name}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-foreground text-background"
                    >
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                </li>
              );
            }

            return <li key={item.name}>{linkContent}</li>;
          })}
        </ul>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        {!collapsed ? (
          <>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Bell className="h-5 w-5 mr-3" />
              Notifications
              <span className="ml-auto bg-sidebar-primary text-sidebar-primary-foreground text-xs px-2 py-0.5 rounded-full">
                3
              </span>
            </Button>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent relative"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-sidebar-primary text-sidebar-primary-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    3
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-foreground text-background"
              >
                Notifications
              </TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-foreground text-background"
              >
                Sign Out
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-card border border-border shadow-md hover:bg-muted"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3 text-foreground" />
        ) : (
          <ChevronLeft className="h-3 w-3 text-foreground" />
        )}
      </Button>
    </aside>
  );
}
