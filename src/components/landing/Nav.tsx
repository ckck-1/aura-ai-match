import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Nav = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const dashboardPath =
    user?.role === "startup"
      ? "/startup/dashboard"
      : "/developer/dashboard";

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 px-6 pt-5"
    >
      <nav className="mx-auto max-w-6xl flex items-center justify-between glass-strong rounded-full px-5 py-2.5">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="size-7 rounded-lg bg-[var(--gradient-liquid)] shadow-[var(--shadow-glow)]" />
          <span className="font-display font-bold tracking-widest text-sm uppercase">
            DevDrop
          </span>
        </Link>

        {/* Middle links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/jobs" className="hover:text-foreground transition-colors">
            Jobs
          </Link>

          <Link
            to="/pricing"
            className="hover:text-foreground transition-colors"
          >
            Pricing
          </Link>

          {isAuthenticated && (
            <Link
              to={dashboardPath}
              className="hover:text-foreground transition-colors font-medium text-liquid"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign in
              </Link>

              <Link to="/register" className="btn-liquid !px-5 !py-2 text-xs">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/settings"
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
              >
                {user?.name || "Account"}
              </Link>

              <button
                onClick={logout}
                className="text-sm text-muted-foreground hover:text-destructive transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
};