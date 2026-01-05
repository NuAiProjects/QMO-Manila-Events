import { 
  Plus, 
  UserPlus, 
  Send, 
  FileDown, 
  QrCode, 
  Award,
  LucideIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickAction {
  icon: LucideIcon;
  label: string;
  description: string;
  variant: "primary" | "secondary" | "outline";
}

const actions: QuickAction[] = [
  {
    icon: Plus,
    label: "Create Event",
    description: "Add a new session or event",
    variant: "primary",
  },
  {
    icon: UserPlus,
    label: "Add Attendee",
    description: "Register new participant",
    variant: "secondary",
  },
  {
    icon: Send,
    label: "Send Announcement",
    description: "Broadcast message to all",
    variant: "outline",
  },
  {
    icon: FileDown,
    label: "Export Report",
    description: "Download analytics data",
    variant: "outline",
  },
  {
    icon: QrCode,
    label: "Check-in Scanner",
    description: "Open QR scanner",
    variant: "outline",
  },
  {
    icon: Award,
    label: "Issue Certificates",
    description: "Generate certificates",
    variant: "outline",
  },
];

export function QuickActions() {
  return (
    <div className="card-elevated p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">Common administrative tasks</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              variant={action.variant === "primary" ? "default" : action.variant === "secondary" ? "secondary" : "outline"}
              className={cn(
                "h-auto flex-col gap-2 p-4 hover:scale-[1.02] transition-all duration-200",
                action.variant === "primary" && "bg-primary hover:bg-primary/90",
                action.variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/90",
                "animate-scale-in"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
