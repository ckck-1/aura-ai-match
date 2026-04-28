import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const Nav = () => {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 px-6 pt-5"
    >
      <nav className="mx-auto max-w-6xl flex items-center justify-between glass-strong rounded-full px-5 py-2.5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="size-7 rounded-lg bg-[var(--gradient-liquid)] shadow-[var(--shadow-glow)]" />
          <span className="font-display font-bold tracking-widest text-sm">NEXUS</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/jobs" className="hover:text-foreground transition-colors">Jobs</Link>
          <Link to="/developers/dev_1" className="hover:text-foreground transition-colors">Talent</Link>
          <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link to="/login" className="hover:text-foreground transition-colors">Sign in</Link>
        </div>
        <Link to="/register" className="btn-liquid !px-5 !py-2 text-xs">Launch App</Link>
      </nav>
    </motion.header>
  );
};
