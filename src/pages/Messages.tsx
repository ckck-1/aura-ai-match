import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Search, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { chatApi } from "@/lib/mock-api";

export default function Messages() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: threads = [] } = useQuery({ queryKey: ["threads"], queryFn: () => chatApi.listThreads() });

  // Auto-pick first thread
  useEffect(() => {
    if (!threadId && threads.length) navigate(`/messages/${threads[0]._id}`, { replace: true });
  }, [threadId, threads, navigate]);

  const activeId = threadId ?? threads[0]?._id;
  const { data: convo } = useQuery({
    queryKey: ["thread", activeId],
    queryFn: () => chatApi.getThread(activeId!),
    enabled: !!activeId,
  });

  const send = useMutation({
    mutationFn: () => chatApi.send(activeId!, draft.trim()),
    onSuccess: () => {
      setDraft("");
      qc.invalidateQueries({ queryKey: ["thread", activeId] });
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [convo?.messages.length]);

  const filtered = threads.filter((t) => t.withName.toLowerCase().includes(filter.toLowerCase()));

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
          <Sparkles className="size-3.5 text-liquid" /> Messages
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-6">
          Direct <span className="text-liquid">conversations</span>
        </h1>
      </motion.div>

      <div className="grid md:grid-cols-[320px_1fr] gap-5 h-[70vh]">
        {/* Thread list */}
        <aside className="glass-strong rounded-3xl p-3 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search people"
              className="bg-transparent text-sm flex-1 focus:outline-none"
            />
          </div>
          <div className="mt-2 flex-1 overflow-y-auto pr-1 space-y-1">
            {filtered.map((t) => {
              const active = t._id === activeId;
              return (
                <Link
                  key={t._id}
                  to={`/messages/${t._id}`}
                  className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${
                    active ? "bg-foreground/5" : "hover:bg-foreground/[0.03]"
                  }`}
                >
                  <div className="size-10 rounded-xl bg-[var(--gradient-liquid)] flex items-center justify-center font-display font-bold text-primary-foreground shrink-0 text-sm">
                    {t.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2 items-baseline">
                      <span className="font-medium text-sm truncate">{t.withName}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{t.lastAt}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{t.lastMessage}</p>
                  </div>
                  {t.unread > 0 && (
                    <span className="size-5 rounded-full bg-[var(--gradient-liquid)] text-[10px] font-bold text-primary-foreground flex items-center justify-center shrink-0">
                      {t.unread}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Conversation */}
        <section className="glass-strong rounded-3xl flex flex-col overflow-hidden">
          {convo ? (
            <>
              <header className="flex items-center gap-3 px-6 py-4 border-b border-border/50">
                <div className="size-10 rounded-xl bg-[var(--gradient-liquid)] flex items-center justify-center font-display font-bold text-primary-foreground text-sm">
                  {convo.thread.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{convo.thread.withName}</div>
                  <div className="text-xs text-muted-foreground truncate">{convo.thread.subtitle}</div>
                </div>
                <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-muted/60 text-muted-foreground">
                  {convo.thread.withRole}
                </span>
              </header>

              <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
                <AnimatePresence initial={false}>
                  {convo.messages.map((m) => (
                    <motion.div
                      key={m._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          m.from === "me"
                            ? "bg-[var(--gradient-liquid)] text-primary-foreground rounded-br-md"
                            : "bg-muted/60 text-foreground rounded-bl-md"
                        }`}
                      >
                        {m.text}
                        <div className={`text-[10px] mt-1 opacity-70 ${m.from === "me" ? "text-primary-foreground" : "text-muted-foreground"}`}>
                          {m.at}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (draft.trim()) send.mutate();
                }}
                className="p-3 border-t border-border/50 flex items-center gap-2"
              >
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Message ${convo.thread.withName.split(" ")[0]}…`}
                  className="flex-1 bg-background/40 border border-border rounded-full px-5 py-3 text-sm focus:outline-none focus:border-foreground/30"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || send.isPending}
                  className="btn-liquid !px-5 !py-3 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 grid place-items-center text-sm text-muted-foreground">Select a conversation</div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
