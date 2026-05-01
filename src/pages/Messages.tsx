import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Send, Sparkles, Loader2, Building2 } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { messagesApi } from "@/lib/messages.api";

export default function Messages() {
  const { threadId } = useParams();
  const qc = useQueryClient();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Fetch all threads (Conversations list)
  const { data: threads = [], isLoading: threadsLoading } = useQuery({
    queryKey: ["threads"],
    queryFn: messagesApi.getThreads,
  });

  // 2. Determine Active Thread ID
  // If no ID in URL, default to the most recent thread
  const activeId = threadId || (threads.length > 0 ? threads[0]._id : null);

  // 3. Fetch specific Conversation messages
  const { data: convo, isLoading: messagesLoading } = useQuery({
    queryKey: ["thread", activeId],
    queryFn: () => messagesApi.getThread(activeId),
    enabled: !!activeId,
  });

  // 4. Send Message Mutation
  const sendMutation = useMutation({
    mutationFn: () => messagesApi.sendMessage(activeId!, draft),
    onSuccess: () => {
      setDraft("");
      // Refresh messages and the sidebar (to update last message preview)
      qc.invalidateQueries({ queryKey: ["thread", activeId] });
      qc.invalidateQueries({ queryKey: ["threads"] });
    },
  });

  // 5. Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [convo?.messages]);

  return (
    <AppShell>
      <div className="grid md:grid-cols-[320px_1fr] gap-6 h-[calc(100vh-180px)] min-h-[600px]">
        
        {/* SIDEBAR: THREAD LIST */}
        <aside className="glass-strong rounded-3xl flex flex-col overflow-hidden border border-white/5 shadow-2xl">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Sparkles className="size-3.5 text-liquid" /> Conversations
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {threadsLoading ? (
              <div className="flex flex-col gap-2 p-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 w-full rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : threads.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No conversations yet.
              </div>
            ) : (
              threads.map((t: any) => {
                const isActive = t._id === activeId;
                const companyName = t.jobId?.startupId?.companyName || "Hiring Team";
                
                return (
                  <Link
                    key={t._id}
                    to={`/messages/${t._id}`}
                    className={`group flex flex-col p-4 rounded-2xl transition-all border ${
                      isActive 
                        ? "bg-white/10 border-white/10 shadow-lg" 
                        : "border-transparent hover:bg-white/5"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm font-bold truncate ${isActive ? "text-foreground" : "text-foreground/80"}`}>
                        {companyName}
                      </span>
                      <span className="text-[10px] text-muted-foreground tabular-nums">
                        {t.lastMessage?.at || "Now"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground truncate opacity-70 group-hover:opacity-100 transition-opacity">
                      {t.jobId?.title || "Direct Message"}
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </aside>

        {/* MAIN: CHAT WINDOW */}
        <section className="glass-strong rounded-3xl flex flex-col overflow-hidden border border-white/5 shadow-2xl relative">
          
          {/* Chat Header */}
          {activeId && !messagesLoading && (
            <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
              <div className="size-10 rounded-full bg-liquid/20 border border-liquid/30 flex items-center justify-center">
                <Building2 className="size-5 text-liquid" />
              </div>
              <div>
                <h2 className="text-sm font-bold leading-none">
                  {convo?.jobId?.startupId?.companyName || "Founder / Hiring Manager"}
                </h2>
                <p className="text-[11px] text-muted-foreground mt-1 uppercase tracking-tighter">
                  Re: {convo?.jobId?.title}
                </p>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/10 custom-scrollbar">
            {messagesLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                <Loader2 className="animate-spin size-6 text-liquid" />
                <span className="text-xs font-medium uppercase tracking-widest">Decrypting messages</span>
              </div>
            ) : !activeId ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-10">
                <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <MessageSquare className="size-8 text-muted-foreground/40" />
                </div>
                <h3 className="font-display text-lg font-medium">Select a thread</h3>
                <p className="text-sm text-muted-foreground max-w-[240px] mt-2">
                  Choose a conversation from the sidebar to view your history.
                </p>
              </div>
            ) : (
              convo?.messages?.map((m: any) => {
                const isMe = m.senderRole === "candidate" || m.from === "me";
                return (
                  <div key={m._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                      isMe 
                        ? "bg-foreground text-background font-medium rounded-tr-none" 
                        : "bg-white/10 text-foreground border border-white/5 rounded-tl-none"
                    }`}>
                      {m.text}
                      <div className={`text-[9px] mt-1 opacity-50 ${isMe ? "text-right" : "text-left"}`}>
                        {m.at || "sent"}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Footer */}
          <form 
            onSubmit={(e) => { 
              e.preventDefault(); 
              if(draft.trim() && !sendMutation.isPending) sendMutation.mutate(); 
            }}
            className="p-4 bg-white/[0.03] border-t border-white/5 flex gap-3"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={!activeId || sendMutation.isPending}
              className="flex-1 bg-white/5 px-5 py-3 rounded-2xl outline-none text-sm border border-white/10 focus:border-liquid/50 focus:bg-white/[0.08] transition-all disabled:opacity-50"
              placeholder={activeId ? "Type your message..." : "Select a thread to chat"}
            />
            <button 
              type="submit"
              disabled={sendMutation.isPending || !draft.trim() || !activeId}
              className="bg-foreground text-background px-5 rounded-2xl disabled:opacity-30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center"
            >
              {sendMutation.isPending ? (
                <Loader2 className="animate-spin size-5" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </section>
      </div>
    </AppShell>
  );
}

// Add a quick icon import since it's used in the empty state
import { MessageSquare } from "lucide-react";