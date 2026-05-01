import { ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Footer } from "@/components/landing/Footer";

const links = [
  { to: "/jobs", label: "Jobs" },
  { to: "/applications", label: "Applications" },
  { to: "/messages", label: "Messages" },
  { to: "/pricing", label: "Pricing" },
];

export const AppShell = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      {/* same Hero-style background system */}
      <div className="absolute inset-0 bg-mesh pointer-events-none -z-10" />

      <motion.header
        initial={{ y: -25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 inset-x-0 z-50 px-6 pt-5"
      >
        <nav
          className="
            mx-auto max-w-6xl
            flex items-center justify-between
            rounded-full px-5 py-2.5
            bg-white/60 backdrop-blur-xl
            border border-white/10
            shadow-sm
          "
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-[var(--gradient-liquid)] shadow-sm" />
            <span className="font-display font-bold tracking-widest text-sm">
              DevDrop
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `transition-colors ${
                    isActive || pathname.startsWith(l.to)
                      ? "text-foreground font-medium"
                      : "hover:text-foreground"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* CTA */}
          <Link
            to="/login"
            className="btn-liquid !px-5 !py-2 text-xs"
          >
            Launch App
          </Link>
        </nav>
      </motion.header>

      {/* page content */}
      <div className="pt-32 pb-24 px-6">
        <div className="mx-auto max-w-6xl">{children}</div>
      </div>

      <Footer />
    </main>
  );
};