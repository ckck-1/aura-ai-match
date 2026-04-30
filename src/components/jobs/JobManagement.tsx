import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Edit3, Archive, Trash2, Calendar, MapPin } from "lucide-react";
import { Job } from "@/lib/mock-api";

interface JobManagementProps {
  jobs: Job[];
  onEdit?: (job: Job) => void;
  onArchive?: (jobId: string) => void;
  onViewApplicants?: (jobId: string) => void;
}

export default function JobManagement({ jobs, onEdit, onArchive, onViewApplicants }: JobManagementProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "paused": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "archived": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Applications</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Posted</TableHead>
            <TableHead className="w-[60px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <motion.tr
              key={job._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group hover:bg-muted/30 transition-colors"
            >
              <TableCell>
                <div>
                  <div className="font-semibold">{job.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="size-3" />
                    {job.location}
                  </div>
                </div>
              </TableCell>
              <TableCell>{job.location}</TableCell>
              <TableCell className="capitalize">{job.type.replace("-", " ")}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-mono">
                  {job.applications?.length || 0} applicants
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor("active")}>
                  Active
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">{job.postedAt}</TableCell>
              <TableCell>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setOpenMenu(openMenu === job._id ? null : job._id)}
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>

                  {openMenu === job._id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                      <div className="absolute right-0 top-full mt-1 w-48 glass-strong rounded-lg py-1 z-20 shadow-lg">
                        <button
                          onClick={() => { onViewApplicants?.(job._id); setOpenMenu(null); }}
                          className="w-full px-3 py-2 text-sm text-left hover:bg-muted/50 flex items-center gap-2"
                        >
                          <Eye className="size-4" />
                          View Applicants
                        </button>
                        <button
                          onClick={() => { onEdit?.(job); setOpenMenu(null); }}
                          className="w-full px-3 py-2 text-sm text-left hover:bg-muted/50 flex items-center gap-2"
                        >
                          <Edit3 className="size-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => { onArchive?.(job._id); setOpenMenu(null); }}
                          className="w-full px-3 py-2 text-sm text-left hover:bg-muted/50 flex items-center gap-2"
                        >
                          <Archive className="size-4" />
                          Archive
                        </button>
                        <hr className="my-1 border-border" />
                        <button
                          onClick={() => { onArchive?.(job._id); setOpenMenu(null); }}
                          className="w-full px-3 py-2 text-sm text-left hover:bg-destructive/10 text-destructive flex items-center gap-2"
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>

      {jobs.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No jobs posted yet. Create your first job to start matching.
        </div>
      )}
    </div>
  );
}
