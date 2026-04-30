import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Code2, DollarSign, Briefcase, ArrowRight, ArrowLeft,
  Plus, X, Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/mock-api";
import { toast } from "sonner";

const COMMON_TECHS = ["React", "Node.js", "Python", "TypeScript", "Go", "Rust", "Java", "AWS", "Docker", "Kubernetes", "PostgreSQL", "MongoDB"];

export default function JobCreator() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: [] as string[],
    requirements: [] as string[],
    salaryMin: "",
    salaryMax: "",
    location: "Remote",
    type: "full-time"
  });

  const [tempTech, setTempTech] = useState("");
  const [tempReq, setTempReq] = useState("");

  const addTech = (tech: string) => {
    if (tech && !form.techStack.includes(tech) && form.techStack.length < 10) {
      setForm({ ...form, techStack: [...form.techStack, tech] });
    }
  };

  const removeTech = (tech: string) => setForm({ ...form, techStack: form.techStack.filter(t => t !== tech) });

  const addReq = (req: string) => {
    if (req && form.requirements.length < 10) {
      setForm({ ...form, requirements: [...form.requirements, req] });
    }
  };

  const removeReq = (req: string) => setForm({ ...form, requirements: form.requirements.filter(r => r !== req) });

  const handlePublish = async () => {
    setLoading(true);
    try {
      await api.createJob({
        ...form,
        salaryRange: { min: Number(form.salaryMin), max: Number(form.salaryMax), currency: "USD" }
      });
      toast.success("Job posted successfully!");
      navigate("/startup/dashboard");
    } catch (error) {
      toast.error("Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  const isValidStep = () => {
    switch (step) {
      case 1: return form.title.trim().length >= 5;
      case 2: return form.description.trim().length >= 50;
      case 3: return form.techStack.length >= 1;
      case 4: return Number(form.salaryMin) > 0 && Number(form.salaryMax) >= Number(form.salaryMin);
      default: return false;
    }
  };

  return (
    <div className="mx-auto max-w-3xl pt-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Post a new job</h1>
        <p className="text-muted-foreground">Fill in the details to reach thousands of vetted developers.</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`size-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s ? "✓" : s}
            </div>
            {s < 4 && <div className={`w-12 h-0.5 ${step > s ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="glass-strong">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="size-5 text-primary" />
                  </div>
                  Basic Information
                </CardTitle>
                <p className="text-sm text-muted-foreground">Start with a clear, descriptive title.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Job Title</label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Senior Full-Stack Engineer"
                    className="text-lg h-12"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="glass-strong">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="size-5 text-primary" />
                  </div>
                  Job Description
                </CardTitle>
                <p className="text-sm text-muted-foreground">Describe the role, responsibilities, and what makes your company unique.</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg">
                  <Sparkles className="size-3" />
                  Markdown supported
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="We're looking for an experienced engineer to..."
                  className="min-h-[200px] resize-none"
                />
                <div className="mt-2 text-xs text-muted-foreground">
                  {form.description.length} characters
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="glass-strong">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Code2 className="size-5 text-primary" />
                  </div>
                  Tech Stack & Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground mb-3 block">Required Technologies</label>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {form.techStack.map(t => (
                      <Badge key={t} variant="secondary" className="gap-1.5 py-1">
                        {t}
                        <button onClick={() => removeTech(t)} className="hover:text-destructive ml-0.5">×</button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={tempTech}
                      onChange={(e) => setTempTech(e.target.value)}
                      placeholder="Add technology..."
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addReq(tempTech), setTempTech(""))}
                      className="flex-1"
                    />
                    <Button onClick={() => { addTech(tempTech); setTempTech(""); }} size="sm">
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {COMMON_TECHS.filter(t => !form.techStack.includes(t)).map(t => (
                      <button
                        key={t}
                        onClick={() => addTech(t)}
                        className="text-xs px-2.5 py-1 rounded-full bg-muted/50 border border-border hover:bg-muted transition-colors"
                      >
                        + {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground mb-3 block">Requirements</label>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {form.requirements.map(r => (
                      <Badge key={r} variant="outline" className="gap-1.5 py-1">
                        {r}
                        <button onClick={() => removeReq(r)} className="hover:text-destructive ml-0.5">×</button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={tempReq}
                      onChange={(e) => setTempReq(e.target.value)}
                      placeholder="Add a requirement..."
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addReq(tempReq), setTempReq(""))}
                      className="flex-1"
                    />
                    <Button onClick={() => { addReq(tempReq); setTempReq(""); }} size="sm">
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="glass-strong">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <DollarSign className="size-5 text-primary" />
                  </div>
                  Compensation & Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Min Salary (USD)</label>
                    <Input
                      type="number"
                      value={form.salaryMin}
                      onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
                      placeholder="80000"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Max Salary (USD)</label>
                    <Input
                      type="number"
                      value={form.salaryMax}
                      onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
                      placeholder="120000"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Location</label>
                  <select
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="In-person">In-person</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Job Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="contract">Contract</option>
                    <option value="part-time">Part-time</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        {step > 1 ? (
          <Button variant="ghost" onClick={() => setStep(s => s - 1)}>
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
        ) : (
          <div />
        )}
        {step < 4 ? (
          <Button onClick={() => setStep(s => s + 1)} disabled={!isValidStep()} className="btn-liquid">
            Continue
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button onClick={handlePublish} disabled={loading || !isValidStep()} className="btn-liquid">
            <Briefcase className="size-4 mr-2" />
            {loading ? "Publishing…" : "Post Job"}
          </Button>
        )}
      </div>
    </div>
  );
}
