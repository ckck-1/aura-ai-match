import api from "@/lib/api";
import type { Job } from "@/types/job";

export const jobsApi = {
  list: async (params?: { q?: string; tech?: string }): Promise<Job[]> => {
    // Matches your backend: res.json({ status: 'success', data: { jobs: [...] } })
    const res = await api.get("/api/v1/jobs/feed", { params });
    return res.data?.data?.jobs || [];
  },

  apply: async (jobId: string) => {
    // This hits: exports.applyToJob = async (req, res) => ...
    const response = await api.post(`/api/v1/messages/apply/${jobId}`);
    // We return the whole body which contains { thread, message }
    return response.data;
  }
};