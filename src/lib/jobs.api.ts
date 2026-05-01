import api from "@/lib/api";
import type { Job } from "@/types/job";

// ✅ Helper: validate Mongo ObjectId
const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

export const jobsApi = {
  list: async (params?: { q?: string; tech?: string }): Promise<Job[]> => {
    const res = await api.get("/api/v1/jobs/feed", { params });
    return res.data?.data?.jobs || [];
  },

  applyViaDM: async (jobId: string) => {
    if (!isValidObjectId(jobId)) {
      throw new Error("Invalid jobId format (must be Mongo ObjectId)");
    }

    const response = await api.post(`/api/v1/messages/apply/${jobId}`);
    return response.data;
  },

  // ✅ GET JOB BY ID (SAFE EXTRACTION)
  getById: async (jobId: string): Promise<Job> => {
    if (!isValidObjectId(jobId)) {
      throw new Error("Invalid jobId format");
    }

    try {
      const res = await api.get(`/api/v1/jobs/${jobId}`);

      const job =
        res.data?.data?.job ||
        res.data?.data ||
        res.data;

      if (!job?._id) {
        throw new Error("Job not found or malformed response");
      }

      return job;
    } catch (error) {
      console.error("Error fetching job by ID:", error);
      throw error;
    }
  },

  // ✅ SUBMIT APPLICATION (STRICT + DEBUG)
  submitApplication: async (data: {
    jobId: string;
    coverLetter: string;
    resumeSnapshot: string;
  }) => {
    if (!isValidObjectId(data.jobId)) {
      console.error("❌ Invalid jobId being sent:", data.jobId);
      throw new Error("Invalid jobId format");
    }

    const payload = {
      jobId: data.jobId,
      coverLetter: data.coverLetter?.trim(),
      resumeSnapshot: data.resumeSnapshot,
    };

    console.log("🚀 Submitting application:", payload);

    try {
      const res = await api.post("/api/v1/applications", payload);
      return res.data;
    } catch (err: any) {
      console.error("❌ Application error:", err.response?.data || err);
      throw err;
    }
  },
};