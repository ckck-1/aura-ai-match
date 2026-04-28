import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { toast } from "sonner";

const PLANS = [
  {
    name: "Explorer",
    price: { monthly: 0, yearly: 0 },
    blurb: "For developers building their reputation.",
    features: ["AI match score on every role", "Unlimited applications", "Public profile", "Community access"],
    cta: "Start free",
  },
  {
    name: "Founder",
    price: { monthly: 149, yearly: 119 },
    blurb: "For startups hiring their first 5 engineers.",
    features: ["3 active roles", "Unlimited AI-ranked candidates", "Calendar + Stripe payouts", "Priority matching", "Slack support"],
    cta: "Hire faster",
    highlight: true,
  },
  {
    name: "Scale",
    price: { monthly: 599, yearly: 479 },
    blurb: "For Series A+ teams running parallel searches.",
    features: ["Unlimited roles", "Dedicated talent partner", "ATS integrations", "SSO + SCIM", "99.99% SLA"],
    cta: "Talk to sales",
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(true);

  const checkout = (plan: string, price: number) => {
    if (price === 0) toast.success(`${plan} is free — you're in.`);
    else toast.info(`Stripe checkout for ${plan} ($${price}/mo) — wire VITE_API_BASE_URL to enable.`);
  };

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-4">
          <Sparkles className="size-3.5 text-liquid" /> Simple, usage-honest pricing
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
          Pay only when <span className="text-liquid">it works</span>
        </h1>
        <p className="text-muted-foreground mt-4">
          No résumé fees. No success bounties. Just a flat platform price plus Stripe-backed milestone payouts.
        </p>

        <div className="mt-8 inline-flex items-center gap-1 p-1 rounded-full bg-muted/40 text-sm">
          <button
            onClick={() => setYearly(false)}
            className={`px-5 py-2 rounded-full transition ${!yearly ? "bg-[var(--gradient-liquid)] text-primary-foreground" : "text-muted-foreground"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`px-5 py-2 rounded-full transition ${yearly ? "bg-[var(--gradient-liquid)] text-primary-foreground" : "text-muted-foreground"}`}
          >
            Yearly <span className="text-xs opacity-70 ml-1">−20%</span>
          </button>
        </div>
      </motion.div>

      <div className="mt-14 grid md:grid-cols-3 gap-5">
        {PLANS.map((p, i) => {
          const price = yearly ? p.price.yearly : p.price.monthly;
          return (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className={`relative rounded-3xl p-8 overflow-hidden ${
                p.highlight ? "glass-strong border-2 border-transparent bg-clip-padding" : "glass"
              }`}
              style={
                p.highlight
                  ? { boxShadow: "var(--shadow-glow), var(--shadow-elegant)" }
                  : undefined
              }
            >
              {p.highlight && (
                <div className="absolute top-5 right-5 text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-[var(--gradient-liquid)] text-primary-foreground">
                  Most loved
                </div>
              )}
              <h3 className="font-display text-xl font-semibold">{p.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">{p.blurb}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display text-5xl font-bold tracking-tight">${price}</span>
                <span className="text-sm text-muted-foreground">/{yearly ? "mo (billed yearly)" : "month"}</span>
              </div>
              <button
                onClick={() => checkout(p.name, price)}
                className={p.highlight ? "btn-liquid w-full" : "btn-ghost-liquid w-full"}
              >
                {p.cta}
              </button>
              <ul className="space-y-3 mt-7 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="size-4 mt-0.5 text-liquid shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-16 glass-strong rounded-3xl p-8 md:p-10 text-center max-w-3xl mx-auto"
      >
        <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
          Backed by <span className="text-liquid">Stripe Connect</span>
        </h2>
        <p className="text-muted-foreground mt-3">
          Milestone-based escrow, automatic 1099/W-9 collection, and instant payouts to 40+ countries. You never touch a wire transfer.
        </p>
      </motion.div>
    </AppShell>
  );
}
