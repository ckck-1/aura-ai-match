import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Sparkles, ArrowRight, Loader2 } from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import type { Job } from "@/types/job";
import { jobsApi } from "@/lib/jobs.api";
import { ALL_TECH } from "@/constants/tech";
import { toast } from "react-hot-toast";

export default function Jobs() {
  const [q, setQ] = useState("");
  const [tech, setTech] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["jobs", q, tech],
    queryFn: () => jobsApi.list({ q, tech: tech ?? undefined }),
  });

  const jobs = data ?? [];

  return (
    <AppShell>
      <header className="mb-10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
          <Sparkles className="size-3.5 text-liquid" />
          Live Feed · {jobs.length} roles
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight">
          Find your next <span className="text-liquid">mission</span>
        </h1>
      </header>

      <div className="glass-strong rounded-2xl p-2 flex items-center gap-2 border border-white/5 mb-6">
        <Search className="size-4 ml-3 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search stacks or roles..."
          className="flex-1 bg-transparent py-3 text-sm focus:outline-none"
        />
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="p-12 text-center opacity-50">Loading real-time feed...</div>
        ) : (
          jobs.map((job, i) => <JobCard key={job._id} job={job} index={i} />)
        )}
      </div>
    </AppShell>
  );
}

// Inside JobCard in Jobs.tsx
const JobCard = ({ job, index }: { job: Job; index: number }) => {
  const navigate = useNavigate();
  const startup = typeof job.startupId === "object" ? job.startupId : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-strong rounded-3xl p-6 border border-white/5 flex items-center justify-between gap-4"
    >
      <div className="flex gap-4 items-center">
        <div className="size-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-liquid">
          {startup?.companyName?.charAt(0) || "D"}
        </div>
        <div>
          <h3 className="font-semibold">{job.title}</h3>
          <p className="text-sm text-muted-foreground">{startup?.companyName} • {job.location}</p>
        </div>
      </div>
      
      {/* Updated: Navigates to the apply page using the job's _id */}
      <button
        onClick={() => navigate(`/jobs/${job._id}/apply`)}
        className="bg-foreground text-background px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 hover:scale-105 transition-transform"
      >
        Apply Now
        <ArrowRight className="size-3" />
      </button>
    </motion.article>
  );
};