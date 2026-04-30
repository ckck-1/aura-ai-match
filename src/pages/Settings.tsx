import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Lock, CreditCard, Globe, Save, Mail, Phone, Building2, Tag, Link2 } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl pt-8">
        <h1 className="font-display text-3xl font-bold mb-8">Settings</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/30">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="size-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="size-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="size-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="size-4" />
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="glass-strong">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details and public profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" defaultValue="John Doe" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john@dev.drop" className="mt-1" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Professional title</Label>
                  <Input id="title" placeholder="e.g. Senior Full-Stack Engineer" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    rows={4}
                    className="mt-1 w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="relative mt-1">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="location" placeholder="e.g. San Francisco, CA" className="pl-10" />
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>Social Links</Label>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Github className="size-3" />
                        GitHub
                      </div>
                      <Input placeholder="github.com/yourusername" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Linkedin className="size-3" />
                        LinkedIn
                      </div>
                      <Input placeholder="linkedin.com/in/yourprofile" />
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Globe className="size-3" />
                        Portfolio / Website
                      </div>
                      <Input placeholder="yourwebsite.com" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} className="btn-liquid">
                    <Save className="size-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="glass-strong">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how and when you want to be notified.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium">Email notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium">New job matches</p>
                    <p className="text-sm text-muted-foreground">Get notified when a new job matches your profile</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium">Application status changes</p>
                    <p className="text-sm text-muted-foreground">Updates on your job applications</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium">Messages</p>
                    <p className="text-sm text-muted-foreground">Real-time message notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium">Product updates & tips</p>
                    <p className="text-sm text-muted-foreground">Stay informed about new features</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} className="btn-liquid">
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="glass-strong">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password and account security.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Current password</Label>
                      <Input id="current-password" type="password" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="new-password">New password</Label>
                      <Input id="new-password" type="password" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Confirm new password</Label>
                      <Input id="confirm-password" type="password" className="mt-1" />
                    </div>
                    <Button variant="outline">Update Password</Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4 text-destructive">Danger Zone</h3>
                  <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-xl bg-destructive/5">
                    <div>
                      <p className="font-medium text-destructive">Delete account</p>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card className="glass-strong">
              <CardHeader>
                <CardTitle>Billing & Credits</CardTitle>
                <CardDescription>View your current plan and manage credits.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border">
                    <p className="text-sm text-muted-foreground">Current plan</p>
                    <p className="text-2xl font-bold mt-1">Free</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 border border-border">
                    <p className="text-sm text-muted-foreground">Credits remaining</p>
                    <p className="text-2xl font-bold mt-1 text-primary">47</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 border border-border">
                    <p className="text-sm text-muted-foreground">Next billing</p>
                    <p className="text-2xl font-bold mt-1">Mar 15</p>
                  </div>
                </div>
                <Button className="btn-liquid w-full">
                  <CreditCard className="size-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
