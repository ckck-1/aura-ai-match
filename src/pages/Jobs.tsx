import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, MapPin, Sparkles, ArrowRight } from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import type { Job } from "@/types/job";
import { jobsApi } from "@/lib/jobs.api";
import { ALL_TECH } from "@/constants/tech";

export default function Jobs() {
  const [q, setQ] = useState("");
  const [tech, setTech] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["jobs", q, tech],
    queryFn: () =>
      jobsApi.list({
        q,
        tech: tech ?? undefined,
      }),
  });

  const jobs = data ?? [];

  return (
    <AppShell>
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
          <Sparkles className="size-3.5 text-liquid" />
          AI-ranked feed · {jobs.length} roles
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Live <span className="text-liquid">opportunities</span>
        </h1>

        <p className="text-muted-foreground max-w-2xl">
          Every role is scored by our matching engine against your stack.
        </p>
      </motion.div>

      {/* SEARCH */}
      <div className="mt-10 glass-strong rounded-2xl p-2 flex items-center gap-2">
        <Search className="size-4 ml-3 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search roles, companies, stacks…"
          className="flex-1 bg-transparent py-3 text-sm focus:outline-none"
        />
      </div>

      {/* TECH FILTER */}
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => setTech(null)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            !tech
              ? "bg-foreground text-background border-foreground"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>

        {ALL_TECH.map((t) => (
          <button
            key={t}
            onClick={() => setTech(t === tech ? null : t)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              tech === t
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="mt-8 grid gap-4">
        {isLoading ? (
          <JobsSkeleton />
        ) : jobs.length === 0 ? (
          <NoJobs />
        ) : (
          jobs.map((job, i) => (
            <JobCard key={job._id} job={job} index={i} />
          ))
        )}
      </div>
    </AppShell>
  );
}

/* =========================
   JOB CARD
========================= */

const JobCard = ({ job, index }: { job: Job; index: number }) => {
  const startup =
    typeof job.startupId === "object" ? job.startupId : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="glass-strong rounded-3xl p-6 md:p-7"
    >
      <div className="flex items-start justify-between gap-6">
        {/* LEFT */}
        <div className="flex items-start gap-4 min-w-0">
          <div className="size-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
            {startup?.logoUrl ?? "🏢"}
          </div>

          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold truncate">
              {job.title}
            </h3>

            <p className="text-sm text-muted-foreground">
              {startup?.companyName ?? "Startup"} ·{" "}
              <span className="capitalize">{job.jobType}</span>
            </p>

            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground flex-wrap">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" />
                {job.location}
              </span>

              <span>•</span>

              <span>
                ${job.salaryRange.min / 1000}k -{" "}
                ${job.salaryRange.max / 1000}k
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="text-right">
          <div className="text-xs uppercase text-muted-foreground">
            Status
          </div>
          <div className="text-sm font-medium capitalize text-liquid">
            {job.status}
          </div>
        </div>
      </div>

      {/* ACTION */}
      <div className="mt-5 flex justify-end">
        <Link
          to={`/jobs/${job._id}/apply`}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full bg-foreground text-background hover:opacity-90"
        >
          Apply <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </motion.article>
  );
};

/* =========================
   LOADING SKELETON
========================= */

const JobsSkeleton = () => {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="glass-strong rounded-3xl p-6 md:p-7 animate-pulse space-y-4"
        >
          <div className="flex justify-between gap-6">
            <div className="flex gap-4 w-full">
              <div className="size-12 rounded-xl bg-muted/40" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-muted/40 rounded" />
                <div className="h-3 w-1/2 bg-muted/40 rounded" />
                <div className="h-3 w-2/3 bg-muted/40 rounded" />
              </div>
            </div>

            <div className="h-5 w-16 bg-muted/40 rounded" />
          </div>
        </div>
      ))}
    </>
  );
};

/* =========================
   EMPTY STATE
========================= */

const NoJobs = () => {
  return (
    <div className="glass-strong rounded-3xl p-12 text-center">
      <div className="text-xl font-display font-semibold">
        No roles found
      </div>

      <p className="text-muted-foreground mt-2 text-sm">
        Try adjusting your search or filters.
      </p>

      <Link to="/jobs" className="btn-liquid mt-6 inline-flex">
        Refresh feed
      </Link>
    </div>
  );
};