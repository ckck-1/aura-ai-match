import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Sparkles, MessageSquare } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { applicationsApi } from "@/lib/applications.api";
import type { Application } from "@/types/application";

const STAGES: Application["status"][] = [
  "pending",
  "reviewed",
  "shortlisted",
  "rejected",
  "accepted",
];

const STAGE_LABEL: Record<Application["status"], string> = {
  pending: "Pending",
  reviewed: "Reviewed",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  accepted: "Accepted",
};


export default function Applications() {
  const {
    data: apps = [],
    isLoading,
  } = useQuery({
    queryKey: ["applications"],
    queryFn: applicationsApi.list,
  });

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
          <Sparkles className="size-3.5 text-liquid" /> {apps.length} active
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Your <span className="text-liquid">applications</span>
        </h1>

        <p className="text-muted-foreground max-w-2xl">
          Live pipeline across every role you've engaged with.
        </p>
      </motion.div>

      {/* PIPELINE */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
        {STAGES.map((s) => {
          const n = apps.filter((a) => a.status === s).length;

          return (
            <div key={s} className="glass rounded-2xl p-4">
              <div className="text-xs uppercase text-muted-foreground">
                {STAGE_LABEL[s]}
              </div>
              <div className="font-display text-2xl font-bold mt-1">
                {n}
              </div>
            </div>
          );
        })}
      </div>

      {/* LIST */}
      <div className="mt-8 grid gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-3xl glass animate-pulse"
            />
          ))
        ) : apps.length === 0 ? (
          <EmptyState />
        ) : (
          apps.map((app, i) => (
            <ApplicationRow key={app._id} app={app} index={i} />
          ))
        )}
      </div>
    </AppShell>
  );
}

/* ========================= */

const statusStyle: Record<Application["status"], string> = {
  pending: "bg-muted/60 text-foreground",
  reviewed: "bg-accent/15 text-accent",
  shortlisted: "bg-[var(--gradient-liquid)] text-white",
  accepted: "bg-primary/20 text-primary",
  rejected: "bg-destructive/15 text-destructive",
};

const ApplicationRow = ({ app, index }: { app: Application; index: number }) => {
  // Use the threadId for the link, fallback to messages dashboard if missing
  const chatLink = app.threadId ? `/messages/${app.threadId}` : "/messages";

  const jobTitle = typeof app.jobId === "object" ? app.jobId.title : "Position";
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-strong rounded-3xl p-6 flex flex-col md:flex-row md:items-center gap-5 border border-white/5"
    >
      <div className="flex-1">
        <h3 className="font-display text-lg font-semibold">{jobTitle}</h3>
        <p className="text-sm text-muted-foreground">
          Applied • {new Date(app.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${statusStyle[app.status]}`}>
          {app.status}
        </span>

        <Link
          to={chatLink}
          className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all"
        >
          <MessageSquare className="size-3.5 text-liquid" />
          Message
        </Link>
      </div>
    </motion.article>
  );
};
const EmptyState = () => (
  <div className="glass-strong rounded-3xl p-12 text-center">
    <div className="font-display text-xl font-semibold">
      No applications yet
    </div>

    <p className="text-muted-foreground mt-2 text-sm">
      Start applying to jobs to see them here.
    </p>

    <Link to="/jobs" className="btn-liquid mt-6 inline-flex">
      Browse roles
    </Link>
  </div>
);