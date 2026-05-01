import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase, Users, TrendingUp, Plus, Sparkles,
  ArrowRight
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppShell } from "@/components/app/AppShell";

import JobManagement from "@/components/jobs/JobManagement";
import JobCreator from "@/components/jobs/JobCreator";
import CandidatePipeline from "@/components/candidates/CandidatePipeline";

import { useStartupProfile, useJobApplicants, useMyJobs } from "@/services/api";
import { toast } from "sonner";

/* ================= METRICS ================= */

function DashboardMetrics({ jobs }: { jobs: any[] }) {
  const activeJobs = jobs.length;
  const totalApplicants = jobs.reduce(
    (sum, job) => sum + (job.applications?.length || 0),
    0
  );

  const avgMatch =
    totalApplicants > 0
      ? Math.round(
          jobs.reduce((sum, job) => {
            const jobApps = job.applications || [];
            const appSum = jobApps.reduce(
              (aSum: number, app: any) => aSum + (app.developerId?.aiScore || 0),
              0
            );
            return sum + appSum;
          }, 0) / totalApplicants
        )
      : 0;

  const metrics = [
    {
      label: "Active Jobs",
      value: activeJobs,
      icon: Briefcase,
    },
    {
      label: "Applicants",
      value: totalApplicants,
      icon: Users,
    },
    {
      label: "Match Score",
      value: `${avgMatch}%`,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((m) => (
        <Card key={m.label} className="glass-strong relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-[#eaf0ff]/40 to-[#0a1a3f]/10" />
          <CardContent className="relative pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="text-3xl font-display font-bold mt-1 text-[#0a1a3f]">
                  {m.value}
                </p>
              </div>
              <m.icon className="size-5 text-[#0a1a3f]/80" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ================= QUICK ACTION ================= */

function QuickActions({ onCreateJob }: { onCreateJob: () => void }) {
  return (
    <Card className="glass-strong border border-white/10">
      <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">Ready to hire?</h3>
          <p className="text-sm text-muted-foreground">
            Post a job and start matching with vetted developers.
          </p>
        </div>

        <Button className="btn-liquid w-full sm:w-auto" onClick={onCreateJob}>
          <Plus className="size-4 mr-2" />
          Post Job
        </Button>
      </CardContent>
    </Card>
  );
}

/* ================= MAIN ================= */

export default function StartupDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showJobCreator, setShowJobCreator] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [viewApplicantsFor, setViewApplicantsFor] = useState<string | null>(null);

  const { data: profile } = useStartupProfile();
  const { data: jobs = { jobs: [] } } = useMyJobs();
  const { data: applicants = { applications: [] } } =
    useJobApplicants(viewApplicantsFor || "");

  const handleEditJob = (job: any) => {
    setEditingJob(job);
    setShowJobCreator(true);
  };

  const handleViewApplicants = (jobId: string) => {
    setViewApplicantsFor(jobId);
  };

  return (
    <AppShell>
      {/* BACKDROP (clean + subtle like hero) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-[#eef3ff] to-[#0a1a3f]" />
      <div className="absolute -top-40 -left-40 size-[520px] rounded-full bg-[#0a1a3f]/20 blur-[140px]" />
      <div className="absolute top-1/3 -right-40 size-[600px] rounded-full bg-white/40 blur-[160px]" />

      <div className="relative z-10 space-y-6 pt-6 px-4 sm:px-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0a1a3f]">
              {profile?.companyName || "Startup"} Dashboard
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage jobs and review candidates.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to="/billing">Billing</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/settings">Settings</Link>
            </Button>
            <Button
  className="btn-liquid w-full sm:w-auto"
  onClick={() => setShowJobCreator(true)}
>
  <Plus className="size-4 mr-2" />
  Post Job
</Button>
          </div>
        </div>

        {/* TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

          <TabsList className="bg-white/40 backdrop-blur-md border border-white/20 w-full sm:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            <DashboardMetrics jobs={jobs.jobs || []} />
            <QuickActions onCreateJob={() => setShowJobCreator(true)} />

            <Card className="glass-strong">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {(jobs.jobs || []).length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    No jobs yet — post your first one.
                  </div>
                ) : (
                  jobs.jobs.slice(0, 3).map((job: any) => (
                    <div
                      key={job._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-white/10 hover:bg-white/20"
                    >
                      <div>
                        <h4 className="font-semibold">{job.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {job.applications?.length || 0} applicants
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewApplicants(job._id)}
                      >
                        Review <ArrowRight className="size-3 ml-2" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* JOBS */}
          <TabsContent value="jobs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl sm:text-2xl font-bold">
                Job Management
              </h2>

              <Button className="btn-liquid" onClick={() => setShowJobCreator(true)}>
                <Plus className="size-4 mr-2" />
                Post
              </Button>
            </div>

            <JobManagement
              jobs={jobs.jobs || []}
              onEdit={handleEditJob}
              onArchive={(id) => toast.info("Archived")}
              onViewApplicants={handleViewApplicants}
            />
          </TabsContent>

          {/* CANDIDATES */}
          <TabsContent value="candidates">
            {viewApplicantsFor ? (
              <CandidatePipeline
                candidates={
                  applicants.applications?.map((app: any) => ({
                    id: app._id,
                    developer: app.developerId,
                    jobId: app.jobId,
                    status: app.status,
                    appliedAt: new Date(app.createdAt).toLocaleDateString(),
                  })) || []
                }
                onViewProfile={() => toast.info("Profile")}
              />
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                Select a job first.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* MODAL */}
      {showJobCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl glass-strong rounded-3xl p-4 sm:p-6">
            <JobCreator />
          </div>
        </div>
      )}
    </AppShell>
  );
}