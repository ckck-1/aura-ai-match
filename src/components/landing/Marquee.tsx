const logos = ["LINEAR", "VERCEL", "ANTHROPIC", "MISTRAL", "STRIPE", "RAYCAST", "ARC", "SUPABASE"];

export const Marquee = () => {
  return (
    <section className="relative py-16 border-y border-border/50 overflow-hidden">
      <div className="container">
        <div className="text-center text-xs tracking-[0.3em] text-muted-foreground uppercase mb-8">
          Trusted by teams shipping the future
        </div>
        <div className="relative overflow-hidden mask-fade">
          <div className="flex gap-16 animate-shimmer" style={{
            animation: 'marquee 30s linear infinite',
            width: 'max-content',
          }}>
            {[...logos, ...logos, ...logos].map((l, i) => (
              <div key={i} className="font-display font-bold text-2xl text-muted-foreground/60 tracking-widest whitespace-nowrap">
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .mask-fade {
          mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
    </section>
  );
};
