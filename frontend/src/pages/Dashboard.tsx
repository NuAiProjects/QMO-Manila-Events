import { AdminLayout } from "@/components/layout/AdminLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { SessionsDonut } from "@/components/dashboard/SessionsDonut";
import { UpcomingSessions } from "@/components/dashboard/UpcomingSessions";
import { QuickActions } from "@/components/dashboard/QuickActions";
import {
  Users,
  Calendar,
  ClipboardCheck,
  MessageSquare,
  Award,
  TrendingUp,
} from "lucide-react";

export default function Dashboard() {
  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening at your conference."
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KPICard
          title="Total Attendees"
          value="1,284"
          change={{ value: 12, label: "vs last event" }}
          icon={Users}
          trend="up"
          accentColor="primary"
        />
        <KPICard
          title="Sessions Today"
          value="12"
          change={{ value: 3, label: "more than yesterday" }}
          icon={Calendar}
          trend="up"
          accentColor="secondary"
        />
        <KPICard
          title="Check-ins Today"
          value="892"
          change={{ value: 8, label: "attendance rate" }}
          icon={ClipboardCheck}
          trend="up"
          accentColor="success"
        />
        <KPICard
          title="Feedback Rate"
          value="78%"
          change={{ value: 5, label: "completion rate" }}
          icon={MessageSquare}
          trend="up"
          accentColor="info"
        />
        <KPICard
          title="Certificates Issued"
          value="645"
          change={{ value: 92, label: "of eligible" }}
          icon={Award}
          trend="neutral"
          accentColor="warning"
        />
        <KPICard
          title="Engagement Score"
          value="94"
          change={{ value: 6, label: "points increase" }}
          icon={TrendingUp}
          trend="up"
          accentColor="primary"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <AttendanceChart />
        </div>
        <SessionsDonut />
      </div>

      {/* Sessions and Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <UpcomingSessions />
        </div>
        <RecentActivity />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </AdminLayout>
  );
}
