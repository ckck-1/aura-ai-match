export interface Application {
  _id: string;

  jobId:
    | string
    | {
        _id: string;
        title: string;
      };

  developerId: string;

  coverLetter: string;
  resumeSnapshot: string;

  status:
    | "pending"
    | "reviewed"
    | "shortlisted"
    | "rejected"
    | "accepted";

  createdAt: string;
}