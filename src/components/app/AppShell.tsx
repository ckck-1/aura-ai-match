import { ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Footer } from "@/components/landing/Footer";

const links = [
  { to: "/jobs", label: "Jobs" },
  { to: "/developers/dev_1", label: "Talent" },
  { to: "/pricing", label: "Pricing" },
];

export const AppShell = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 bg-mesh pointer-events-none -z-10" />
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 inset-x-0 z-50 px-6 pt-5"
      >
        <nav className="mx-auto max-w-6xl flex items-center justify-between glass-strong rounded-full px-5 py-2.5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-[var(--gradient-liquid)] shadow-[var(--shadow-glow)]" />
            <span className="font-display font-bold tracking-widest text-sm">NEXUS</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `transition-colors ${isActive || pathname.startsWith(l.to) ? "text-foreground" : "hover:text-foreground"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
          <Link to="/login" className="btn-liquid !px-5 !py-2 text-xs">
            Launch App
          </Link>
        </nav>
      </motion.header>
      <div className="pt-32 pb-24 px-6">
        <div className="mx-auto max-w-6xl">{children}</div>
      </div>
      <Footer />
    </main>
  );
};
