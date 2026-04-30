import { motion } from "framer-motion";
import { FloatingCards } from "./FloatingCards";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-mesh grain">
      {/* ambient orbs */}
      <div className="absolute -top-40 -left-40 size-[500px] rounded-full bg-primary/20 blur-[140px] animate-pulse-glow" />
      <div className="absolute top-1/3 -right-40 size-[600px] rounded-full bg-accent/15 blur-[160px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="container relative z-10 grid lg:grid-cols-[1.1fr_1fr] gap-16 items-center pt-32 pb-20">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 text-xs text-muted-foreground mb-8"
          >
            <span className="size-1.5 rounded-full bg-accent animate-pulse" />
            DevDrop AI matching engine — live
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight text-balance"
          >
            Where elite <span className="text-liquid">engineers</span> meet ambitious <span className="text-liquid">startups</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-7 text-lg text-muted-foreground max-w-xl text-pretty leading-relaxed"
          >
            A quiet, AI-curated marketplace. No noise, no spam — just precise matches between rare talent and serious teams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <button className="btn-liquid">
              Find your next role
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
            <button className="btn-ghost-liquid">Hire developers</button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-14 grid grid-cols-3 gap-6 max-w-md"
          >
            {[
              { k: "12.4k", v: "verified devs" },
              { k: "97%", v: "match accuracy" },
              { k: "<48h", v: "to first interview" },
            ].map((s) => (
              <div key={s.v}>
                <div className="font-display text-2xl font-bold text-liquid">{s.k}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <FloatingCards />
      </div>
    </section>
  );
};
