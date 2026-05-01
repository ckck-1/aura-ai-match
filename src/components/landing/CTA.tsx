import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const CTA = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative glass-strong rounded-[2.5rem] p-14 md:p-20 text-center overflow-hidden bg-mesh"
        >
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[500px] rounded-full bg-primary/30 blur-[120px]" />

          <div className="relative z-10">
            <div className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-5">
              // Join the network
            </div>

            <h2 className="font-display text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight max-w-3xl mx-auto text-balance">
              Stop scrolling job boards.{" "}
              <span className="text-liquid">Let the work find you.</span>
            </h2>

            <p className="mt-6 text-muted-foreground text-lg max-w-xl mx-auto">
              Apply once. Get matched continuously. Free for developers, forever.
            </p>

            {/* BUTTONS */}
            <div className="mt-10 flex flex-wrap gap-3 justify-center">
              <Link to="/register" className="btn-liquid">
                Create developer profile
              </Link>

              <Link to="/login" className="btn-ghost-liquid">
                Login to your account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};