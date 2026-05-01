import api from "@/lib/api";
import type { Job } from "@/types/job";

export const jobsApi = {
  list: async (params?: { q?: string; tech?: string }): Promise<Job[]> => {
    const res = await api.get("/api/v1/jobs/feed", { params });
    return res.data?.data?.jobs || [];
  },

  

 

  // Keep this if you still want the "Apply via DM" shortcut elsewhere
  applyViaDM: async (jobId: string) => {
    const response = await api.post(`/api/v1/messages/apply/${jobId}`);
    return response.data;
  },

  // Add these to your existing jobsApi object
getById: async (jobId: string): Promise<Job> => {
  try {
    const res = await api.get(`/api/v1/jobs/${jobId}`);
    // Check if the backend wraps the job in data.job or just data
    return res.data?.data?.job || res.data?.data || res.data;
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    throw error;
  }
},

submitApplication: async (data: { jobId: string; coverLetter: string; resumeSnapshot: string }) => {
  // Hits 'https://devdrop-ds91.onrender.com/api/v1/applications'
  const res = await api.post("/api/v1/applications", data);
  return res.data;
}
};