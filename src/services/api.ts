import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

// ==========================================
// 1. Types & Interfaces
// ==========================================

export interface User {
  _id: string;
  email: string;
  role: "developer" | "startup";
  isVerified: boolean;
  name?: string;
  lastLogin: string;
}

export interface Developer {
  _id: string;
  userId: string;
  fullName: string;
  title: string;
  bio: string;
  skills: string[];
  experienceYears: number;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  location: string;
  availability: "available" | "busy" | "hired" | "full-time" | "part-time";
  createdAt: string;
}

export interface Startup {
  _id: string;
  userId: string;
  companyName: string;
  website?: string;
  industry: string;
  companySize: "1-10" | "11-50" | "51-200" | "201+";
  bio: string;
  logoUrl?: string;
  contactCredits: number;
  createdAt: string;
}

export interface Job {
  _id: string;
  startupId: { _id: string; companyName: string; logoUrl?: string; industry?: string };
  title: string;
  description: string;
  techStack: string[];
  salaryRange: { min: number; max: number; currency: string };
  location: string;
  jobType: "full-time" | "part-time" | "contract" | "internship";
  status: "open" | "closed" | "paused";
  postedAt: string;
  applied?: boolean;
}

export interface Application {
  _id: string;
  jobId: string | Job;
  developerId: string | Developer;
  coverLetter: string;
  resumeSnapshot: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "accepted";
  createdAt: string;
}

// Generic Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ==========================================
// 2. API Services
// ==========================================

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api
      .post<ApiResponse<any>>("/api/v1/auth/login", credentials)
      .then((res) => res.data.data),

  register: (data: {
    email: string;
    password: string;
    role: string;
    name: string;
  }) =>
    api
      .post<ApiResponse<any>>("/api/v1/auth/register", data)
      .then((res) => res.data.data),

  refresh: (refreshToken: string) =>
    api
      .post("/api/v1/auth/refresh", { refreshToken })
      .then((res) => res.data.data),

  logout: () => api.post("/api/v1/auth/logout"),
};
export const usersApi = {
  getMe: () => 
    api.get<ApiResponse<User>>("/api/v1/users/me").then(res => res.data.data),
    
  updateSettings: (data: Partial<User>) =>
    api.patch<ApiResponse<User>>("/api/v1/users/update-settings", data).then(res => res.data.data),
};

export const developersApi = {
  getProfile: () => api.get<ApiResponse<Developer>>("/api/v1/developers/me").then(res => res.data.data),
  updateProfile: (data: Partial<Developer>) =>
    api.patch<ApiResponse<Developer>>("/api/v1/developers/me", data).then(res => res.data.data),
};

export const startupsApi = {
  getProfile: () => api.get<ApiResponse<Startup>>("/api/v1/startups/me").then(res => res.data.data),
  getPublicProfile: (id: string) => api.get<ApiResponse<Startup>>(`/api/v1/startups/${id}`).then(res => res.data.data),
  updateProfile: (data: Partial<Startup>) =>
    api.patch<ApiResponse<Startup>>("/api/v1/startups/me", data).then(res => res.data.data),
};

export const jobsApi = {
  getFeed: (page = 1, limit = 20, filters?: { q?: string; tech?: string }) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters?.q) params.append("q", filters.q);
    if (filters?.tech) params.append("tech", filters.tech);
    return api.get<ApiResponse<{ jobs: Job[]; pagination: any }>>(`/api/v1/jobs/feed?${params}`).then(res => res.data.data);
  },

  getJob: (id: string) => api.get<ApiResponse<Job>>(`/api/v1/jobs/${id}`).then(res => res.data.data),

  createJob: (data: Partial<Job>) => api.post<ApiResponse<Job>>("/api/v1/jobs", data).then(res => res.data.data),

  updateJob: (id: string, data: Partial<Job>) =>
    api.patch<ApiResponse<Job>>(`/api/v1/jobs/${id}`, data).then(res => res.data.data),
};

export const applicationsApi = {
  applyToJob: (data: { jobId: string; coverLetter: string; resumeSnapshot: string }) =>
    api.post<ApiResponse<Application>>("/api/v1/applications", data).then(res => res.data.data),

  getMyApplications: (page = 1, limit = 10) =>
    api.get<ApiResponse<{ applications: Application[] }>>(`/api/v1/applications/my-apps?page=${page}&limit=${limit}`).then(res => res.data.data),

  getJobApplicants: (jobId: string, page = 1, limit = 20) =>
    api.get<ApiResponse<{ applications: Application[] }>>(`/api/v1/applications/job/${jobId}?page=${page}&limit=${limit}`).then(res => res.data.data),

  updateStatus: (id: string, status: string) =>
    api.patch<ApiResponse<Application>>(`/api/v1/applications/${id}/status`, { status }).then(res => res.data.data),
};

export const paymentsApi = {
  createCheckoutSession: (credits: number) =>
    api.post<ApiResponse<{ url: string }>>("/api/v1/payments/create-checkout", { credits }).then(res => res.data.data),
};

// ==========================================
// 3. TanStack Query Hooks
// ==========================================

export function useDeveloperProfile() {
  return useQuery({
    queryKey: ["developer", "profile"],
    queryFn: developersApi.getProfile,
    retry: false,
  });
}

export function useUpdateDeveloperProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: developersApi.updateProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["developer", "profile"] }),
  });
}

export function useStartupProfile() {
  return useQuery({
    queryKey: ["startup", "profile"],
    queryFn: startupsApi.getProfile,
    retry: false,
  });
}

export function useUpdateStartupProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startupsApi.updateProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["startup", "profile"] }),
  });
}

export function useJobsFeed(page = 1, filters?: { q?: string; tech?: string }) {
  return useQuery({
    queryKey: ["jobs", "feed", page, filters],
    queryFn: () => jobsApi.getFeed(page, 20, filters),
  });
}

export function useJob(jobId: string) {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: () => jobsApi.getJob(jobId),
    enabled: !!jobId,
  });
}

// ✅ ADDED: Create Job Mutation for Startups
export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: jobsApi.createJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

export function useMyJobs(page = 1) {
  return useQuery({
    queryKey: ["jobs", "my-jobs", page],
    queryFn: () => jobsApi.getFeed(page, 50), 
  });
}

export function useApplyToJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applicationsApi.applyToJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", "my"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", "feed"] });
    },
  });
}

export function useMyApplications(page = 1) {
  return useQuery({
    queryKey: ["applications", "my", page],
    queryFn: () => applicationsApi.getMyApplications(page),
  });
}

export function useJobApplicants(jobId: string, page = 1) {
  return useQuery({
    queryKey: ["job", jobId, "applicants", page],
    queryFn: () => applicationsApi.getJobApplicants(jobId, page),
    enabled: !!jobId, 
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => applicationsApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["job"] }),
  });
}

export function useBilling() {
  return useQuery({
    queryKey: ["billing"],
    queryFn: async () => {
      return {
        currentPlan: "Free",
        creditsRemaining: 47,
        invoices: [],
      };
    },
  });
}