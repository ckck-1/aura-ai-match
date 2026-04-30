import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppShell } from "@/components/app/AppShell";
import { Link } from "react-router-dom";
import { 
  Briefcase, FileText, CheckCircle2, Clock, TrendingUp, 
  Star, ExternalLink, Edit3, Sparkles 
} from "lucide-react";
import { useDeveloperProfile, useMyApplications, useJobsFeed } from "@/services/api";

// Tab 1: Dashboard Overview
function DashboardOverview() {
  const { data: profile, isLoading: profileLoading } = useDeveloperProfile();
  const { data: jobs = { jobs: [] } } = useJobsFeed(1, {});
  const { data: applications = { applications: [] } } = useMyApplications(1);

  if (profileLoading) {
    return <div className="animate-pulse space-y-4"><div className="h-32 bg-muted rounded" /><div className="h-64 bg-muted rounded" /></div>;
  }

  // Calculate profile completeness
  const completenessFields = [
    { label: "Full name", done: !!profile?.fullName },
    { label: "Title", done: !!profile?.title },
    { label: "Bio", done: !!profile?.bio && profile.bio.length > 20 },
    { label: "Skills", done: !!profile?.skills && profile.skills.length >= 3 },
    { label: "Experience", done: !!profile?.experienceYears },
    { label: "Social links", done: !!(profile?.githubUrl || profile?.linkedinUrl) },
  ];
  const completenessScore = Math.round((completenessFields.filter(f => f.done).length / completenessFields.length) * 100);

  // Get recent applications
  const recentApps = applications.applications?.slice(0, 3) || [];

  return (
    <div className="space-y-6">
      {/* Profile Completeness Card */}
      <Card className="glass-strong border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                Profile Strength
              </CardTitle>
              <CardDescription>Complete your profile to get better matches</CardDescription>
            </div>
            <div className="text-3xl font-display font-bold text-primary">{completenessScore}%</div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={completenessScore} className="h-2 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {completenessFields.map((field) => (
              <div key={field.label} className={`flex items-center gap-2 text-sm p-2 rounded-lg ${field.done ? "bg-primary/10 text-primary" : "bg-muted/30 text-muted-foreground"}`}>
                {field.done ? <CheckCircle2 className="size-4" /> : <Clock className="size-4" />}
                {field.label}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recommended Jobs */}
        <Card className="glass-strong md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>AI-matched jobs based on your skills</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/jobs">View all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {jobs.jobs?.slice(0, 3).map((job: any) => (
                <Link
                  key={job._id}
                  to={`/jobs/${job._id}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors"
                >
                  <div>
                    <h4 className="font-semibold">{job.title}</h4>
                    <p className="text-sm text-muted-foreground">{job.startup.name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{job.matchScore}% match</Badge>
                    <span className="text-sm text-muted-foreground">
                      ${(job.salaryRange.min / 1000).toFixed(0)}k – ${(job.salaryRange.max / 1000).toFixed(0)}k
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Application Tracker */}
        <Card className="glass-strong md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5" />
                My Applications
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/applications">View all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentApps.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="size-12 mx-auto mb-3 opacity-30" />
                <p>No applications yet. Start applying to jobs!</p>
                <Button asChild className="mt-4" variant="outline">
                  <Link to="/jobs">Browse Jobs</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentApps.map((app: any) => (
                  <Link
                    key={app._id}
                    to="/applications"
                    className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30"
                  >
                    <div>
                      <h4 className="font-semibold">{app.jobId?.title || "Job Application"}</h4>
                      <p className="text-sm text-muted-foreground">{app.jobId?.startupId?.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={
                      app.status === "accepted" ? "default" :
                      app.status === "rejected" ? "destructive" :
                      app.status === "shortlisted" ? "secondary" : "outline"
                    }>
                      {app.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Tab 2: Profile Editor (Multi-tab)
function ProfileEditor() {
  const { data: profile } = useDeveloperProfile();
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="glass-strong">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="size-5" />
            Edit Profile
          </CardTitle>
          <CardDescription>Keep your profile up to date to improve matching accuracy.</CardDescription>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/30">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <FileText className="size-4" />
            Personal Info
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Star className="size-4" />
            Tech Stack
          </TabsTrigger>
          <TabsTrigger value="socials" className="flex items-center gap-2">
            <ExternalLink className="size-4" />
            Social Links
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <Card className="glass-strong">
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Full Name</label>
                <input defaultValue={profile?.fullName} className="w-full mt-1 bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Professional Title</label>
                <input defaultValue={profile?.title} placeholder="e.g. Senior Full-Stack Engineer" className="w-full mt-1 bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Bio</label>
                <textarea rows={5} defaultValue={profile?.bio} placeholder="Tell us about yourself..." className="w-full mt-1 bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Years of Experience</label>
                <input type="number" defaultValue={profile?.experienceYears} className="w-full mt-1 bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Hourly Rate (USD)</label>
                <input type="number" defaultValue={profile?.hourlyRate} className="w-full mt-1 bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <Button className="btn-liquid">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <Card className="glass-strong">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Add technologies you're proficient with. The AI uses these to match you with jobs.
              </p>
              <div className="flex flex-wrap gap-2">
                {profile?.skills?.map((skill) => (
                  <Badge key={skill} variant="secondary" className="py-2 px-4 text-sm">
                    {skill}
                    <button className="ml-2 hover:text-destructive">×</button>
                  </Badge>
                ))}
              </div>
              <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-dashed border-border">
                <p className="text-sm text-muted-foreground">Skill editor would go here (similar to onboarding wizard).</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="socials" className="mt-6">
          <Card className="glass-strong">
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">GitHub</label>
                <input defaultValue={profile?.githubUrl} placeholder="github.com/yourusername" className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">LinkedIn</label>
                <input defaultValue={profile?.linkedinUrl} placeholder="linkedin.com/in/yourprofile" className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Portfolio</label>
                <input defaultValue={profile?.portfolioUrl} placeholder="yourwebsite.com" className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <Button className="btn-liquid">Save Social Links</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Tab 3: My Applications
function MyApplications() {
  const { data: applications = { applications: [] } } = useMyApplications(1);

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-bold">My Applications</h2>
      {applications.applications?.length === 0 ? (
        <Card className="glass-strong p-12 text-center">
          <FileText className="size-16 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
          <p className="text-muted-foreground mb-6">Start applying to jobs to see your applications here.</p>
          <Button asChild className="btn-liquid">
            <Link to="/jobs">Browse Jobs</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications.applications?.map((app: any) => (
            <Card key={app._id} className="glass-strong p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{app.jobId?.title}</h3>
                  <p className="text-sm text-muted-foreground">{app.jobId?.startupId?.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
                <Badge variant={
                  app.status === "accepted" ? "default" :
                  app.status === "rejected" ? "destructive" :
                  app.status === "shortlisted" ? "secondary" : "outline"
                }>
                  {app.status}
                </Badge>
              </div>
              {app.coverLetter && (
                <p className="text-sm mt-3 p-3 bg-muted/30 rounded-lg">"{app.coverLetter.substring(0, 200)}..."</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Main Developer Dashboard
export default function DeveloperDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <AppShell>
      <div className="space-y-6 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Developer Dashboard</h1>
            <p className="text-muted-foreground">Track your matches, applications, and profile.</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link to="/settings">Settings</Link>
            </Button>
            <Button asChild className="btn-liquid">
              <Link to="/jobs">Find Jobs</Link>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/30 p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Edit Profile</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileEditor />
          </TabsContent>

          <TabsContent value="applications">
            <MyApplications />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
