import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle, Mail, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";

export default function EmailVerification() {
  return (
    <AppShell>
      <div className="mx-auto max-w-md pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-strong rounded-3xl p-10 text-center relative overflow-hidden"
        >
          <div className="absolute -top-24 -left-24 size-48 rounded-full bg-[var(--gradient-liquid)] opacity-10 blur-3xl" />

          <div className="relative z-10">
            <div className="mx-auto size-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Mail className="size-8 text-primary" />
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight mb-3">
              Check your inbox
            </h1>
            <p className="text-muted-foreground mb-8">
              We've sent a verification link to your email. Click the link to activate your account.
            </p>

            <div className="space-y-3">
              <Button asChild className="btn-liquid w-full">
                <a href="https://mail.google.com" target="_blank" rel="noreferrer">
                  Open Email
                </a>
              </Button>
              <Button variant="ghost" className="w-full">
                Resend verification email
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-4" />
                Back to sign in
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Success State (hidden by default) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="hidden glass-strong rounded-3xl p-10 text-center"
        >
          <div className="mx-auto size-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
            <CheckCircle className="size-8 text-green-500" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-3">
            Email verified!
          </h1>
          <p className="text-muted-foreground mb-6">
            Your account is now active. Let's get started.
          </p>
          <Button asChild className="btn-liquid w-full">
            <Link to="/login">Sign in</Link>
          </Button>
        </motion.div>
      </div>
    </AppShell>
  );
}
