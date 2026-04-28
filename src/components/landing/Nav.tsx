import { motion } from "framer-motion";

export const Nav = () => {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 px-6 pt-5"
    >
      <nav className="mx-auto max-w-6xl flex items-center justify-between glass-strong rounded-full px-5 py-2.5">
        <a href="#" className="flex items-center gap-2.5">
          <div className="size-7 rounded-lg bg-[var(--gradient-liquid)] shadow-[var(--shadow-glow)]" />
          <span className="font-display font-bold tracking-widest text-sm">NEXUS</span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#matching" className="hover:text-foreground transition-colors">AI Matching</a>
          <a href="#talent" className="hover:text-foreground transition-colors">Talent</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
        </div>
        <button className="btn-liquid !px-5 !py-2 text-xs">Launch App</button>
      </nav>
    </motion.header>
  );
};
