import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, Rocket } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Register() {
  const [role, setRole] = useState<"developer" | "startup" | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      toast.error("Please select Developer or Startup role");
      return;
    }

    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await register(
        form.email,
        form.password,
        role,
        form.name
      );

      toast.success("Account created. Welcome to DevDrop.");
      navigate("/jobs");
    } catch (err: any) {
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data ||
        err?.message ||
        "Registration failed";

      toast.error(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      {/* soft hero-like background */}
      <div className="relative min-h-screen overflow-hidden bg-mesh grain flex items-center justify-center">
        <div className="absolute -top-40 -left-40 size-[500px] rounded-full bg-primary/10 blur-[140px] animate-pulse-glow" />
        <div className="absolute top-1/3 -right-40 size-[600px] rounded-full bg-accent/10 blur-[160px] animate-pulse-glow" />

        <div className="relative z-10 mx-auto max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              Join <span className="text-liquid">DevDrop</span>
            </h1>
            <p className="text-muted-foreground mt-3">
              Pick your side of the marketplace.
            </p>
          </motion.div>

          {!role ? (
            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  id: "developer" as const,
                  icon: Code2,
                  title: "I'm a Developer",
                  desc: "Get matched with startups.",
                },
                {
                  id: "startup" as const,
                  icon: Rocket,
                  title: "I'm a Startup",
                  desc: "Hire top engineers fast.",
                },
              ].map((opt, i) => (
                <motion.button
                  key={opt.id}
                  onClick={() => setRole(opt.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="glass-strong rounded-3xl p-8 text-left
                             border border-white/10 hover:border-primary/20
                             transition-all"
                >
                  <opt.icon className="size-8 mb-4 text-liquid" />
                  <h3 className="font-display text-xl font-semibold mb-2">
                    {opt.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {opt.desc}
                  </p>
                </motion.button>
              ))}
            </div>
          ) : (
            <motion.form
              onSubmit={onSubmit}
              className="glass-strong rounded-3xl p-8 max-w-md mx-auto space-y-4 relative overflow-hidden"
            >
              {/* soft glow like hero */}
              <div className="absolute -top-24 -right-24 size-60 rounded-full bg-primary/10 blur-3xl" />

              <div className="flex justify-between mb-2">
                <span className="text-xs uppercase text-muted-foreground">
                  {role}
                </span>
                <button
                  type="button"
                  onClick={() => setRole(null)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Change
                </button>
              </div>

              {["name", "email", "password"].map((f) => (
                <div key={f}>
                  <label className="text-xs uppercase text-muted-foreground capitalize">
                    {f}
                  </label>
                  <input
                    type={
                      f === "password"
                        ? "password"
                        : f === "email"
                        ? "email"
                        : "text"
                    }
                    required
                    value={(form as any)[f]}
                    onChange={(e) =>
                      setForm({ ...form, [f]: e.target.value })
                    }
                    className="mt-1 w-full bg-white/60 border border-border/60
                               rounded-xl px-4 py-3 text-sm
                               focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              ))}

              <button
                disabled={loading}
                className="btn-liquid w-full !py-3.5 disabled:opacity-60"
              >
                {loading ? "Creating…" : "Create account"}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                Already on DevDrop?{" "}
                <Link to="/login" className="text-foreground font-medium">
                  Sign in
                </Link>
              </p>
            </motion.form>
          )}
        </div>
      </div>
    </AppShell>
  );
}