import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { 
  Briefcase, Users, TrendingUp, Plus, Sparkles, 
  Edit3, Eye, MoreHorizontal, ArrowRight, CheckCircle 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppShell } from "@/components/app/AppShell";
import JobManagement from "@/components/jobs/JobManagement";
import JobCreator from "@/components/jobs/JobCreator";
import CandidatePipeline from "@/components/candidates/CandidatePipeline";
import { api, Job } from "@/lib/mock-api";
import { useStartupProfile, useJobApplicants, useMyJobs } from "@/services/api";
import { toast } from "sonner";

// Dashboard Metrics
function DashboardMetrics({ jobs }: { jobs: Job[] }) {
  const activeJobs = jobs.filter(j => true).length;
  const totalApplicants = jobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0);
  const avgMatch = totalApplicants > 0 
    ? Math.round(jobs.reduce((sum, job) => sum + (job.applications?.reduce((aSum: number, app: any) => aSum + (app.developer?.aiScore || 0), 0) || 0), 0) / totalApplicants)
    : 0;

  const metrics = [
    { label: "Active Jobs", value: activeJobs, icon: Briefcase, color: "from-blue-500/20 to-cyan-500/20", textColor: "text-blue-500" },
    { label: "New Applicants", value: totalApplicants, icon: Users, color: "from-green-500/20 to-emerald-500/20", textColor: "text-green-500" },
    { label: "Avg Match Score", value: `${avgMatch}%`, icon: TrendingUp, color: "from-amber-500/20 to-orange-500/20", textColor: "text-amber-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="glass-strong relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-50`} />
          <CardContent className="relative pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-3xl font-display font-bold mt-1">{metric.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color}`}>
                <metric.icon className={`size-5 ${metric.textColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Job Creator Modal
function JobCreatorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl font-bold">Post a New Job</h2>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
        <JobCreator />
      </div>
    </div>
  );
}

// Quick Actions Panel
function QuickActions() {
  return (
    <Card className="glass-strong border-dashed border-2 border-primary/30">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Ready to hire?</h3>
            <p className="text-sm text-muted-foreground">Post a job and start matching with vetted developers.</p>
          </div>
          <Button className="btn-liquid">Post a Job</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Startup Dashboard
export default function StartupDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showJobCreator, setShowJobCreator] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [viewApplicantsFor, setViewApplicantsFor] = useState<string | null>(null);

  const { data: profile, isLoading: profileLoading } = useStartupProfile();
  const { data: jobs = { jobs: [] }, isLoading: jobsLoading } = useMyJobs();

  const { data: applicants = { applications: [] } } = useJobApplicants(viewApplicantsFor || "");

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setShowJobCreator(true);
  };

  const handleViewApplicants = (jobId: string) => {
    setViewApplicantsFor(jobId);
  };

  return (
    <AppShell>
      <div className="space-y-6 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">
              {profile?.companyName || "Startup"} Dashboard
            </h1>
            <p className="text-muted-foreground">Manage jobs and review candidates.</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link to="/billing">Billing</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/settings">Settings</Link>
            </Button>
            <Button className="btn-liquid" onClick={() => { setEditingJob(null); setShowJobCreator(true); }}>
              <Plus className="size-4 mr-2" />
              Post Job
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/30 p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardMetrics jobs={jobs.jobs || []} />
            <QuickActions />

            {/* Recent Activity */}
            <Card className="glass-strong">
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {jobs.jobs?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="size-12 mx-auto mb-3 opacity-30" />
                    <p>No jobs posted yet. Create your first job to start receiving applications.</p>
                    <Button onClick={() => setShowJobCreator(true)} className="mt-4 btn-liquid">
                      <Plus className="size-4 mr-2" />
                      Post Your First Job
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {jobs.jobs.slice(0, 3).map((job: Job) => (
                      <div key={job._id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30">
                        <div>
                          <h4 className="font-semibold">{job.title}</h4>
                          <p className="text-sm text-muted-foreground">{job.applications?.length || 0} applicants</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleViewApplicants(job._id)}>
                          Review <ArrowRight className="size-3 ml-2" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-bold">Job Management</h2>
              <Button className="btn-liquid" onClick={() => { setEditingJob(null); setShowJobCreator(true); }}>
                <Plus className="size-4 mr-2" />
                Post New Job
              </Button>
            </div>
            <JobManagement
              jobs={jobs.jobs || []}
              onEdit={handleEditJob}
              onArchive={(id) => toast.info("Archive feature would remove job from public feed")}
              onViewApplicants={handleViewApplicants}
            />
          </TabsContent>

          <TabsContent value="candidates">
            {viewApplicantsFor ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-bold">Applicants Pipeline</h2>
                  <Button variant="ghost" onClick={() => setViewApplicantsFor(null)}>
                    ← Back to jobs
                  </Button>
                </div>
                <CandidatePipeline
                  candidates={applicants.applications?.map((app: any) => ({
                    id: app._id,
                    developer: app.developerId,
                    jobId: app.jobId,
                    status: app.status,
                    appliedAt: new Date(app.createdAt).toLocaleDateString(),
                  })) || []}
                  onViewProfile={(candidate) => toast.info("Open candidate profile modal")}
                />
              </div>
            ) : (
              <div className="text-center py-20">
                <Briefcase className="size-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                <h3 className="text-lg font-semibold mb-2">Select a job to view candidates</h3>
                <p className="text-muted-foreground">Choose a job from the "My Jobs" tab to see its applicant pipeline.</p>
                <Button onClick={() => setActiveTab("jobs")} className="mt-4" variant="outline">
                  Go to Jobs
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Job Creator Modal */}
      {showJobCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-bold">
                {editingJob ? "Edit Job" : "Post a New Job"}
              </h2>
              <Button variant="ghost" onClick={() => setShowJobCreator(false)}>Close</Button>
            </div>
            <JobCreator />
          </div>
        </div>
      )}
    </AppShell>
  );
}
