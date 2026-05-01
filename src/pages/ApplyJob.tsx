import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Sparkles, Send, Wand2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/AppShell";
import { jobsApi } from "@/lib/jobs.api";
import type { Job } from "@/types/job";

export default function ApplyJob() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cover, setCover] = useState("");

  // 1. Fetch Job with proper typing
  const { data: job, isLoading } = useQuery<Job>({
    queryKey: ["job", id],
    queryFn: () => jobsApi.getById(id!),
    enabled: !!id,
  });

  // 2. Application Mutation hitting your POST /api/v1/applications
  const applyMutation = useMutation({
    mutationFn: () =>
      jobsApi.submitApplication({
        jobId: id!,
        coverLetter: cover,
        resumeSnapshot: "Current Profile Snapshot", // Pass user's current resume state here
      }),
    onSuccess: () => {
      toast.success("Application sent!", {
        description: "The startup team has been notified.",
      });
      navigate("/applications");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Submission failed");
    },
  });

  // Helper to handle the startupId union type safely
  const startup = job && typeof job.startupId === "object" ? job.startupId : null;

  const handleAIDraft = () => {
    if (!job) return;
    const company = startup?.companyName || "the team";
    setCover(
      `Hi ${company} team,\n\nI'm writing to express my interest in the ${job.title} role. Having worked extensively with ${job.techStack.slice(0, 3).join(", ")}, I am confident I can contribute to your mission immediately.\n\nLooking forward to hearing from you!\n\nBest regards.`
    );
  };

 // Inside ApplyJob.tsx
if (isLoading) return <AppShell><div className="animate-pulse">Loading...</div></AppShell>;

// Add this guard to catch failed fetches
if (!job || !job.salaryRange) {
  return (
    <AppShell>
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">Unable to load job details</h2>
        <p className="text-muted-foreground">Please check your connection or login again.</p>
        <Link to="/jobs" className="text-liquid mt-4 inline-block">Back to Feed</Link>
      </div>
    </AppShell>
  );
}

  if (!job) return <AppShell>Job not found.</AppShell>;

  return (
    <AppShell>
      <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="size-4" /> Back to feed
      </Link>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 glass-strong rounded-3xl p-8 relative overflow-hidden"
        >
          {/* Header Section */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
              <Sparkles className="size-3.5 text-liquid" /> Apply for Mission
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight">{job.title}</h1>
            <p className="text-muted-foreground mt-2">
              {startup?.companyName} • <span className="capitalize">{job.jobType}</span>
            </p>

            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin className="size-4" />{job.location}</span>
             <span>
  ${job?.salaryRange?.min?.toLocaleString()} - ${job?.salaryRange?.max?.toLocaleString()}
</span>
            </div>

            {/* Input Section */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Why are you a good fit?</label>
                <button 
                  onClick={handleAIDraft}
                  className="text-xs flex items-center gap-1.5 text-liquid hover:brightness-125 transition-all"
                >
                  <Wand2 className="size-3.5" /> Draft with AI
                </button>
              </div>
              <textarea
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-2xl p-5 text-sm min-h-[250px] focus:outline-none focus:border-white/20 transition-colors resize-none"
                placeholder="Share your experience with this tech stack..."
              />
              
              <div className="mt-6 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Your profile and resume are auto-included.</p>
                <button
                  disabled={!cover.trim() || applyMutation.isPending}
                  onClick={() => applyMutation.mutate()}
                  className="btn-liquid !px-10 disabled:opacity-50"
                >
                  {applyMutation.isPending ? <Loader2 className="animate-spin size-4" /> : <Send className="size-4" />}
                  {applyMutation.isPending ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="glass-strong rounded-3xl p-6">
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Required Stack</h4>
            <div className="flex flex-wrap gap-2">
              {job.techStack.map(tech => (
                <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}