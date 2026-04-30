import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi, developersApi, startupsApi, applicationsApi, authApi } from '@/services/api';
import type { JobFeedResponse, ApplicationsResponse, AuthResponse } from '@/types';

// ==================== QUERIES ====================

export const useJobFeed = (page = 1, limit = 20) =>
  useQuery<JobFeedResponse>({
    queryKey: ['jobs', 'feed', page, limit],
    queryFn: () => jobsApi.getFeed(page, limit),
  });

export const useJob = (id: string, enabled = true) =>
  useQuery<Job>({
    queryKey: ['jobs', id],
    queryFn: () => jobsApi.getById(id),
    enabled,
  });

export const useDeveloperProfile = () =>
  useQuery<Developer>({
    queryKey: ['developer', 'profile'],
    queryFn: () => developersApi.getProfile(),
  });

export const useStartupProfile = () =>
  useQuery<Startup>({
    queryKey: ['startup', 'profile'],
    queryFn: () => startupsApi.getProfile(),
  });

export const useMyApplications = (page = 1, limit = 10) =>
  useQuery<ApplicationsResponse>({
    queryKey: ['applications', 'my', page, limit],
    queryFn: () => applicationsApi.getMyApplications(page, limit),
  });

export const useJobApplicants = (jobId: string, page = 1, limit = 20) =>
  useQuery<ApplicationsResponse>({
    queryKey: ['applicants', jobId, page, limit],
    queryFn: () => applicationsApi.getApplicants(jobId, page, limit),
    enabled: !!jobId,
  });

// ==================== MUTATIONS ====================

export const useUpdateDeveloperProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Developer>) => developersApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer', 'profile'] });
    },
  });
};

export const useUpdateStartupProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Startup>) => startupsApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['startup', 'profile'] });
    },
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Job>) => jobsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', 'feed'] });
    },
  });
};

export const useApplyToJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, coverLetter, resumeSnapshot }: { jobId: string; coverLetter?: string; resumeSnapshot?: string }) =>
      applicationsApi.apply(jobId, coverLetter, resumeSnapshot),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', 'my'] });
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: string }) =>
      applicationsApi.updateStatus(applicationId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['applicants', variables.applicationId] });
      queryClient.invalidateQueries({ queryKey: ['applications', 'my'] });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation<AuthResponse, Error, { email: string; password: string }>({
    mutationFn: ({ email, password }) => authApi.login(email, password),
    onSuccess: (data) => {
      // Store tokens
      const tokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
      localStorage.setItem('devdrop_tokens', JSON.stringify(tokens));
      // Optionally pre-fetch user data
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation<AuthResponse, Error, { email: string; password: string; role: string; name: string }>({
    mutationFn: ({ email, password, role, name }) => authApi.register(email, password, role, name),
    onSuccess: (data) => {
      const tokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
      localStorage.setItem('devdrop_tokens', JSON.stringify(tokens));
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: (refreshToken: string) => authApi.logout(refreshToken),
    onSuccess: () => {
      localStorage.removeItem('devdrop_tokens');
      window.location.href = '/login';
    },
  });
};

// ==================== HELPERS ====================

// Get current user from localStorage
export const getCurrentUser = (): { accessToken: string; refreshToken: string } | null => {
  try {
    const tokens = localStorage.getItem('devdrop_tokens');
    return tokens ? JSON.parse(tokens) : null;
  } catch {
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const tokens = getCurrentUser();
  if (!tokens) return false;
  // Optionally decode JWT and check expiry
  return true;
};
