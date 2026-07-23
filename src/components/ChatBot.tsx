import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Who is Abdul Kasim?",
  "What projects has he built?",
  "What are his skills?",
  "How can I contact him?",
  "Tell me about his experience",
];

const INITIAL: Msg = {
  role: "assistant",
  content:
    "👋 Hi! I'm **Kasim AI** — ask me anything about Abdul's projects, skills, experience, or how to get in touch.",
};

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([INITIAL]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    const next = [...messages, { role: "user", content: q } as Msg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.reply ?? data.error ?? "Something went wrong.",
        },
      ]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Network error — please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  return (
    <>
      <motion.button
        aria-label={open ? "Close chat" : "Open chat with Kasim AI"}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[60] h-14 w-14 rounded-full bg-accent text-accent-foreground shadow-2xl shadow-accent/40 grid place-items-center hover:scale-105 transition-transform"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute inset-0 rounded-full bg-accent/50 animate-ping -z-10" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Kasim AI chat"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="fixed bottom-24 right-4 sm:right-6 z-[60] w-[calc(100vw-2rem)] sm:w-[380px] h-[540px] max-h-[80vh] rounded-2xl border border-border-soft bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 border-b border-border-soft bg-gradient-to-r from-accent/15 to-transparent">
              <div className="h-9 w-9 rounded-full bg-accent/20 text-accent grid place-items-center">
                <Sparkles size={18} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground text-sm">Kasim AI</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  Ask about Abdul's portfolio
                </div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-accent text-accent-foreground rounded-br-sm"
                        : "bg-muted/60 text-foreground rounded-bl-sm"
                    }`}
                    dangerouslySetInnerHTML={{ __html: renderLite(m.content) }}
                  />
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted/60 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                    <Dot delay={0} />
                    <Dot delay={0.15} />
                    <Dot delay={0.3} />
                  </div>
                </div>
              )}
            </div>

            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => void send(s)}
                    className="text-xs px-2.5 py-1.5 rounded-full border border-border-soft bg-muted/40 hover:bg-accent/15 hover:border-accent/40 text-muted-foreground hover:text-accent transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={onSubmit} className="p-3 border-t border-border-soft flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything…"
                className="flex-1 bg-muted/40 border border-border-soft rounded-full px-4 py-2 text-sm outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 text-foreground placeholder:text-muted-foreground"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="h-9 w-9 rounded-full bg-accent text-accent-foreground grid place-items-center disabled:opacity-40 hover:scale-105 transition-transform"
                aria-label="Send"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="h-2 w-2 rounded-full bg-accent/70"
      animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 0.9, repeat: Infinity, delay }}
    />
  );
}

function renderLite(text: string): string {
  const esc = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return esc
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-black/30 text-accent text-[0.85em]">$1</code>')
    .replace(/\[(.+?)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-accent underline">$1</a>')
    .replace(/^- (.+)$/gm, "• $1");
}
