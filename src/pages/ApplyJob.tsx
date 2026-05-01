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

  const { data: job, isLoading } = useQuery<Job>({
    queryKey: ["job", id],
    queryFn: () => jobsApi.getById(id!),
    enabled: !!id,
  });

  const applyMutation = useMutation({
    mutationFn: () => {
      if (!job?._id) throw new Error("Job ID missing");

      return jobsApi.submitApplication({
        jobId: job._id,
        coverLetter: cover,
        resumeSnapshot: "Current Profile Snapshot",
      });
    },

    onSuccess: () => {
      toast.success("Application sent!", {
        description: "The startup team has been notified.",
      });
      navigate("/applications");
    },

    onError: (err: any) => {
      console.error("🔥 FULL ERROR:", err.response?.data);

      toast.error(
        err.response?.data?.message ||
          JSON.stringify(err.response?.data) ||
          err.message ||
          "Submission failed"
      );
    },
  });

  const startup =
    job && typeof job.startupId === "object" ? job.startupId : null;

  const handleAIDraft = () => {
    if (!job) return;
    const company = startup?.companyName || "the team";

    setCover(
      `Hi ${company} team,\n\nI'm writing to express my interest in the ${job.title} role. Having worked extensively with ${job.techStack
        .slice(0, 3)
        .join(", ")}, I am confident I can contribute immediately.\n\nLooking forward to hearing from you!\n\nBest regards.`
    );
  };

  if (isLoading)
    return (
      <AppShell>
        <div className="p-10 text-center text-muted-foreground animate-pulse">
          Loading...
        </div>
      </AppShell>
    );

  if (!job || !job.salaryRange) {
    return (
      <AppShell>
        <div className="p-10 text-center">
          <h2 className="text-xl font-bold">Unable to load job details</h2>
          <p className="text-muted-foreground">
            Please check your connection or login again.
          </p>
          <Link to="/jobs" className="text-liquid mt-4 inline-block">
            Back to Feed
          </Link>
        </div>
      </AppShell>
    );
  }

  if (!job) return <AppShell>Job not found.</AppShell>;

  return (
    <AppShell>
      <div className="relative min-h-screen bg-mesh grain">
        {/* soft navy/white orbs (hero-style, NOT heavy) */}
        <div className="absolute -top-40 -left-40 size-[420px] rounded-full bg-[#0a1a3f]/10 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 size-[520px] rounded-full bg-white/20 blur-[160px]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="size-4" /> Back to feed
          </Link>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* MAIN CARD */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 glass-strong rounded-3xl p-6 sm:p-8 relative overflow-hidden"
            >
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
                <Sparkles className="size-3.5 text-[#0a1a3f]" />
                Apply for Mission
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight break-words">
                {job.title}
              </h1>

              <p className="text-muted-foreground mt-2 text-sm break-words">
                {startup?.companyName} •{" "}
                <span className="capitalize">{job.jobType}</span>
              </p>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {job.location}
                </span>

                <span>
                  ${job?.salaryRange?.min?.toLocaleString()} - $
                  {job?.salaryRange?.max?.toLocaleString()}
                </span>
              </div>

              {/* TEXTAREA */}
              <div className="mt-8">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <label className="text-sm font-medium">
                    Why are you a good fit?
                  </label>

                  <button
                    onClick={handleAIDraft}
                    className="text-xs flex items-center gap-1.5 text-[#0a1a3f] hover:opacity-80 transition"
                  >
                    <Wand2 className="size-3.5" />
                    Draft with AI
                  </button>
                </div>

                <textarea
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                  className="
                    w-full
                    bg-white/70
                    border border-white/40
                    rounded-2xl
                    p-4 sm:p-5
                    text-sm
                    min-h-[200px] sm:min-h-[250px]
                    focus:outline-none
                    focus:border-[#0a1a3f]/30
                    transition
                    resize-none
                    backdrop-blur-md
                    break-words
                  "
                  placeholder="Share your experience with this tech stack..."
                />

                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">
                    Your profile and resume are auto-included.
                  </p>

                  <button
                    disabled={!cover.trim() || applyMutation.isPending}
                    onClick={() => applyMutation.mutate()}
                    className="btn-liquid !px-8 sm:!px-10 w-full sm:w-auto disabled:opacity-50"
                  >
                    {applyMutation.isPending ? (
                      <Loader2 className="animate-spin size-4" />
                    ) : (
                      <Send className="size-4" />
                    )}
                    {applyMutation.isPending
                      ? "Submitting..."
                      : "Submit Application"}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* SIDEBAR */}
            <aside className="space-y-6">
              <div className="glass-strong rounded-3xl p-6">
                <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                  Required Stack
                </h4>

                <div className="flex flex-wrap gap-2">
                  {job.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="
                        px-3 py-1
                        bg-white/40
                        border border-white/30
                        rounded-full
                        text-xs
                        break-words
                      "
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </AppShell>
  );
}