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
    <section className="relative py-32 overflow-hidden bg-white">
      <div className="container">
        <div className="max-w-2xl mb-20">
          <div className="text-xs tracking-[0.3em] text-slate-500 uppercase mb-4">
            // Core systems
          </div>

          <h2 className="text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight text-slate-900">
            Built like <span className="text-blue-900">infrastructure</span>.<br />
            Felt like magic.
          </h2>

          <p className="mt-5 text-slate-500 text-lg">
            Click a node — systems expand cleanly, no overlap, no chaos.
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
                className="relative text-left rounded-3xl p-7 overflow-visible bg-gradient-to-b from-white to-blue-50 border border-blue-100 shadow-sm"
                style={{ minHeight: isActive ? 500 : 280 }}
              >
                {/* HEADER */}
                <div className="flex items-start justify-between relative z-20">
                  <div>
                    <div className="text-xs text-slate-400 tracking-wider uppercase">
                      0{i + 1}
                    </div>

                    <h3 className="text-2xl font-bold mt-2 text-slate-900">
                      {f.title}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1.5">
                      {f.tagline}
                    </p>
                  </div>

                  <motion.div
                    animate={{ rotate: isActive ? 135 : 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center shadow-md"
                  >
                    +
                  </motion.div>
                </div>

                {/* CORE NODE (IMPORTANT FIX) */}
                <div className="relative mt-10 flex items-center justify-center h-28">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.4 : 1,
                      opacity: isActive ? 0.25 : 0.5,
                    }}
                    className="absolute w-28 h-28 rounded-full blur-2xl"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(30,64,175,0.35), transparent 70%)",
                    }}
                  />

                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="w-28 h-28 rounded-full border border-blue-200 absolute"
                  />

                  <motion.div
                    animate={{ scale: isActive ? 0 : 1 }}
                    className="w-14 h-14 rounded-full bg-blue-900 shadow-md"
                  />
                </div>

                {/* 🔥 EXPLOSION (FIXED ORIGIN + NO HEADER COLLISION) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute left-0 right-0 bottom-8 top-[140px] pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {f.fragments.map((frag, idx) => {
                        const angle =
                          (idx / f.fragments.length) * Math.PI * 2 - Math.PI / 2;

                        // IMPORTANT FIX: wider horizontal, controlled vertical spread
                        const radiusX = 150;
                        const radiusY = 110;

                        const x = Math.cos(angle) * radiusX;
                        const y = Math.sin(angle) * radiusY;

                        return (
                          <motion.div
                            key={frag.label}
                            initial={{
                              x: 0,
                              y: 20,
                              opacity: 0,
                              scale: 0.2,
                            }}
                            animate={{
                              x,
                              y,
                              opacity: 1,
                              scale: 1,
                            }}
                            exit={{
                              x: 0,
                              y: 20,
                              opacity: 0,
                              scale: 0.2,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 120,
                              damping: 14,
                              delay: idx * 0.05,
                            }}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 rounded-xl px-3 py-2 bg-white border border-blue-100 shadow-sm"
                          >
                            <div className="text-xs font-semibold text-blue-900">
                              {frag.label}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {frag.detail}
                            </div>
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