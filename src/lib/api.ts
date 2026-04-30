import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://devdrop-ds91.onrender.com"; // ✅ FIXED

const TOKEN_KEY = "devdrop_tokens";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

/* =========================
   TOKEN HELPERS
========================= */

export const getTokens = (): Tokens | null => {
  try {
    const tokens = localStorage.getItem(TOKEN_KEY);
    return tokens ? JSON.parse(tokens) : null;
  } catch {
    return null;
  }
};

export const setTokens = (tokens: Tokens) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/* =========================
   AXIOS INSTANCE
========================= */

const api = axios.create({
  baseURL: API_BASE_URL, // ✅ FIXED BASE
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   REQUEST INTERCEPTOR
========================= */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokens = getTokens();

    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   REFRESH LOGIC
========================= */

let isRefreshing = false;
let queue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  queue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  queue = [];
};

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const tokens = getTokens();

    if (!tokens?.refreshToken) {
      handleLogout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((token: any) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/auth/refresh`,
        {
          refreshToken: tokens.refreshToken,
        }
      );

      const newTokens: Tokens = {
        accessToken: res.data.data.accessToken,
        refreshToken:
          res.data.data.refreshToken || tokens.refreshToken,
      };

      setTokens(newTokens);

      processQueue(null, newTokens.accessToken);

      originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      handleLogout();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

/* =========================
   LOGOUT HANDLER
========================= */

function handleLogout() {
  clearTokens();

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

export default api;