import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Download,
  TrendingUp,
  Users,
  Calendar,
  Star,
  MessageSquare,
  Award,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

const attendanceByDay = [
  { day: "Day 1", attendance: 892, target: 1000 },
  { day: "Day 2", attendance: 1024, target: 1000 },
  { day: "Day 3", attendance: 1156, target: 1000 },
  { day: "Day 4", attendance: 980, target: 1000 },
  { day: "Day 5", attendance: 756, target: 800 },
];

const sessionPopularity = [
  { session: "Keynote", attendees: 485 },
  { session: "AI Workshop", attendees: 48 },
  { session: "Panel", attendees: 156 },
  { session: "Networking", attendees: 320 },
  { session: "Closing", attendees: 412 },
];

const feedbackScores = [
  { name: "Content Quality", value: 4.5 },
  { name: "Speaker Quality", value: 4.7 },
  { name: "Venue", value: 4.2 },
  { name: "Organization", value: 4.4 },
  { name: "Networking", value: 4.1 },
];

const engagementTrend = [
  { time: "9 AM", engagement: 65 },
  { time: "10 AM", engagement: 82 },
  { time: "11 AM", engagement: 91 },
  { time: "12 PM", engagement: 45 },
  { time: "1 PM", engagement: 38 },
  { time: "2 PM", engagement: 78 },
  { time: "3 PM", engagement: 85 },
  { time: "4 PM", engagement: 72 },
  { time: "5 PM", engagement: 55 },
];

const departmentDistribution = [
  { name: "Technology", value: 35, color: "hsl(252, 84%, 27%)" },
  { name: "Research", value: 25, color: "hsl(45, 100%, 51%)" },
  { name: "Business", value: 20, color: "hsl(142, 76%, 36%)" },
  { name: "Healthcare", value: 12, color: "hsl(199, 89%, 48%)" },
  { name: "Education", value: 8, color: "hsl(0, 84%, 60%)" },
];

export default function Analytics() {
  return (
    <AdminLayout
      title="Analytics & Reports"
      subtitle="Comprehensive insights and data visualization for your conference"
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Days</SelectItem>
              <SelectItem value="day1">Day 1</SelectItem>
              <SelectItem value="day2">Day 2</SelectItem>
              <SelectItem value="day3">Day 3</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Track" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Tracks</SelectItem>
              <SelectItem value="main">Main Track</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="industry">Industry</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="card-elevated">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-primary">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <Badge className="bg-success/10 text-success text-xs">+18%</Badge>
            </div>
            <p className="text-3xl font-bold text-foreground">4,808</p>
            <p className="text-sm text-muted-foreground">Total Attendance</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-secondary">
                <Star className="h-5 w-5 text-secondary-foreground" />
              </div>
              <Badge className="bg-success/10 text-success text-xs">+0.3</Badge>
            </div>
            <p className="text-3xl font-bold text-foreground">4.5</p>
            <p className="text-sm text-muted-foreground">Avg. Rating</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-success">
                <MessageSquare className="h-5 w-5 text-success-foreground" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">78%</p>
            <p className="text-sm text-muted-foreground">Feedback Rate</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-info">
                <Target className="h-5 w-5 text-info-foreground" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">96%</p>
            <p className="text-sm text-muted-foreground">Target Achievement</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Daily Attendance vs Target</CardTitle>
            <CardDescription>Comparing actual attendance to targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="attendance" fill="hsl(252, 84%, 27%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" fill="hsl(45, 100%, 51%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Engagement Throughout Day</CardTitle>
            <CardDescription>Hourly engagement score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="time"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="engagement"
                    stroke="hsl(252, 84%, 27%)"
                    strokeWidth={3}
                    dot={{ fill: "hsl(252, 84%, 27%)", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Session Popularity</CardTitle>
            <CardDescription>Attendance by session type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionPopularity} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    type="number"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="session"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="attendees" fill="hsl(45, 100%, 51%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Attendee Distribution</CardTitle>
            <CardDescription>By department/industry</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {departmentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value}%`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {departmentDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Feedback Scores</CardTitle>
            <CardDescription>Average ratings by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feedbackScores.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-foreground">{item.name}</span>
                    <span className="text-sm font-medium text-foreground">
                      {item.value}/5
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${(item.value / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
          <CardDescription>Download detailed reports in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Download className="h-5 w-5" />
              <span>Attendance Report</span>
              <span className="text-xs text-muted-foreground">CSV / PDF</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Download className="h-5 w-5" />
              <span>Feedback Report</span>
              <span className="text-xs text-muted-foreground">CSV / PDF</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Download className="h-5 w-5" />
              <span>Session Analytics</span>
              <span className="text-xs text-muted-foreground">CSV / PDF</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Download className="h-5 w-5" />
              <span>Full Report</span>
              <span className="text-xs text-muted-foreground">PDF</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
