import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, Briefcase, Sparkles, MessageSquare } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { api } from "@/lib/mock-api";

export default function DeveloperProfile() {
  const { id = "dev_1" } = useParams();
  const { data: dev } = useQuery({ queryKey: ["dev", id], queryFn: () => api.getDeveloper(id) });

  if (!dev)
    return (
      <AppShell>
        <div className="h-96 rounded-3xl glass animate-pulse" />
      </AppShell>
    );

  return (
    <AppShell>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-strong rounded-3xl p-8 md:p-10 relative overflow-hidden"
      >
        <div className="absolute -top-40 -right-20 size-96 rounded-full bg-[var(--gradient-liquid)] opacity-15 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="size-24 rounded-2xl bg-[var(--gradient-liquid)] flex items-center justify-center font-display text-3xl font-bold text-primary-foreground shadow-[var(--shadow-glow)] shrink-0">
            {dev.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-2">
              <Sparkles className="size-3.5 text-liquid" /> AI Match · {dev.matchScore}%
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">{dev.name}</h1>
            <p className="text-muted-foreground mt-1">{dev.headline}</p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" />{dev.location}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5" />~{dev.stats.responseHrs}h reply</span>
              <span className="inline-flex items-center gap-1.5"><Star className="size-3.5 fill-current" />{dev.stats.rating} · {dev.stats.projects} projects</span>
              <span className="inline-flex items-center gap-1.5"><Briefcase className="size-3.5" />${dev.hourlyRate}/hr</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <Link to="/messages/th_2" className="btn-liquid !px-6">
              <MessageSquare className="size-4" /> Message
            </Link>
            <button className="btn-ghost-liquid !px-6">Hire {dev.name.split(" ")[0]}</button>
          </div>
        </div>
      </motion.section>

      <div className="grid md:grid-cols-3 gap-5 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="md:col-span-2 glass-strong rounded-3xl p-7"
        >
          <h2 className="font-display text-lg font-semibold mb-4">About</h2>
          <p className="text-muted-foreground leading-relaxed">{dev.bio}</p>

          <h2 className="font-display text-lg font-semibold mt-8 mb-4">Experience</h2>
          <div className="space-y-5">
            {dev.experience.map((e, i) => (
              <div key={i} className="border-l border-border pl-5 relative">
                <div className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-[var(--gradient-liquid)]" />
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-medium">{e.role}</h3>
                  <span className="text-xs text-muted-foreground shrink-0">{e.period}</span>
                </div>
                <p className="text-sm text-muted-foreground/80">{e.company}</p>
                <p className="text-sm text-muted-foreground mt-2">{e.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass-strong rounded-3xl p-7"
        >
          <h2 className="font-display text-lg font-semibold mb-4">Skill graph</h2>
          <div className="space-y-3">
            {dev.skills.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span>{s.name}</span>
                  <span className="text-muted-foreground">{s.level}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.level}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-[var(--gradient-liquid)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-5">
        {dev.reviews.map((r, i) => (
          <motion.blockquote
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.5 }}
            className="glass rounded-3xl p-6"
          >
            <div className="flex gap-0.5 mb-3 text-foreground">
              {Array.from({ length: r.rating }).map((_, j) => (
                <Star key={j} className="size-3.5 fill-current" />
              ))}
            </div>
            <p className="text-sm leading-relaxed">"{r.quote}"</p>
            <footer className="mt-4 text-xs text-muted-foreground">
              {r.author} · {r.company}
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </AppShell>
  );
}
