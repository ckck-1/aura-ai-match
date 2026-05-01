import api from "./api";

export const messagesApi = {
  // Get all conversation threads for the logged-in user
  getThreads: async () => {
    // PREVIOUSLY: "/messages/threads" -> Caused 404
    const res = await api.get("/api/v1/messages/threads");
    return res.data;
  },

  // Get a specific thread and its messages
  getThread: async (threadId: string | null) => {
    if (!threadId) return null;
    // PREVIOUSLY: "/messages/thread/${threadId}" -> Caused 404
    const res = await api.get(`/api/v1/messages/thread/${threadId}`);
    return res.data;
  },

  // Send a new message in a thread
  sendMessage: async (threadId: string | null, text: string) => {
    if (!threadId) return null;
    const res = await api.post(`/api/v1/messages/send`, {
      threadId,
      text,
    });
    return res.data;
  },
};