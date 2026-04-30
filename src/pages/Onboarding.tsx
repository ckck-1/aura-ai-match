import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Github, Linkedin, Globe, ArrowRight, ArrowLeft, Check, Rocket, Building2, Tag, Link2 } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/mock-api";
import { toast } from "sonner";

const POPULAR_TECHS = ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Go", "Rust", "Java", "Docker", "Kubernetes", "AWS", "PostgreSQL", "MongoDB"];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"developer" | "startup">("developer");
  const [loading, setLoading] = useState(false);

  // Developer state
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [socials, setSocials] = useState({ github: "", linkedin: "", portfolio: "" });

  // Startup state
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill) && skills.length < 10) {
      setSkills([...skills, skill]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => setSkills(skills.filter(s => s !== skill));

  const handleComplete = async () => {
    setLoading(true);
    try {
      if (role === "developer") {
        await api.updateDeveloperProfile({ skills, ...socials });
      } else {
        await api.updateStartupProfile({ companyName, industry, companySize });
      }
      toast.success("Profile completed!");
      navigate(role === "developer" ? "/developer/dashboard" : "/startup/dashboard");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl pt-10">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {role === "developer" ? (
            <>
              <StepDot num={1} active={step >= 1} label="Skills" />
              <div className="w-12 h-0.5 bg-border" />
              <StepDot num={2} active={step >= 2} label="Socials" />
              <div className="w-12 h-0.5 bg-border" />
              <StepDot num={3} active={step >= 3} label="Done" />
            </>
          ) : (
            <>
              <StepDot num={1} active={step >= 1} label="Company" />
              <div className="w-12 h-0.5 bg-border" />
              <StepDot num={2} active={step >= 2} label="Industry" />
              <div className="w-12 h-0.5 bg-border" />
              <StepDot num={3} active={step >= 3} label="Done" />
            </>
          )}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-strong rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  {role === "developer" ? <Code2 className="size-6 text-primary" /> : <Building2 className="size-6 text-primary" />}
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">
                    {role === "developer" ? "Add your tech stack" : "Tell us about your company"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {role === "developer" ? "Skills help our AI find your perfect match." : "Basic info gets your dashboard ready."}
                  </p>
                </div>
              </div>

              {role === "developer" ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                      Your tech stack (up to 10)
                    </label>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {skills.map(s => (
                        <Badge key={s} variant="secondary" className="gap-1.5 py-1.5">
                          {s}
                          <button onClick={() => removeSkill(s)} className="hover:text-destructive">
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Add a technology..."
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill(skillInput))}
                        className="flex-1"
                      />
                      <Button onClick={() => addSkill(skillInput)} size="sm">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {POPULAR_TECHS.filter(t => !skills.includes(t)).slice(0, 8).map(t => (
                        <button
                          key={t}
                          onClick={() => addSkill(t)}
                          className="text-xs px-2.5 py-1 rounded-full bg-muted/50 border border-border hover:bg-muted transition-colors"
                        >
                          + {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Company name</label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Inc."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Industry</label>
                    <Input
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g. FinTech, SaaS, AI"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Company size</label>
                    <select
                      value={companySize}
                      onChange={(e) => setCompanySize(e.target.value)}
                      className="mt-1 w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="500+">500+ employees</option>
                    </select>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 2 && role === "developer" && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-strong rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Link2 className="size-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Connect your profiles</h2>
                  <p className="text-sm text-muted-foreground">
                    Import your social links to boost visibility.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">GitHub</label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      value={socials.github}
                      onChange={(e) => setSocials({ ...socials, github: e.target.value })}
                      placeholder="github.com/yourusername"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">LinkedIn</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      value={socials.linkedin}
                      onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })}
                      placeholder="linkedin.com/in/yourprofile"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Portfolio / Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      value={socials.portfolio}
                      onChange={(e) => setSocials({ ...socials, portfolio: e.target.value })}
                      placeholder="yourwebsite.com"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && role === "startup" && (
            <motion.div
              key="step2-startup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-strong rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Tag className="size-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Set your industry</h2>
                  <p className="text-sm text-muted-foreground">
                    Helps us surface relevant candidates.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="mt-1 w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select industry</option>
                    <option value="FinTech">FinTech</option>
                    <option value="SaaS">SaaS</option>
                    <option value="AI/ML">AI / Machine Learning</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="EdTech">EdTech</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-strong rounded-3xl p-8 text-center"
            >
              <div className="mx-auto size-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                <Check className="size-8 text-green-500" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">You're all set!</h2>
              <p className="text-muted-foreground mb-8">
                Your profile is ready. Let's {role === "developer" ? "find jobs" : "post your first job"}.
              </p>
              <Button onClick={handleComplete} disabled={loading} className="btn-liquid">
                {loading ? "Saving…" : "Go to Dashboard"}
                <ArrowRight className="size-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {step < 3 && (
          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => setStep(s => s - 1)}>
                <ArrowLeft className="size-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}
            <Button
              onClick={() => {
                if (role === "developer" && step === 1 && skills.length === 0) {
                  toast.error("Add at least one skill");
                  return;
                }
                if (role === "startup" && step === 1 && (!companyName || !industry)) {
                  toast.error("Fill in company info");
                  return;
                }
                setStep(s => s + 1);
              }}
              className="btn-liquid"
            >
              Continue
              <ArrowRight className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function StepDot({ num, active, label }: { num: number; active: boolean; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`size-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
          active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        {num}
      </div>
      <span className={`text-[10px] uppercase tracking-wider ${active ? "text-foreground" : "text-muted-foreground"}`}>
        {label}
      </span>
    </div>
  );
}
