import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Sparkles, MessageSquare } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { appsApi, type Application } from "@/lib/mock-api";

const STAGES: Application["status"][] = ["submitted", "in-review", "interview", "offer", "rejected"];
const STAGE_LABEL: Record<Application["status"], string> = {
  submitted: "Submitted",
  "in-review": "In review",
  interview: "Interview",
  offer: "Offer",
  rejected: "Closed",
};

export default function Applications() {
  const { data: apps = [], isLoading } = useQuery({ queryKey: ["apps"], queryFn: () => appsApi.list() });

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
          <Sparkles className="size-3.5 text-liquid" /> {apps.length} active
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Your <span className="text-liquid">applications</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Live pipeline across every role you've engaged with. Status syncs in real-time.
        </p>
      </motion.div>

      {/* Pipeline summary */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-3">
        {STAGES.map((s) => {
          const n = apps.filter((a) => a.status === s).length;
          return (
            <div key={s} className="glass rounded-2xl p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{STAGE_LABEL[s]}</div>
              <div className="font-display text-2xl font-bold mt-1">{n}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 rounded-3xl glass animate-pulse" />)
          : apps.length === 0
            ? <EmptyState />
            : apps.map((app, i) => <ApplicationRow key={app._id} app={app} index={i} />)}
      </div>
    </AppShell>
  );
}

const statusStyle: Record<Application["status"], string> = {
  submitted: "bg-muted/60 text-foreground",
  "in-review": "bg-accent/15 text-accent",
  interview: "bg-[var(--gradient-liquid)] text-primary-foreground",
  offer: "bg-primary/20 text-primary",
  rejected: "bg-destructive/15 text-destructive",
};

const ApplicationRow = ({ app, index }: { app: Application; index: number }) => (
  <motion.article
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -3 }}
    className="glass-strong rounded-3xl p-6 flex flex-col md:flex-row md:items-center gap-5"
  >
    <div className="size-12 rounded-xl bg-[var(--gradient-liquid)] flex items-center justify-center font-display font-bold text-primary-foreground shrink-0">
      {app.companyLogo}
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-display text-lg font-semibold truncate">{app.jobTitle}</h3>
      <p className="text-sm text-muted-foreground">
        {app.company} · applied {app.appliedAt}
      </p>
    </div>
    <div className="flex items-center gap-3 shrink-0">
      <div className="text-right">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Match</div>
        <div className="font-display text-lg font-bold text-liquid">{app.matchScore}</div>
      </div>
      <span className={`text-[11px] px-3 py-1.5 rounded-full font-medium ${statusStyle[app.status]}`}>
        {STAGE_LABEL[app.status]}
      </span>
      <Link
        to="/messages/th_1"
        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border hover:border-foreground/40 transition-colors"
      >
        <MessageSquare className="size-3.5" /> Message
      </Link>
    </div>
  </motion.article>
);

const EmptyState = () => (
  <div className="glass-strong rounded-3xl p-12 text-center">
    <div className="font-display text-xl font-semibold">No applications yet</div>
    <p className="text-muted-foreground mt-2 text-sm">Start with the AI-ranked feed.</p>
    <Link to="/jobs" className="btn-liquid mt-6 inline-flex">Browse roles</Link>
  </div>
);
