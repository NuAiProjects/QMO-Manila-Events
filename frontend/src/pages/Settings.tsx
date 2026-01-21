import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Globe,
  Zap,
  Users,
  Calendar,
  Mail,
  Save,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingSection {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

const settingSections: SettingSection[] = [
  { id: "general", label: "General", icon: SettingsIcon, description: "Basic conference settings" },
  { id: "notifications", label: "Notifications", icon: Bell, description: "Email and push alerts" },
  { id: "security", label: "Security", icon: Shield, description: "Access and permissions" },
  { id: "appearance", label: "Appearance", icon: Palette, description: "Theme and branding" },
  { id: "modules", label: "Modules", icon: Zap, description: "Enable/disable features" },
  { id: "integrations", label: "Integrations", icon: Globe, description: "Third-party connections" },
];

export default function Settings() {
  return (
    <AdminLayout
      title="Settings"
      subtitle="Configure system preferences and manage conference settings"
    >
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
          {settingSections.map((section) => {
            const Icon = section.icon;
            return (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="gap-2 data-[state=active]:bg-background"
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Conference Information</CardTitle>
              <CardDescription>Basic details about your conference</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="conf-name">Conference Name</Label>
                  <Input id="conf-name" defaultValue="NU Annual Technology Conference 2024" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conf-code">Conference Code</Label>
                  <Input id="conf-code" defaultValue="NUCONF2024" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input id="start-date" type="date" defaultValue="2024-03-15" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input id="end-date" type="date" defaultValue="2024-03-18" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  defaultValue="Join us for the premier technology conference featuring industry leaders, cutting-edge research, and networking opportunities."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input id="venue" defaultValue="NU Conference Center, Main Campus" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Logo and visual identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-2xl">NU</span>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Logo
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    PNG or SVG, max 2MB. Recommended size: 200x200px
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure automatic email alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { id: "reg-confirm", label: "Registration Confirmation", description: "Send email when attendee registers" },
                { id: "session-reminder", label: "Session Reminders", description: "Remind attendees before sessions" },
                { id: "certificate-ready", label: "Certificate Ready", description: "Notify when certificate is generated" },
                { id: "feedback-request", label: "Feedback Requests", description: "Ask for feedback after sessions" },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor={item.id}>{item.label}</Label>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch id={item.id} defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>Real-time alerts for administrators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { id: "new-reg", label: "New Registrations", description: "Alert when someone registers" },
                { id: "check-in", label: "Check-in Activity", description: "Notify on high check-in volume" },
                { id: "emergency", label: "Emergency Alerts", description: "Urgent system notifications" },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor={item.id}>{item.label}</Label>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch id={item.id} defaultChecked={item.id === "emergency"} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
              <CardDescription>Manage authentication and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">Auto logout after inactivity</p>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>IP Whitelist</Label>
                  <p className="text-sm text-muted-foreground">Restrict admin access to specific IPs</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Password Policy</CardTitle>
              <CardDescription>Set requirements for user passwords</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Length</Label>
                  <Select defaultValue="8">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="6">6 characters</SelectItem>
                      <SelectItem value="8">8 characters</SelectItem>
                      <SelectItem value="10">10 characters</SelectItem>
                      <SelectItem value="12">12 characters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Expiry Period</Label>
                  <Select defaultValue="90">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="special-chars" defaultChecked />
                <Label htmlFor="special-chars">Require special characters</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="uppercase" defaultChecked />
                <Label htmlFor="uppercase">Require uppercase letters</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Color Mode</Label>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">Light</Button>
                  <Button variant="outline" className="flex-1">Dark</Button>
                  <Button variant="default" className="flex-1">System</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-3">
                  {["#231076", "#0066CC", "#008844", "#CC3300", "#6600CC"].map((color) => (
                    <button
                      key={color}
                      className={cn(
                        "w-10 h-10 rounded-lg border-2 transition-all",
                        color === "#231076" ? "border-foreground scale-110" : "border-transparent"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex gap-3">
                  {["#ffcc07", "#00CCFF", "#FF6600", "#CC00CC", "#00CC66"].map((color) => (
                    <button
                      key={color}
                      className={cn(
                        "w-10 h-10 rounded-lg border-2 transition-all",
                        color === "#ffcc07" ? "border-foreground scale-110" : "border-transparent"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Modules Settings */}
        <TabsContent value="modules" className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Feature Modules</CardTitle>
              <CardDescription>Enable or disable conference features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { id: "gamification", label: "Gamification", description: "Points, badges, and leaderboards", enabled: true },
                { id: "qr-checkin", label: "QR Check-in", description: "Scan QR codes for attendance", enabled: true },
                { id: "live-polling", label: "Live Polling", description: "Interactive session polls", enabled: false },
                { id: "networking", label: "Networking", description: "Attendee matchmaking", enabled: true },
                { id: "expo", label: "Expo Hall", description: "Virtual booth management", enabled: false },
                { id: "academic-review", label: "Academic Review", description: "Paper submission and review", enabled: true },
              ].map((module) => (
                <div key={module.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                  <div className="space-y-0.5">
                    <Label className="text-base">{module.label}</Label>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </div>
                  <Switch defaultChecked={module.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations" className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Connected Services</CardTitle>
              <CardDescription>Third-party integrations and APIs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Email Provider", status: "connected", provider: "SendGrid" },
                { name: "Payment Gateway", status: "connected", provider: "Stripe" },
                { name: "Video Platform", status: "not_connected", provider: "Zoom" },
                { name: "Calendar Sync", status: "connected", provider: "Google Calendar" },
              ].map((integration) => (
                <div
                  key={integration.name}
                  className="flex items-center justify-between p-4 rounded-xl border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{integration.name}</p>
                      <p className="text-sm text-muted-foreground">{integration.provider}</p>
                    </div>
                  </div>
                  <Button
                    variant={integration.status === "connected" ? "outline" : "default"}
                    size="sm"
                  >
                    {integration.status === "connected" ? "Configure" : "Connect"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage API access tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Public API Key</Label>
                <div className="flex gap-2">
                  <Input value="pk_live_xxxxxxxxxxxxxx" readOnly className="font-mono text-sm" />
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Secret API Key</Label>
                <div className="flex gap-2">
                  <Input value="sk_live_••••••••••••••" readOnly className="font-mono text-sm" />
                  <Button variant="outline" size="icon">
                    <EyeOff className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </AdminLayout>
  );
}
