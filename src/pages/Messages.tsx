import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { messagesApi } from "@/lib/messages.api";

export default function Messages() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Threads
  const { data: threads = [], isLoading: threadsLoading } = useQuery({
    queryKey: ["threads"],
    queryFn: messagesApi.getThreads,
  });

  // 2. Active ID Logic
  const activeId = threadId || (threads.length > 0 ? threads[0]._id : null);

  // 3. Fetch Conversation
  const { data: convo, isLoading: messagesLoading } = useQuery({
    queryKey: ["thread", activeId],
    queryFn: () => messagesApi.getThread(activeId),
    enabled: !!activeId,
  });

  // 4. Send Message
  const sendMutation = useMutation({
    mutationFn: () => messagesApi.sendMessage(activeId, draft),
    onSuccess: () => {
      setDraft("");
      qc.invalidateQueries({ queryKey: ["thread", activeId] });
      qc.invalidateQueries({ queryKey: ["threads"] });
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [convo?.messages]);

  return (
    <AppShell>
      <div className="grid md:grid-cols-[300px_1fr] gap-6 h-[80vh]">
        {/* SIDEBAR */}
        <aside className="glass-strong rounded-3xl flex flex-col overflow-hidden border border-white/5">
          <div className="p-4 border-b border-white/5 text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
            <Sparkles className="size-3 text-liquid" /> Conversations
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {threadsLoading ? (
              <div className="p-4 text-center"><Loader2 className="animate-spin mx-auto size-4" /></div>
            ) : threads.map((t: any) => (
              <Link
                key={t._id}
                to={`/messages/${t._id}`}
                className={`flex flex-col p-3 rounded-2xl transition-all ${
                  t._id === activeId ? "bg-white/10 border border-white/10" : "hover:bg-white/5"
                }`}
              >
                <span className="text-sm font-semibold truncate">
                  {t.jobId?.title || "Job Application"}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {t.lastMessage?.text || "Click to view chat"}
                </span>
              </Link>
            ))}
          </div>
        </aside>

        {/* CHAT */}
        <section className="glass-strong rounded-3xl flex flex-col overflow-hidden border border-white/5">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/10">
            {messagesLoading ? (
               <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" /></div>
            ) : convo?.messages?.map((m: any) => {
              const isMe = m.senderRole === "candidate";
              return (
                <div key={m._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                    isMe ? "bg-foreground text-background" : "bg-white/10 text-foreground"
                  }`}>
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); if(draft.trim()) sendMutation.mutate(); }}
            className="p-4 bg-black/20 border-t border-white/5 flex gap-2"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="flex-1 bg-white/5 px-4 py-2 rounded-full outline-none text-sm border border-white/10"
              placeholder="Write a message..."
            />
            <button 
              disabled={sendMutation.isPending || !draft.trim()}
              className="bg-foreground text-background p-2.5 rounded-full disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </section>
      </div>
    </AppShell>
  );
}