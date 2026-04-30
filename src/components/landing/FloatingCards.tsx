import { motion } from "framer-motion";

type Card = {
  name: string;
  role: string;
  score: number;
  stack: string[];
  quote: string;
  accent: string;
  image: string;
};

const cards: Card[] = [
  {
    name: "Aïcha Bensalem",
    role: "Senior Rust Engineer",
    score: 98,
    stack: ["Rust", "WASM", "Tokio"],
    quote: "Matched with a fintech in 36h. Best onboarding I've had.",
    accent: "from-[#90e0ef] to-[#03045e]",
    image: "/image.png",
  },
  {
    name: "Linear (YC W24)",
    role: "Series A — hiring 4",
    score: 94,
    stack: ["TypeScript", "Postgres", "AI"],
    quote: "Nexus replaced our entire sourcing pipeline.",
    accent: "from-[#00b4d8] to-[#0077b6]",
    image: "/image copy.png",
  },
  {
    name: "Marcus Chen",
    role: "ML Infrastructure",
    score: 96,
    stack: ["PyTorch", "K8s", "CUDA"],
    quote: "The AI score is uncanny. Every intro was relevant.",
    accent: "from-[#0077b6] to-[#03045e]",
    image: "/MarcusChen.jpg",
  },
];
const positions = [
  { x: "0%", y: "0%", r: -6, scale: 1, z: 30 },
  { x: "55%", y: "18%", r: 5, scale: 0.92, z: 20 },
  { x: "10%", y: "55%", r: 3, scale: 0.96, z: 25 },
];

export const FloatingCards = () => {
  return (
    <div
      className="relative h-[560px] hidden lg:block"
      style={{ perspective: "1500px" }}
    >
      {cards.map((c, i) => {
        const p = positions[i];

        return (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 60, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{
              duration: 1,
              delay: 0.4 + i * 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute w-[320px]"
            style={{
              left: p.x,
              top: p.y,
              zIndex: p.z,
              transformStyle: "preserve-3d",
            }}
          >
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{
                duration: 6 + i * 0.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
              style={{
                transform: `rotate(${p.r}deg) scale(${p.scale})`,
              }}
              whileHover={{
                scale: p.scale * 1.05,
                rotate: 0,
                transition: { duration: 0.4 },
              }}
              className="glass-strong rounded-3xl p-5 shadow-[var(--shadow-elegant)] cursor-pointer group"
            >
              {/* HEADER */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* AVATAR */}
                  <div className="size-11 rounded-2xl overflow-hidden shadow-lg ring-1 ring-white/10">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div>
                    <div className="text-sm font-semibold leading-tight">
                      {c.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {c.role}
                    </div>
                  </div>
                </div>

                {/* SCORE */}
                <div className="text-right">
                  <div className="text-[10px] text-muted-foreground tracking-widest uppercase">
                    AI Score
                  </div>
                  <div className="font-display font-bold text-liquid text-xl leading-none mt-1">
                    {c.score}
                  </div>
                </div>
              </div>

              {/* QUOTE */}
              <p className="text-sm text-foreground/80 mt-4 leading-relaxed">
                "{c.quote}"
              </p>

              {/* STACK */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {c.stack.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] px-2 py-1 rounded-full bg-foreground/5 border border-foreground/10 text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* CONNECTING LINES */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="w-full h-full opacity-30"
          viewBox="0 0 500 560"
          fill="none"
        >
          <defs>
            <linearGradient id="ln" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>

          <path
            d="M150 100 Q 300 200 380 200"
            stroke="url(#ln)"
            strokeWidth="1"
            strokeDasharray="3 6"
          />
          <path
            d="M380 200 Q 250 380 160 400"
            stroke="url(#ln)"
            strokeWidth="1"
            strokeDasharray="3 6"
          />
        </svg>
      </div>
    </div>
  );
};