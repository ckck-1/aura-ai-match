import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Send, Sparkles, Loader2, Building2, MessageSquare } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { messagesApi } from "@/lib/messages.api";

export default function Messages() {
  const { threadId } = useParams();
  const qc = useQueryClient();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: threads = [], isLoading: threadsLoading } = useQuery({
    queryKey: ["threads"],
    queryFn: messagesApi.getThreads,
  });

  const activeId = threadId || (threads.length > 0 ? threads[0]._id : null);

  const { data: convo, isLoading: messagesLoading } = useQuery({
    queryKey: ["thread", activeId],
    queryFn: () => messagesApi.getThread(activeId),
    enabled: !!activeId,
  });

  const sendMutation = useMutation({
    mutationFn: () => messagesApi.sendMessage(activeId!, draft),
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
      {/* BACKGROUND - overflow-hidden prevents the blobs from causing scroll */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-white via-[#eef3ff] to-[#0a1a3f] overflow-hidden">
        <div className="absolute -top-40 -left-40 size-[520px] rounded-full bg-[#0a1a3f]/25 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 size-[600px] rounded-full bg-white/40 blur-[160px]" />
      </div>

      {/* MAIN WRAPPER - overflow-x-hidden to kill horizontal scroll */}
      <div className="relative z-10 px-4 md:px-6 w-full overflow-x-hidden">
        <div className="mx-auto max-w-6xl w-full">

          {/* RESPONSIVE LAYOUT */}
          <div className="
            flex flex-col md:grid 
            md:grid-cols-[320px_1fr] 
            gap-4 md:gap-6 
            h-auto md:h-[calc(100vh-180px)]
            w-full
          ">

            {/* SIDEBAR */}
            <aside className="
              glass-strong rounded-3xl 
              flex flex-col 
              overflow-hidden 
              border border-white/10
              max-h-[40vh] md:max-h-none
            ">
              <div className="p-4 md:p-5 border-b border-white/10 flex items-center gap-2">
                <Sparkles className="size-3.5 text-[#0a1a3f]" />
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Conversations
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 md:p-3 space-y-2">
                {threadsLoading ? (
                  <div className="space-y-2 p-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-14 rounded-2xl bg-white/10 animate-pulse" />
                    ))}
                  </div>
                ) : threads.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
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
                        className={`
                          flex flex-col p-3 md:p-4 rounded-2xl transition border
                          ${isActive
                            ? "bg-white/15 border-white/20"
                            : "border-transparent hover:bg-white/10"}
                        `}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-sm font-semibold truncate">
                            {companyName}
                          </span>
                          <span className="text-[10px] text-muted-foreground shrink-0 mt-1">
                            {t.lastMessage?.at || "Now"}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground truncate">
                          {t.jobId?.title}
                        </span>
                      </Link>
                    );
                  })
                )}
              </div>
            </aside>

            {/* CHAT */}
            <section className="
              glass-strong rounded-3xl 
              flex flex-col overflow-hidden 
              border border-white/10
              min-h-[60vh] md:min-h-0
            ">

              {/* HEADER */}
              {activeId && (
                <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
                  <div className="size-9 md:size-10 rounded-full bg-[#0a1a3f]/10 border border-[#0a1a3f]/20 flex items-center justify-center">
                    <Building2 className="size-5 text-[#0a1a3f]" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold truncate">
                      {convo?.jobId?.startupId?.companyName || "Hiring Team"}
                    </h2>
                    <p className="text-[11px] text-muted-foreground truncate">
                      Re: {convo?.jobId?.title}
                    </p>
                  </div>
                </div>
              )}

              {/* MESSAGES */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-white/5"
              >
                {messagesLoading ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Loader2 className="animate-spin size-6 text-[#0a1a3f]" />
                  </div>
                ) : !activeId ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare className="size-8 md:size-10 text-muted-foreground mb-3" />
                    <h3 className="font-semibold">Select a thread</h3>
                  </div>
                ) : (
                  convo?.messages?.map((m: any) => {
                    const isMe = m.senderRole === "candidate" || m.from === "me";

                    return (
                      <div key={m._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`
                          max-w-[85%] md:max-w-[75%]
                          px-4 py-3 rounded-2xl text-sm
                          ${isMe
                            ? "bg-[#0a1a3f] text-white rounded-tr-none"
                            : "bg-white/15 border border-white/10 rounded-tl-none"}
                        `}>
                          <p className="break-words">{m.text}</p>
                          <div className="text-[9px] mt-1 opacity-60">
                            {m.at || "sent"}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* INPUT */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (draft.trim() && !sendMutation.isPending) sendMutation.mutate();
                }}
                className="p-3 md:p-4 bg-white/5 border-t border-white/10 flex gap-2 md:gap-3"
              >
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  disabled={!activeId || sendMutation.isPending}
                  className="flex-1 bg-white/10 px-4 py-3 rounded-2xl text-sm outline-none border border-white/10 focus:border-[#0a1a3f]/40 min-w-0"
                  placeholder={activeId ? "Type your message..." : "Select a thread"}
                />

                <button
                  type="submit"
                  disabled={!draft.trim() || sendMutation.isPending || !activeId}
                  className="bg-[#0a1a3f] text-white px-4 md:px-5 rounded-2xl flex items-center justify-center shrink-0 transition-opacity disabled:opacity-50"
                >
                  {sendMutation.isPending ? (
                    <Loader2 className="animate-spin size-4" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </form>

            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}