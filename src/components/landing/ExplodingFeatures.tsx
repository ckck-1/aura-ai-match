import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Feature = {
  id: string;
  title: string;
  tagline: string;
  fragments: { label: string; detail: string }[];
};

const features: Feature[] = [
  {
    id: "ai",
    title: "AI Matching",
    tagline: "Mistral-powered semantic scoring",
    fragments: [
      { label: "Skill embeddings", detail: "Vectorized stack profiles" },
      { label: "Cultural fit", detail: "Tone & values analysis" },
      { label: "Compensation", detail: "Range-aligned shortlists" },
      { label: "Availability", detail: "Real-time signals" },
      { label: "Project history", detail: "Outcome-based weighting" },
    ],
  },
  {
    id: "pay",
    title: "Instant Payments",
    tagline: "Stripe + escrow, zero friction",
    fragments: [
      { label: "Milestone escrow", detail: "Released on approval" },
      { label: "37 currencies", detail: "Local rails everywhere" },
      { label: "Tax handling", detail: "Auto W-8 / W-9 / DAC7" },
      { label: "1.4% take rate", detail: "Flat, transparent" },
    ],
  },
  {
    id: "feed",
    title: "Realtime Feed",
    tagline: "Redis-backed, sub-50ms",
    fragments: [
      { label: "BullMQ workers", detail: "Async job processing" },
      { label: "Cache-first", detail: "Edge-warmed queries" },
      { label: "Live updates", detail: "WebSocket invalidation" },
      { label: "Smart filters", detail: "Saved & shareable" },
    ],
  },
];

export const ExplodingFeatures = () => {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="features" className="relative py-32 overflow-hidden">
      <div className="container">
        <div className="max-w-2xl mb-20">
          <div className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-4">// Core systems</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight">
            Built like <span className="text-liquid">infrastructure</span>.<br />
            Felt like magic.
          </h2>
          <p className="mt-5 text-muted-foreground text-lg">
            Click any node to expand. Each system is a microservice — independently scaled, individually polished.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const isActive = active === f.id;
            return (
              <motion.button
                key={f.id}
                layout
                onClick={() => setActive(isActive ? null : f.id)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative text-left glass-strong rounded-3xl p-7 overflow-hidden transition-shadow ${isActive ? 'shadow-[var(--shadow-glow)]' : 'hover:shadow-[var(--shadow-elegant)]'}`}
                style={{ minHeight: isActive ? 460 : 280 }}
              >
                {/* Core node */}
                <motion.div layout="position" className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground tracking-wider uppercase">{f.id === 'ai' ? '01' : f.id === 'pay' ? '02' : '03'}</div>
                    <h3 className="font-display text-2xl font-bold mt-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1.5">{f.tagline}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: isActive ? 45 : 0, scale: isActive ? 1.1 : 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className="size-10 rounded-full bg-[var(--gradient-liquid)] shadow-[var(--shadow-glow)] flex items-center justify-center text-primary-foreground"
                  >
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                  </motion.div>
                </motion.div>

                {/* Orbiting core */}
                <motion.div
                  layout
                  className="relative mt-8 h-32 flex items-center justify-center"
                >
                  <motion.div
                    animate={{ scale: isActive ? 0.6 : 1, opacity: isActive ? 0.4 : 1 }}
                    transition={{ duration: 0.5 }}
                    className="size-24 rounded-full bg-[var(--gradient-liquid)] blur-2xl absolute"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="size-28 rounded-full border border-foreground/10 absolute"
                  />
                  <motion.div
                    animate={{ scale: isActive ? 0 : 1 }}
                    className="size-16 rounded-full bg-[var(--gradient-liquid)] shadow-[var(--shadow-glow)]"
                  />
                </motion.div>

                {/* Exploding fragments */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 p-7 pt-32 pointer-events-none"
                    >
                      {f.fragments.map((frag, idx) => {
                        const angle = (idx / f.fragments.length) * Math.PI * 2 - Math.PI / 2;
                        const radius = 130;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        return (
                          <motion.div
                            key={frag.label}
                            initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
                            animate={{ x, y, opacity: 1, scale: 1 }}
                            exit={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
                            transition={{
                              type: "spring",
                              stiffness: 120,
                              damping: 16,
                              delay: idx * 0.05,
                            }}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-36 glass rounded-xl px-3 py-2 pointer-events-auto"
                          >
                            <div className="text-xs font-semibold">{frag.label}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{frag.detail}</div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
