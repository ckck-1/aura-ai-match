export const Footer = () => {
  return (
    <footer className="relative border-t border-border/50 py-12">
      <div className="container flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="size-6 rounded-md bg-[var(--gradient-liquid)]" />
          <span className="font-display font-bold tracking-widest text-xs">NEXUS</span>
          <span className="text-xs text-muted-foreground ml-3">© 2026 — built quietly.</span>
        </div>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Status</a>
          <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
};
