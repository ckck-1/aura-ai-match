import { useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, Mail, Star, UserPlus, CheckCircle, XCircle, Briefcase, Sparkles } from "lucide-react";
import CandidateProfilePreview from "./CandidateProfilePreview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Developer } from "@/lib/mock-api";

interface PipelineCandidate {
  id: string;
  developer: Developer;
  jobId: string;
  status: "new" | "reviewing" | "interviewing" | "hired" | "rejected";
  appliedAt: string;
}

interface PipelineBoardProps {
  candidates: PipelineCandidate[];
  onStatusChange?: (candidateId: string, newStatus: PipelineCandidate["status"]) => void;
  onViewProfile?: (candidate: PipelineCandidate) => void;
}

const COLUMNS: { id: PipelineCandidate["status"]; title: string; color: string; icon: React.ReactNode }[] = [
  { id: "new", title: "New Matches", color: "bg-blue-500/10 border-blue-500/20", icon: <Sparkles className="size-4" /> },
  { id: "reviewing", title: "Reviewing", color: "bg-yellow-500/10 border-yellow-500/20", icon: <UserPlus className="size-4" /> },
  { id: "interviewing", title: "Interviewing", color: "bg-purple-500/10 border-purple-500/20", icon: <Briefcase className="size-4" /> },
  { id: "hired", title: "Hired", color: "bg-green-500/10 border-green-500/20", icon: <CheckCircle className="size-4" /> },
  { id: "rejected", title: "Rejected", color: "bg-muted border-border", icon: <XCircle className="size-4" /> },
];

export default function CandidatePipeline({ candidates, onStatusChange, onViewProfile }: PipelineBoardProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<PipelineCandidate | null>(null);

  const getColumnCount = (status: PipelineCandidate["status"]) =>
    candidates.filter((c) => c.status === status).length;

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((column) => (
        <div
          key={column.id}
          className={cn(
            "min-w-[300px] w-[300px] rounded-2xl border-2 border-dashed p-4 flex flex-col",
            column.color
          )}
        >
          {/* Column Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-background/50">{column.icon}</div>
            <h3 className="font-semibold">{column.title}</h3>
            <Badge variant="secondary" className="ml-auto">
              {getColumnCount(column.id)}
            </Badge>
          </div>

          {/* Candidates Column */}
          <div className="flex-1 space-y-3">
            {candidates
              .filter((c) => c.status === column.id)
              .map((candidate) => (
                <motion.div
                  key={candidate.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  drag
                  dragSnapToOrigin
                  className="glass-strong rounded-xl p-4 cursor-pointer group"
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="size-10">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-sm">
                        {candidate.developer.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-sm truncate">{candidate.developer.name}</h4>
                          <p className="text-xs text-muted-foreground truncate">{candidate.developer.title}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="size-4 text-muted-foreground" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="h-5 text-[10px]">
                          {candidate.developer.aiScore}% match
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{candidate.appliedAt}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {candidate.developer.skills.slice(0, 3).map((skill) => (
                          <span key={skill} className="text-[9px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      ))}

      {/* Candidate Detail Sidebar */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm" onClick={() => setSelectedCandidate(null)}>
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-4" onClick={(e) => e.stopPropagation()}>
            <CandidateProfilePreview
              developer={selectedCandidate.developer}
              onMessage={() => { /* Open chat */ }}
              onShortlist={() => { /* Toggle shortlist */ }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
