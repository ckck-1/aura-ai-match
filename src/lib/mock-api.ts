// Mock API layer — mirrors the Node.js /api/v1 contracts.
// Swap with axios calls to VITE_API_BASE_URL when wiring the real backend.

export type TechTag = string;

export interface Job {
  _id: string;
  title: string;
  description: string;
  techStack: TechTag[];
  salaryRange: { min: number; max: number; currency: string };
  type: "full-time" | "part-time" | "contract" | "internship";
  location: string;
  status: "open" | "closed" | "paused";
  startup: { name: string; logo: string; stage: string };
  matchScore: number;
  postedAt: string;
}

export interface Developer {
  _id: string;
  name: string;
  handle: string;
  avatar: string;
  headline: string;
  bio: string;
  location: string;
  hourlyRate: number;
  availability: "available" | "busy" | "open-to-offers";
  matchScore: number;
  skills: { name: string; level: number }[];
  experience: { company: string; role: string; period: string; description: string }[];
  reviews: { author: string; company: string; rating: number; quote: string }[];
  stats: { projects: number; rating: number; responseHrs: number };
}

const TECH = ["React", "TypeScript", "Node.js", "Rust", "Go", "Python", "PostgreSQL", "Redis", "Kubernetes", "Solidity", "Three.js", "Mistral", "LangChain", "Stripe", "GraphQL", "Next.js"];
const STARTUPS = [
  { name: "Helion Labs", logo: "H", stage: "Series A" },
  { name: "Vector Forge", logo: "V", stage: "Seed" },
  { name: "Quanta Systems", logo: "Q", stage: "Series B" },
  { name: "Lumen AI", logo: "L", stage: "Pre-seed" },
  { name: "Obsidian Stack", logo: "O", stage: "Series A" },
  { name: "Nimbus Cloud", logo: "N", stage: "Series C" },
];

const pick = <T,>(arr: T[], n: number): T[] => [...arr].sort(() => 0.5 - Math.random()).slice(0, n);

const JOBS: Job[] = Array.from({ length: 14 }).map((_, i) => {
  const s = STARTUPS[i % STARTUPS.length];
  const min = 80 + Math.floor(Math.random() * 60);
  return {
    _id: `job_${i + 1}`,
    title: [
      "Senior AI Engineer",
      "Founding Frontend Engineer",
      "Staff Backend Engineer",
      "Infra / Platform Lead",
      "Full-Stack Engineer",
      "ML Research Engineer",
      "Smart Contract Engineer",
      "Developer Experience Lead",
    ][i % 8],
    description:
      "Join a tight-knit founding team shipping production AI infrastructure at scale. You'll own systems end-to-end, partner with research, and ship to thousands of customers in week one.",
    techStack: pick(TECH, 4),
    salaryRange: { min: min * 1000, max: (min + 60) * 1000, currency: "USD" },
    type: (["full-time", "contract", "full-time", "part-time"] as const)[i % 4],
    location: ["Remote", "San Francisco", "Berlin", "Remote (EU)", "New York"][i % 5],
    status: "open",
    startup: s,
    matchScore: 78 + Math.floor(Math.random() * 21),
    postedAt: `${1 + (i % 9)}d ago`,
  };
});

const DEVELOPERS: Developer[] = [
  {
    _id: "dev_1",
    name: "Aria Chen",
    handle: "ariachen",
    avatar: "AC",
    headline: "Staff AI Engineer · ex-Anthropic, ex-Stripe",
    bio: "I build production LLM systems with an obsession for latency and eval rigor. 8+ years shipping infra that powers millions of requests/day.",
    location: "San Francisco, CA",
    hourlyRate: 240,
    availability: "open-to-offers",
    matchScore: 96,
    skills: [
      { name: "Python", level: 98 },
      { name: "Rust", level: 84 },
      { name: "LangChain", level: 92 },
      { name: "Mistral", level: 88 },
      { name: "PostgreSQL", level: 90 },
      { name: "Kubernetes", level: 78 },
    ],
    experience: [
      { company: "Anthropic", role: "Staff Engineer, Inference", period: "2023 — 2025", description: "Led the inference platform team. Cut p99 latency by 42% across the Claude API." },
      { company: "Stripe", role: "Senior Engineer, Radar ML", period: "2019 — 2023", description: "Owned model serving for fraud detection across 200M+ daily decisions." },
      { company: "MIT CSAIL", role: "Research Engineer", period: "2017 — 2019", description: "Published on efficient transformer attention. 2 NeurIPS papers." },
    ],
    reviews: [
      { author: "Marcus Vale", company: "Helion Labs", rating: 5, quote: "Aria shipped our entire RAG pipeline in 3 weeks. Honestly the highest signal hire we've made." },
      { author: "Priya N.", company: "Lumen AI", rating: 5, quote: "Senior in every dimension. Communication, code, and judgment are all top-1%." },
      { author: "Theo R.", company: "Vector Forge", rating: 5, quote: "Replaced an entire team for us. Worth every dollar." },
    ],
    stats: { projects: 47, rating: 4.98, responseHrs: 2 },
  },
];

const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export const api = {
  async listJobs(filters?: { q?: string; tech?: string }): Promise<Job[]> {
    await wait();
    return JOBS.filter((j) => {
      if (filters?.q && !j.title.toLowerCase().includes(filters.q.toLowerCase())) return false;
      if (filters?.tech && !j.techStack.includes(filters.tech)) return false;
      return true;
    });
  },
  async getDeveloper(id: string): Promise<Developer> {
    await wait();
    return DEVELOPERS.find((d) => d._id === id) ?? DEVELOPERS[0];
  },
  async login(email: string, _password: string, role: "developer" | "startup") {
    await wait(600);
    return { token: "mock.jwt.token", user: { email, role, id: "u_1" } };
  },
  async register(data: { email: string; password: string; role: "developer" | "startup"; name: string }) {
    await wait(800);
    return { token: "mock.jwt.token", user: { email: data.email, role: data.role, id: "u_new" } };
  },
};

export const ALL_TECH = TECH;
