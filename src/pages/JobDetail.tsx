import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Clock, DollarSign, Briefcase, ArrowLeft, Send, Building2 } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/mock-api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export default function JobDetail() {
  const { id } = useParams();
  const { data: job, isLoading, error } = useQuery({
    queryKey: ["job", id],
    queryFn: () => id ? api.getJob(id) : Promise.reject("No ID"),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto pt-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
            <div className="h-64 bg-muted rounded-2xl" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !job) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto pt-8">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-2">Job not found</h2>
            <p className="text-muted-foreground mb-6">This role may have been filled or removed.</p>
            <Button asChild variant="outline">
              <Link to="/jobs">Browse all jobs</Link>
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const handleApply = async () => {
    try {
      await api.applyToJob(job._id, {
        coverLetter: "",
        resumeSnapshot: "See profile",
      });
      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit application");
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back link */}
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to jobs
          </Link>

          {/* Header */}
          <div className="glass-strong rounded-3xl p-8 mb-6 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 size-64 rounded-full bg-[var(--gradient-liquid)] opacity-10 blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="size-16 rounded-2xl bg-[var(--gradient-liquid)] flex items-center justify-center font-display font-bold text-xl text-primary-foreground shadow-lg">
                    {job.startup.logo}
                  </div>
                  <div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold">{job.title}</h1>
                    <div className="flex items-center gap-3 mt-2 text-muted-foreground">
                      <span className="font-medium text-foreground">{job.startup.name}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><MapPin className="size-3.5" />{job.location}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-3 text-sm">
                      <Badge variant="outline" className="capitalize">{job.type}</Badge>
                      <Badge variant="outline">{job.startup.stage}</Badge>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-2xl font-display font-bold text-liquid">
                    {job.matchScore}% match
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">AI confidence</div>
                </div>
              </div>

              {/* Salary & Quick Meta */}
              <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="size-4" />
                  <span>${(job.salaryRange.min / 1000).toFixed(0)}k – ${(job.salaryRange.max / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="size-4" />
                  <span className="capitalize">{job.type.replace("-", " ")}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-4" />
                  <span>Posted {job.postedAt}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              <Card className="glass-strong">
                <CardHeader>
                  <CardTitle>About the role</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </div>
                </CardContent>
              </Card>

              {/* Tech Stack */}
              <Card className="glass-strong">
                <CardHeader>
                  <CardTitle>Tech stack</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="py-1.5 px-3">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card className="glass-strong">
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-foreground/90">
                    {job.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card className="glass-strong sticky top-6">
                <CardContent className="pt-6">
                  <Button onClick={handleApply} disabled={job.applied} className="btn-liquid w-full mb-3">
                    <Send className="size-4 mr-2" />
                    {job.applied ? "Applied" : "Drop Application"}
                  </Button>
                  {job.applied && (
                    <p className="text-xs text-center text-muted-foreground">
                      You already applied to this role.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Company Card */}
              <Card className="glass-strong">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="size-5" />
                    About {job.startup.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {job.startup.stage} · {job.startup.industry || "Tech"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
