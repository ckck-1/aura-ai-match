import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppShell } from "@/components/app/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const [role, setRole] = useState<"developer" | "startup">("developer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password); // ✅ REAL BACKEND LOGIN (AuthContext)

      toast.success("Welcome back to DevDrop.");

      // optional: role-based redirect (safe fallback)
      navigate("/jobs");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Login failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong rounded-3xl p-8 relative overflow-hidden"
        >
          <div className="absolute -top-32 -right-32 size-64 rounded-full bg-[var(--gradient-liquid)] opacity-20 blur-3xl" />

          <h1 className="font-display text-3xl font-bold tracking-tight mb-2">
            Sign in
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Continue to your DevDrop workspace.
          </p>

          <div className="grid grid-cols-2 gap-2 p-1 rounded-full bg-muted/40 mb-6 text-sm">
            {(["developer", "startup"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-2 rounded-full capitalize transition-all ${
                  role === r
                    ? "bg-[var(--gradient-liquid)] text-primary-foreground shadow-[var(--shadow-glow)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="you@founder.dev"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••••"
              />
            </div>

            <button
              disabled={loading}
              className="btn-liquid w-full !py-3.5 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Continue"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            New to DevDrop?{" "}
            <Link to="/register" className="text-foreground hover:text-liquid font-medium">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </AppShell>
  );
}