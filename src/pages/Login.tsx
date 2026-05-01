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
      await login(email, password);
      toast.success("Welcome back to DevDrop.");
      navigate("/jobs");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-mesh grain">
        {/* ambient glow */}
        <div className="absolute -top-40 -left-40 size-[450px] rounded-full bg-primary/10 blur-[140px] animate-pulse-glow" />
        <div className="absolute top-1/3 -right-40 size-[550px] rounded-full bg-accent/10 blur-[160px] animate-pulse-glow" />

        <div className="mx-auto max-w-md w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="
              relative overflow-hidden
              rounded-[30px]
              p-8
              bg-white/60
              backdrop-blur-2xl
              border border-white/10
              ring-1 ring-black/5
              shadow-[0_20px_60px_rgba(0,0,0,0.10)]
            "
          >
            {/* soft internal glow */}
            <div className="absolute -top-24 -right-24 size-60 rounded-full bg-primary/10 blur-3xl" />

            <h1 className="font-display text-3xl font-bold tracking-tight mb-2">
              Sign in
            </h1>

            <p className="text-muted-foreground text-sm mb-8">
              Continue to your DevDrop workspace.
            </p>

            {/* role switch */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-full bg-white/40 backdrop-blur mb-6 text-sm">
              {(["developer", "startup"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 rounded-full capitalize transition-all ${
                    role === r
                      ? "bg-white shadow-sm text-foreground border border-white/40"
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
                  className="
                    mt-1 w-full
                    bg-white/70
                    border border-white/20
                    rounded-xl px-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-primary/20
                  "
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
                  className="
                    mt-1 w-full
                    bg-white/70
                    border border-white/20
                    rounded-xl px-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-primary/20
                  "
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
              <Link
                to="/register"
                className="text-foreground hover:text-liquid font-medium"
              >
                Create an account
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}