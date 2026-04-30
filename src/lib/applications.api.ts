import api from "@/lib/api";
import type { Application } from "@/types/application";

export const applicationsApi = {
  list: async (): Promise<Application[]> => {
    const res = await api.get("/api/v1/applications/my-apps");

    return res.data.data.applications;
  },
};