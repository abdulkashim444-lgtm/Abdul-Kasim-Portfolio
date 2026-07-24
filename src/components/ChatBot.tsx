import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Loader2, Sparkles, User, BookOpen } from "lucide-react";
import kasimAvatar from "@/assets/kasim-ai-avatar.png";

type Source = { section: string; quote: string };
type Msg = { role: "user" | "assistant"; content: string; time?: string; sources?: Source[] };

const SUGGESTIONS = [
  "Who is Abdul Kasim?",
  "Show me his best projects",
  "What tech stack does he use?",
  "How can I hire or contact him?",
];

const WELCOME: Msg = {
  role: "assistant",
  content:
    "👋 **Hey there! I'm Kasim AI** — Abdul's personal assistant.\n\nI can tell you about his **projects**, **skills**, **experience**, and how to **get in touch**. What would you like to know?",
};

function nowLabel(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ ...WELCOME, time: nowLabel() }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setUnread(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // Show a subtle "new" badge on first visit after 8s
  useEffect(() => {
    const t = setTimeout(() => !open && setUnread(true), 8000);
    return () => clearTimeout(t);
  }, [open]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    if (q.length > 1000) {
      setMessages((m) => [...m, { role: "assistant", content: "That message is too long — please keep it under 1000 characters.", time: nowLabel() }]);
      return;
    }
    const next: Msg[] = [...messages, { role: "user", content: q, time: nowLabel() }];
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
      const raw = data.reply ?? data.error ?? "Something went wrong.";
      const { content, sources } = extractSources(raw);
      setMessages((m) => [
        ...m,
        { role: "assistant", content, sources, time: nowLabel() },
      ]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Network error — please try again.", time: nowLabel() }]);
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
      {/* Floating launcher */}
      <motion.button
        aria-label={open ? "Close chat" : "Open chat with Kasim AI"}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[60] h-14 w-14 rounded-full bg-gradient-to-br from-accent to-accent/70 text-accent-foreground shadow-2xl shadow-accent/40 grid place-items-center hover:scale-105 transition-transform"
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
        {!open && <span className="absolute inset-0 rounded-full bg-accent/50 animate-ping -z-10" />}
        {!open && unread && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold grid place-items-center text-white ring-2 ring-background">
            1
          </span>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Kasim AI chat"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            className="fixed bottom-24 right-4 sm:right-6 z-[60] w-[calc(100vw-2rem)] sm:w-[400px] h-[600px] max-h-[85vh] rounded-3xl border border-border-soft bg-background/95 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-4 border-b border-border-soft bg-gradient-to-br from-accent/20 via-accent/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-accent to-accent/60 grid place-items-center text-accent-foreground shadow-lg shadow-accent/30">
                    <Bot size={20} />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                    Kasim AI
                    <Sparkles size={12} className="text-accent" />
                  </div>
                  <div className="text-xs text-muted-foreground">Online • Typically replies instantly</div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="h-8 w-8 rounded-full hover:bg-muted/60 grid place-items-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((m, i) => (
                <MessageBubble key={i} msg={m} />
              ))}
              {loading && <TypingIndicator />}
            </div>

            {/* Suggestions — reappear after every assistant answer */}
            {!loading && messages[messages.length - 1]?.role === "assistant" && (
              <div className="px-4 pb-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">
                  {messages.length <= 1 ? "Suggested" : "Suggested follow-ups"}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s, i) => (
                    <motion.button
                      key={s}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => void send(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border-soft bg-muted/40 hover:bg-accent/15 hover:border-accent/50 text-muted-foreground hover:text-accent transition-colors"
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Composer */}
            <form onSubmit={onSubmit} className="p-3 border-t border-border-soft bg-background/60">
              <div className="flex items-center gap-2 rounded-full border border-border-soft bg-muted/40 focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/20 transition-all pl-4 pr-1.5 py-1.5">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, 1000))}
                  placeholder="Ask about projects, skills, contact…"
                  className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                  disabled={loading}
                  maxLength={1000}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="h-8 w-8 rounded-full bg-accent text-accent-foreground grid place-items-center disabled:opacity-40 disabled:cursor-not-allowed hover:scale-110 active:scale-95 transition-transform"
                  aria-label="Send"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </div>
              <div className="text-[10px] text-muted-foreground/70 mt-1.5 text-center">
                Powered by Abdul Kasim • {input.length}/1000
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MessageBubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 22, stiffness: 260 }}
      className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`h-7 w-7 rounded-full grid place-items-center shrink-0 mt-0.5 ${
          isUser
            ? "bg-muted/60 text-muted-foreground"
            : "bg-gradient-to-br from-accent to-accent/60 text-accent-foreground shadow-md shadow-accent/20"
        }`}
      >
        {isUser ? <User size={13} /> : <Bot size={13} />}
      </div>
      <div className={`flex flex-col max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
            isUser
              ? "bg-accent text-accent-foreground rounded-2xl rounded-tr-md"
              : "bg-muted/70 text-foreground rounded-2xl rounded-tl-md border border-border-soft/50"
          }`}
          dangerouslySetInnerHTML={{ __html: renderLite(msg.content) }}
        />
        {!isUser && msg.sources && msg.sources.length > 0 && (
          <div className="mt-1.5 flex flex-col gap-1 max-w-full">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground/80 font-semibold">
              <BookOpen size={10} /> Sources
            </div>
            <div className="flex flex-wrap gap-1">
              {msg.sources.map((s, i) => (
                <span
                  key={i}
                  title={s.quote}
                  className="text-[10px] px-2 py-0.5 rounded-full border border-accent/30 bg-accent/10 text-accent/90 max-w-[240px] truncate"
                >
                  <span className="font-semibold">{s.section}</span>
                  {s.quote && <span className="opacity-70"> — {s.quote}</span>}
                </span>
              ))}
            </div>
          </div>
        )}
        {msg.time && (
          <div className="text-[10px] text-muted-foreground/60 mt-1 px-1">{msg.time}</div>
        )}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2 items-end"
    >
      <div className="h-7 w-7 rounded-full grid place-items-center bg-gradient-to-br from-accent to-accent/60 text-accent-foreground shadow-md shadow-accent/20">
        <Bot size={13} />
      </div>
      <div className="bg-muted/70 border border-border-soft/50 rounded-2xl rounded-tl-md px-4 py-3 flex gap-1 items-center">
        <Dot delay={0} />
        <Dot delay={0.15} />
        <Dot delay={0.3} />
        <span className="ml-2 text-[11px] text-muted-foreground">Kasim AI is typing…</span>
      </div>
    </motion.div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="h-1.5 w-1.5 rounded-full bg-accent"
      animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 0.9, repeat: Infinity, delay }}
    />
  );
}

// Minimal safe markdown-ish renderer (escapes HTML first, then applies allowlisted patterns)
function renderLite(text: string): string {
  const esc = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  return esc
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(?!\s)(.+?)(?<!\s)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-black/30 text-accent text-[0.85em]">$1</code>')
    .replace(
      /\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent underline underline-offset-2 hover:opacity-80">$1</a>',
    )
    .replace(/^- (.+)$/gm, "• $1");
}

const ALLOWED = new Set(["About", "Experience", "Projects", "Skills", "Certifications", "Contact"]);

function extractSources(raw: string): { content: string; sources: Source[] } {
  const match = raw.match(/\[\[sources:\s*([^\]]+)\]\]\s*$/i);
  if (!match) return { content: raw.trim(), sources: [] };
  const content = raw.slice(0, match.index).trim();
  const body = match[1].trim();
  if (/^none$/i.test(body)) return { content, sources: [] };
  const sources: Source[] = [];
  for (const part of body.split(";")) {
    const [sectionRaw, ...rest] = part.split("|");
    const section = sectionRaw?.trim();
    if (!section || !ALLOWED.has(section)) continue;
    const quote = rest.join("|").trim().replace(/^["'"]|["'"]$/g, "").slice(0, 120);
    sources.push({ section, quote });
  }
  return { content, sources };
}
