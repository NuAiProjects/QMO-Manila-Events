import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Activity {
  id: string;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  action: string;
  target: string;
  timestamp: string;
  type: "registration" | "session" | "feedback" | "certificate" | "system";
}

const mockActivities: Activity[] = [
  {
    id: "1",
    user: { name: "Dr. Sarah Chen", initials: "SC" },
    action: "registered for",
    target: "Keynote: Future of AI",
    timestamp: "2 minutes ago",
    type: "registration",
  },
  {
    id: "2",
    user: { name: "John Miller", initials: "JM" },
    action: "submitted feedback for",
    target: "Workshop: Machine Learning",
    timestamp: "15 minutes ago",
    type: "feedback",
  },
  {
    id: "3",
    user: { name: "Admin System", initials: "SY" },
    action: "generated certificates for",
    target: "Day 1 Attendees",
    timestamp: "1 hour ago",
    type: "certificate",
  },
  {
    id: "4",
    user: { name: "Emily Watson", initials: "EW" },
    action: "checked in to",
    target: "Panel Discussion: Tech Ethics",
    timestamp: "2 hours ago",
    type: "session",
  },
  {
    id: "5",
    user: { name: "Michael Brown", initials: "MB" },
    action: "updated profile for",
    target: "Speaker Portal",
    timestamp: "3 hours ago",
    type: "system",
  },
];

const typeColors = {
  registration: "bg-success/10 text-success",
  session: "bg-info/10 text-info",
  feedback: "bg-warning/10 text-warning",
  certificate: "bg-secondary/20 text-secondary-foreground",
  system: "bg-muted text-muted-foreground",
};

export function RecentActivity() {
  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <button className="text-sm text-primary hover:underline">View all</button>
      </div>

      <ScrollArea className="h-[320px] pr-4">
        <div className="space-y-4">
          {mockActivities.map((activity, index) => (
            <div
              key={activity.id}
              className={cn(
                "flex items-start gap-4 p-3 rounded-xl transition-colors hover:bg-muted/50",
                "animate-slide-in-up"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Avatar className="h-10 w-10 ring-2 ring-border">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {activity.user.initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full capitalize",
                      typeColors[activity.type]
                    )}
                  >
                    {activity.type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
