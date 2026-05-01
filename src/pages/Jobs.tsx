import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, ArrowRight } from "lucide-react";

import { Nav } from "@/components/landing/Nav";
import type { Job } from "@/types/job";
import { jobsApi } from "@/lib/jobs.api";

export default function Jobs() {
  const [q, setQ] = useState("");
  const [tech] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["jobs", q, tech],
    queryFn: () => jobsApi.list({ q, tech: tech ?? undefined }),
  });

  const jobs = data ?? [];

  return (
    <main className="relative min-h-screen overflow-hidden text-foreground bg-background">

      {/* NAV */}
      <Nav />

      {/* SAME BASE SYSTEM AS HERO */}
      <div className="absolute inset-0 bg-mesh grain -z-10" />

      {/* SOFT AMBIENT ORBS (matching Hero exactly) */}
      <div className="absolute -top-40 -left-40 size-[500px] rounded-full bg-primary/15 blur-[140px] animate-pulse-glow" />
      <div
        className="absolute top-1/3 -right-40 size-[600px] rounded-full bg-accent/10 blur-[160px] animate-pulse-glow"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative z-10 px-6 pt-32 pb-24">
        <div className="mx-auto max-w-6xl">

          <header className="mb-10">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
              <Sparkles className="size-3.5 text-accent" />
              Live Feed · {jobs.length} roles
            </div>

            <h1 className="font-display text-4xl font-bold tracking-tight">
              Find your next <span className="text-liquid">mission</span>
            </h1>
          </header>

          {/* SEARCH (glass like Hero badge style) */}
          <div className="glass rounded-full px-4 py-2 flex items-center gap-2 mb-6">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search stacks or roles..."
              className="flex-1 bg-transparent py-2 text-sm focus:outline-none"
            />
          </div>

          {/* JOBS */}
          <div className="grid gap-3">
            {isLoading ? (
              <div className="p-10 text-center text-muted-foreground">
                Loading real-time feed...
              </div>
            ) : (
              jobs.map((job, i) => (
                <JobCard key={job._id} job={job} index={i} />
              ))
            )}
          </div>

        </div>
      </div>
    </main>
  );
}

/* ---------------- CARD ---------------- */

const JobCard = ({ job, index }: { job: Job; index: number }) => {
  const navigate = useNavigate();
  const startup =
    typeof job.startupId === "object" ? job.startupId : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="
        glass
        rounded-2xl
        px-5 py-4
        flex items-center justify-between gap-4
        hover:scale-[1.01]
        transition-all
      "
    >
      <div className="flex gap-4 items-center">
        <div className="size-11 rounded-xl bg-primary/90 text-white flex items-center justify-center text-sm font-semibold">
          {startup?.companyName?.charAt(0) || "D"}
        </div>

        <div>
          <h3 className="font-semibold text-sm">{job.title}</h3>
          <p className="text-xs text-muted-foreground">
            {startup?.companyName} • {job.location}
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate(`/jobs/${job._id}/apply`)}
        className="btn-liquid !px-5 !py-2 text-xs"
      >
        Apply
        <ArrowRight className="size-3" />
      </button>
    </motion.article>
  );
};