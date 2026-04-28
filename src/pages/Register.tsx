import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, Rocket } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { api } from "@/lib/mock-api";
import { toast } from "sonner";

export default function Register() {
  const [role, setRole] = useState<"developer" | "startup" | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setLoading(true);
    try {
      await api.register({ ...form, role });
      toast.success("Account created. Welcome to Nexus.");
      navigate(role === "developer" ? "/developers/dev_1" : "/jobs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Join <span className="text-liquid">Nexus</span>
          </h1>
          <p className="text-muted-foreground mt-3">Pick your side of the marketplace.</p>
        </motion.div>

        {!role ? (
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { id: "developer" as const, icon: Code2, title: "I'm a Developer", desc: "Get matched with the best startups by our Mistral-powered engine." },
              { id: "startup" as const, icon: Rocket, title: "I'm a Startup", desc: "Hire vetted, AI-matched senior engineers in days, not months." },
            ].map((opt, i) => (
              <motion.button
                key={opt.id}
                onClick={() => setRole(opt.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="glass-strong rounded-3xl p-8 text-left relative overflow-hidden group"
              >
                <div className="absolute -top-20 -right-20 size-48 rounded-full bg-[var(--gradient-liquid)] opacity-10 blur-3xl group-hover:opacity-30 transition-opacity" />
                <opt.icon className="size-8 mb-4 text-liquid" />
                <h3 className="font-display text-xl font-semibold mb-2">{opt.title}</h3>
                <p className="text-sm text-muted-foreground">{opt.desc}</p>
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-3xl p-8 max-w-md mx-auto space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{role}</span>
              <button type="button" onClick={() => setRole(null)} className="text-xs text-muted-foreground hover:text-foreground">
                Change
              </button>
            </div>
            {["name", "email", "password"].map((f) => (
              <div key={f}>
                <label className="text-xs uppercase tracking-widest text-muted-foreground capitalize">{f}</label>
                <input
                  type={f === "password" ? "password" : f === "email" ? "email" : "text"}
                  required
                  value={(form as any)[f]}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  className="mt-1 w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            ))}
            <button disabled={loading} className="btn-liquid w-full !py-3.5 disabled:opacity-60">
              {loading ? "Creating…" : "Create account"}
            </button>
            <p className="text-center text-sm text-muted-foreground">
              Already on Nexus?{" "}
              <Link to="/login" className="text-foreground font-medium">
                Sign in
              </Link>
            </p>
          </motion.form>
        )}
      </div>
    </AppShell>
  );
}
