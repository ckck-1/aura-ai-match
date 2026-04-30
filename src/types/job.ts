export type Job = {
  _id: string;
  title: string;
  description: string;

  techStack: string[];

  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };

  jobType: "full-time" | "part-time" | "contract" | "internship";

  location: string;

  status: "open" | "closed" | "paused";

  createdAt?: string;

  startupId:
    | {
        _id: string;
        companyName: string;
        logoUrl: string;
      }
    | string;
};