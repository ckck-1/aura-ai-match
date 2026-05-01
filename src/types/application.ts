// frontend/src/types/application.ts
import type { Job } from "./job";

export interface Application {
  _id: string;
  jobId: string | { 
    _id: string; 
    title: string;
    startupId?: { companyName: string; logoUrl: string }; 
  };
  developerId: string;
  threadId?: string; // New field from backend
  coverLetter: string;
  resumeSnapshot: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "accepted";
  createdAt: string;
}