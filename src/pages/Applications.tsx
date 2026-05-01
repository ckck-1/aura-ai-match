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
  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: applicationsApi.list,
  });

  return (
    <AppShell>
      <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
        {/* SAME SYSTEM AS JOBS */}
        <div className="absolute inset-0 bg-mesh grain -z-10" />

        {/* SOFT ORBS (like Jobs page vibe) */}
        <div className="absolute -top-40 -left-40 size-[500px] rounded-full bg-primary/15 blur-[140px] animate-pulse-glow" />
        <div className="absolute top-1/3 -right-40 size-[600px] rounded-full bg-accent/10 blur-[160px] animate-pulse-glow" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
              <Sparkles className="size-3.5 text-accent" />
              {apps.length} active applications
            </div>

            <h1 className="font-display text-4xl font-bold tracking-tight">
              Your <span className="text-liquid">pipeline</span>
            </h1>

            <p className="text-muted-foreground max-w-2xl mt-2">
              Track every application in one clean feed.
            </p>
          </motion.div>

          {/* STATS (soft glass, not blue-heavy) */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {STAGES.map((s) => {
              const n = apps.filter((a) => a.status === s).length;

              return (
                <div
                  key={s}
                  className="glass rounded-2xl p-4"
                >
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
          <div className="grid gap-3">
            {isLoading ? (
              <div className="p-10 text-center text-muted-foreground">
                Loading applications...
              </div>
            ) : apps.length === 0 ? (
              <EmptyState />
            ) : (
              apps.map((app, i) => (
                <ApplicationRow key={app._id} app={app} index={i} />
              ))
            )}
          </div>
        </div>
      </main>
    </AppShell>
  );
}

/* ================= ROW ================= */

const statusStyle: Record<Application["status"], string> = {
  pending: "bg-muted/60 text-foreground",
  reviewed: "bg-white/40 text-foreground",
  shortlisted: "bg-white text-foreground",
  accepted: "bg-white/60 text-foreground",
  rejected: "bg-red-500/10 text-red-600",
};

const ApplicationRow = ({
  app,
  index,
}: {
  app: Application;
  index: number;
}) => {
  const chatLink = app.threadId ? `/messages/${app.threadId}` : "/messages";

  const jobTitle =
    typeof app.jobId === "object" ? app.jobId.title : "Position";

  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="glass rounded-2xl px-5 py-4 flex items-center justify-between gap-4 hover:scale-[1.01] transition"
    >
      <div>
        <h3 className="font-semibold text-sm">{jobTitle}</h3>
        <p className="text-xs text-muted-foreground">
          Applied • {new Date(app.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-xs px-3 py-1 rounded-full ${statusStyle[app.status]}`}>
          {app.status}
        </span>

        <Link
          to={chatLink}
          className="btn-liquid !px-4 !py-2 text-xs inline-flex items-center gap-2"
        >
          <MessageSquare className="size-3.5" />
          Message
        </Link>
      </div>
    </motion.article>
  );
};

/* ================= EMPTY ================= */

const EmptyState = () => (
  <div className="glass rounded-3xl p-12 text-center">
    <div className="font-display text-xl font-semibold">
      No applications yet
    </div>

    <p className="text-muted-foreground mt-2 text-sm">
      Start applying to jobs to see everything here.
    </p>

    <Link to="/jobs" className="btn-liquid mt-6 inline-flex">
      Browse roles
    </Link>
  </div>
);
