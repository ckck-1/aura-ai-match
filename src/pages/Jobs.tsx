import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { api, ALL_TECH, Job } from "@/lib/mock-api";

export default function Jobs() {
  const [q, setQ] = useState("");
  const [tech, setTech] = useState<string | null>(null);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs", q, tech],
    queryFn: () => api.listJobs({ q, tech: tech ?? undefined }),
  });

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
          <Sparkles className="size-3.5 text-liquid" />
          AI-ranked feed · {jobs.length} roles
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Live <span className="text-liquid">opportunities</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Every role is scored by our Mistral matching engine against your stack, seniority, and trajectory.
        </p>
      </motion.div>

      <div className="mt-10 glass-strong rounded-2xl p-2 flex items-center gap-2">
        <Search className="size-4 ml-3 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search roles, companies, stacks…"
          className="flex-1 bg-transparent py-3 text-sm focus:outline-none"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => setTech(null)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            !tech ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        {ALL_TECH.map((t) => (
          <button
            key={t}
            onClick={() => setTech(t === tech ? null : t)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              tech === t ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-44 rounded-3xl glass animate-pulse" />)
          : jobs.map((job, i) => <JobCard key={job._id} job={job} index={i} />)}
      </div>
    </AppShell>
  );
}

const JobCard = ({ job, index }: { job: Job; index: number }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -4 }}
    className="glass-strong rounded-3xl p-6 md:p-7 relative overflow-hidden group cursor-pointer"
  >
    <div className="absolute top-0 right-0 size-48 rounded-full bg-[var(--gradient-liquid)] opacity-0 group-hover:opacity-10 blur-3xl transition-opacity" />
    <div className="flex items-start justify-between gap-6">
      <div className="flex items-start gap-4 min-w-0">
        <div className="size-12 rounded-xl bg-[var(--gradient-liquid)] flex items-center justify-center font-display font-bold text-primary-foreground shrink-0">
          {job.startup.logo}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold truncate">{job.title}</h3>
          <p className="text-sm text-muted-foreground">
            {job.startup.name} · <span className="text-muted-foreground/70">{job.startup.stage}</span>
          </p>
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{job.location}</span>
            <span>·</span>
            <span className="capitalize">{job.type}</span>
            <span>·</span>
            <span>${(job.salaryRange.min / 1000).toFixed(0)}–${(job.salaryRange.max / 1000).toFixed(0)}k</span>
            <span>·</span>
            <span>{job.postedAt}</span>
          </div>
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Match</div>
        <div className="font-display text-2xl font-bold text-liquid">{job.matchScore}</div>
      </div>
    </div>
    <div className="mt-5 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex flex-wrap gap-1.5">
        {job.techStack.map((t) => (
          <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-muted/50 border border-border text-muted-foreground">
            {t}
          </span>
        ))}
      </div>
      <Link
        to={`/jobs/${job._id}/apply`}
        className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full bg-foreground text-background hover:opacity-90 transition-opacity"
      >
        Apply <ArrowRight className="size-3.5" />
      </Link>
    </div>
  </motion.article>
);
