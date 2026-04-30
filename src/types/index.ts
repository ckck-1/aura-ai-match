// Core user types matching backend models

export interface User {
  _id: string;
  email: string;
  role: 'developer' | 'startup' | 'admin';
  isVerified: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface Developer {
  _id: string;
  userId: string;
  fullName: string;
  title: string;
  skills: string[];
  experienceYears: number;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  availability: 'available' | 'busy' | 'hired' | 'full-time' | 'part-time' | 'contract' | 'internship' | 'not-available';
  dailyApplicationCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Startup {
  _id: string;
  userId: string;
  companyName: string;
  website?: string;
  industry?: string;
  companySize?: '1-10' | '11-50' | '51-200' | '201+';
  bio?: string;
  logoUrl?: string;
  isPremium: boolean;
  contactCredits: number;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  _id: string;
  startupId: string | Startup; 
  title: string;
  description: string;
  techStack: string[];
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  location: string;
  status: 'open' | 'closed' | 'paused';
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  _id: string;
  jobId: Job | string;
  developerId: Developer | string;
  startupId: Startup | string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
  coverLetter?: string;
  resumeSnapshot?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobFeedResponse {
  jobs: (Job & { startupId: Startup })[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApplicationsResponse {
  applications: (Application & { jobId: Job })[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth types
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string | null;
}
