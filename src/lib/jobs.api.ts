import api from "@/lib/api";
import type { Job } from "@/types/job";

export const jobsApi = {
  list: async (params?: { q?: string; tech?: string }): Promise<Job[]> => {
    const res = await api.get("/api/v1/jobs/feed", { params });

    return res.data.data.jobs;
  },
};