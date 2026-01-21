import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
  };
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  accentColor?: "primary" | "secondary" | "success" | "warning" | "info";
}

export function KPICard({
  title,
  value,
  change,
  icon: Icon,
  trend = "neutral",
  accentColor = "primary",
}: KPICardProps) {
  const accentStyles = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/20 text-secondary-foreground",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    info: "bg-info/10 text-info",
  };

  const iconBgStyles = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    success: "bg-success",
    warning: "bg-warning",
    info: "bg-info",
  };

  const trendColors = {
    up: "text-success",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  };

  return (
    <div className="kpi-card group">
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "p-3 rounded-xl transition-transform duration-200 group-hover:scale-105",
            iconBgStyles[accentColor]
          )}
        >
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
        {change && (
          <div
            className={cn(
              "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
              accentStyles[accentColor]
            )}
          >
            <span className={trendColors[trend]}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
            </span>
            <span>{change.value}%</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-bold text-foreground tracking-tight">
          {value}
        </p>
        {change && (
          <p className="text-xs text-muted-foreground mt-2">
            {change.label}
          </p>
        )}
      </div>
    </div>
  );
}
