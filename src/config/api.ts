/**
 * DevDrop API Configuration
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://devdrop-ds91.onrender.com';

export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/api/v1/auth/register',
  AUTH_LOGIN: '/api/v1/auth/login',
  AUTH_LOGOUT: '/api/v1/auth/logout',
  AUTH_REFRESH: '/api/v1/auth/refresh',
  AUTH_VERIFY_EMAIL: '/api/v1/auth/verify-email',

  // Users
  USERS_ME: '/api/v1/users/me',
  USERS_UPDATE_SETTINGS: '/api/v1/users/update-settings',

  // Developers
  DEVELOPERS_ME: '/api/v1/developers/me',

  // Startups
  STARTUPS_ME: '/api/v1/startups/me',
  STARTUP_BY_ID: (id: string) => `/api/v1/startups/${id}`,

  // Jobs
  JOBS_FEED: '/api/v1/jobs/feed',
  JOB_BY_ID: (id: string) => `/api/v1/jobs/${id}`,
  JOBS_CREATE: '/api/v1/jobs/',

  // Applications
  APPLICATIONS_CREATE: '/api/v1/applications',
  APPLICATIONS_MY_APPS: '/api/v1/applications/my-apps',
  APPLICATIONS_JOB_APPLICANTS: (jobId: string) => `/api/v1/applications/job/${jobId}`,
  APPLICATIONS_UPDATE_STATUS: (id: string) => `/api/v1/applications/${id}/status`,

  // Payments
  PAYMENTS_CHECKOUT: '/api/v1/payments/create-checkout',
} as const;
