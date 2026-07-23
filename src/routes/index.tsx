import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useTransform, AnimatePresence, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight, Download, Github, Linkedin, Mail, MapPin, ExternalLink,
  Terminal, Code2, Cpu, Trophy, Briefcase, Calendar, X, Award, ShieldCheck,
  Layout, Server, Brain, BarChart, Database, Sparkles, CheckCircle2, LifeBuoy, Send, Loader2,
  Instagram, Heart,
} from "lucide-react";
import { z } from "zod";
import { Toaster, toast } from "sonner";
import profileAsset from "@/assets/profile.png.asset.json";
import analyticsDashboardImg from "@/assets/project-analytics-dashboard.jpg";
import cvObjectDetectionImg from "@/assets/project-cv-object-detection.jpg";
import { ChatBot } from "@/components/ChatBot";

const RESUME_URL = "/Abdul_Kasim_Resume.pdf";

export const Route = createFileRoute("/")({
  component: Portfolio,
  head: () => ({
    meta: [
      { title: "Abdul Kasim — AI Engineer & Full Stack Developer" },
      { name: "description", content: "Portfolio of Abdul Kasim: AI, ML, data analytics and modern web engineering." },
      { property: "og:title", content: "Abdul Kasim — AI Engineer & Full Stack Developer" },
      { property: "og:description", content: "Portfolio of Abdul Kasim: AI, ML, data analytics and modern web engineering." },
    ],
  }),
});

const ROLES = ["AI Engineer", "Full Stack Developer", "Data Analyst", "Software Engineer"];

const STATS = [
  { label: "Projects Completed", value: "15+", icon: Code2 },
  { label: "LeetCode Solved", value: "2250+", icon: Terminal },
  { label: "Certifications", value: "10+", icon: Trophy },
  { label: "Internships", value: "4", icon: Cpu },
];

const EXPERIENCES = [
  { company: "Apexsquare Solutions", role: "Front End Developer Intern", period: "Apr 2026 – May 2026",
    description: "Built responsive React interfaces, integrated REST APIs and improved perceived performance across product surfaces." },
  { company: "Alfido Tech", role: "Artificial Intelligence Intern", period: "Mar 2026 – Apr 2026",
    description: "Delivered exploratory analysis and predictive models with Python, Pandas & Scikit-learn for real-world use cases." },
  { company: "JPMorgan Chase & Co.", role: "Software Engineering Virtual Experience", period: "2026",
    description: "REST API integration, Kafka event streaming and backend services in a simulated production environment." },
  { company: "Quantium", role: "Data Analytics Virtual Intern", period: "2026",
    description: "Customer segmentation and behavior analysis producing strategic recommendations for retail optimization." },
];

type Project = {
  title: string;
  category: "AI/ML" | "Full Stack" | "Data" | "Computer Vision";
  description: string;
  longDescription: string;
  highlights: string[];
  image: string;
  tech: string[];
  github: string;
  live: string;
  year: string;
};

const PROJECTS: Project[] = [
  {
    title: "AI-Powered Fake News Detection",
    category: "AI/ML",
    description: "End-to-end ML + NLP system identifying fraudulent news with 85% accuracy.",
    longDescription:
      "A production-grade NLP pipeline that ingests news articles, extracts linguistic and semantic features, and classifies credibility in real time. Ships with a Flask REST API and a polished React dashboard for analysts.",
    highlights: [
      "85% classification accuracy on held-out data",
      "TF-IDF + transformer embeddings hybrid model",
      "Sub-200ms inference behind a Flask REST API",
      "Responsive React dashboard with explainability",
    ],
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1200",
    tech: ["Python", "Flask", "NLP", "React", "Scikit-learn"],
    github: "https://github.com/abdulkashim444-lgtm/AI-FakeNews-Detector",
    live: "https://super-pie-620efd.netlify.app/",
    year: "2026",
  },
  {
    title: "Real-Time Analytics Dashboard",
    category: "Data",
    description: "Full-stack analytics processing thousands of daily events with D3.js visualizations.",
    longDescription:
      "Event-driven analytics platform with an automated ETL pipeline, PostgreSQL warehouse, and a React + D3.js frontend delivering interactive drilldowns across millions of records.",
    highlights: [
      "Automated ETL processing 10k+ events/day",
      "Dynamic D3.js dashboards with drilldowns",
      "PostgreSQL warehouse with partitioning",
      "Role-based access and shareable reports",
    ],
    image: analyticsDashboardImg,
    tech: ["Python", "Pandas", "D3.js", "React", "PostgreSQL"],
    github: "https://github.com/abdulkashim444-lgtm/Real-time-data-analytics-dashboard",
    live: "https://resonant-profiterole-1413f2.netlify.app/",
    year: "2026",
  },
  {
    title: "Computer Vision Object Detection",
    category: "Computer Vision",
    description: "Real-time YOLOv8 detection at 20 FPS on standard hardware with TensorRT.",
    longDescription:
      "Optimized YOLOv8 inference pipeline with TensorRT acceleration, streaming video ingestion via OpenCV, and a lightweight React viewer for live annotated feeds.",
    highlights: [
      "20 FPS on commodity GPU with TensorRT",
      "OpenCV streaming ingest + multi-source",
      "Custom-trained on domain dataset",
      "Live annotated web viewer",
    ],
    image: cvObjectDetectionImg,
    tech: ["YOLOv8", "TensorRT", "OpenCV", "Python", "React"],
    github: "https://github.com/abdulkashim444-lgtm/Computer-Vision-Object-Detection-System",
    live: "https://venerable-capybara-7b2f7c.netlify.app/",
    year: "2026",
  },
  {
    title: "Customer Segmentation Engine",
    category: "Data",
    description: "Unsupervised ML segmenting retail customers to unlock strategic marketing.",
    longDescription:
      "Behavioral segmentation of retail customers using K-Means and RFM analysis, surfacing actionable personas and lifetime-value tiers used to drive marketing spend.",
    highlights: [
      "RFM + K-Means with silhouette tuning",
      "Interactive persona explorer",
      "Lifted campaign ROI in simulations",
      "Reproducible notebook-to-dashboard flow",
    ],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    tech: ["Python", "Pandas", "Scikit-learn", "Plotly"],
    github: "https://github.com/abdulkashim444-lgtm/Behavioral-customer-segmentation",
    live: "https://behavioral-customer-segmentation.lovable.app",
    year: "2026",
  },
  {
    title: "Support Desk — Helpdesk Platform",
    category: "Full Stack",
    description: "Full-stack MERN helpdesk with authentication, ticketing and role-based dashboards.",
    longDescription:
      "A production-style customer support platform: users register, raise tickets across products, and track resolution in real time. JWT auth, protected routes, an admin surface, and a polished React UI built for speed and clarity.",
    highlights: [
      "JWT authentication with protected API + client routes",
      "Ticket lifecycle: create, view, close, add notes",
      "Role-based dashboards for users and support staff",
      "MongoDB + Express REST API with clean service layer",
    ],
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=1200",
    tech: ["React", "Node.js", "Express", "MongoDB", "JWT"],
    github: "https://github.com/abdulkashim444-lgtm/Support-Desk",
    live: "#",
    year: "2026",
  },
];

const PROJECT_CATEGORIES = ["All", "AI/ML", "Full Stack", "Data", "Computer Vision"] as const;


const CERTIFICATIONS = [
  { title: "Machine Learning Specialization", issuer: "Coursera · Stanford / DeepLearning.AI", year: "2026", icon: Brain },
  { title: "Software Engineering Virtual Experience", issuer: "JPMorgan Chase & Co.", year: "2026", icon: ShieldCheck },
  { title: "Data Analytics Virtual Internship", issuer: "Quantium", year: "2026", icon: BarChart },
  { title: "Artificial Intelligence Internship", issuer: "Alfido Tech", year: "2026", icon: Cpu },
  { title: "Front End Developer Internship", issuer: "Apexsquare Solutions", year: "2026", icon: Layout },
  { title: "Problem Solving (2250+ Solved)", issuer: "LeetCode", year: "Ongoing", icon: Terminal },
  { title: "Python for Data Science", issuer: "IBM · Coursera", year: "2025", icon: Code2 },
  { title: "Full Stack Web Development", issuer: "Self-Certified · GitHub Portfolio", year: "2025", icon: Server },
];

const SKILLS = [
  { title: "Frontend", icon: Layout, items: ["React", "TypeScript", "Tailwind", "Next.js", "HTML/CSS"] },
  { title: "Backend & Systems", icon: Server, items: ["Node.js", "Express", "Django", "Flask", "REST"] },
  { title: "AI & Machine Learning", icon: Brain, items: ["TensorFlow", "PyTorch", "Scikit-learn", "CV", "NLP"] },
  { title: "Data & Analytics", icon: BarChart, items: ["Python", "Pandas", "NumPy", "D3.js", "SQL"] },
  { title: "Databases & Tools", icon: Database, items: ["PostgreSQL", "MongoDB", "Docker", "Git", "Kafka"] },
  { title: "Craft", icon: Sparkles, items: ["System Design", "UX", "Perf", "A11y", "Testing"] },
];

const MARQUEE = ["React", "TypeScript", "Python", "TensorFlow", "PyTorch", "Node.js",
  "PostgreSQL", "Docker", "Kafka", "D3.js", "Next.js", "Tailwind", "OpenCV", "MongoDB"];

const NAV = [
  { id: "home", label: "Home" }, { id: "about", label: "About" },
  { id: "experience", label: "Experience" }, { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" }, { id: "certifications", label: "Certs" },
  { id: "contact", label: "Contact" },
];

function useTypingRoles() {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const role = ROLES[i];
    const speed = del ? 40 : 110;
    const t = setTimeout(() => {
      if (!del && text === role) setTimeout(() => setDel(true), 1400);
      else if (del && text === "") { setDel(false); setI((p) => (p + 1) % ROLES.length); }
      else setText(del ? role.substring(0, text.length - 1) : role.substring(0, text.length + 1));
    }, speed);
    return () => clearTimeout(t);
  }, [text, del, i]);
  return text;
}

function useActiveSection() {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    NAV.forEach((n) => { const el = document.getElementById(n.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  return active;
}

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 22 });
  return (
    <motion.div style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60] bg-gradient-to-r from-accent via-accent-glow to-secondary-accent" />
  );
}

function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const move = (e: MouseEvent) => {
      el.animate({ transform: `translate(${e.clientX - 12}px, ${e.clientY - 12}px)` },
        { duration: 400, fill: "forwards", easing: "cubic-bezier(.2,.7,.2,1)" });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div ref={ref} className="pointer-events-none fixed top-0 left-0 z-[70] hidden md:block">
      <div className="w-6 h-6 rounded-full border border-accent/60 shadow-[0_0_30px_rgba(255,120,80,0.4)]" />
    </div>
  );
}

function Nav() {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(96%,1100px)]">
      <nav className="glass rounded-2xl px-4 py-3 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 font-display font-bold">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-glow grid place-items-center text-background text-sm">AK</span>
          <span className="hidden sm:inline">Abdul Kasim</span>
        </a>
        <ul className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`}
                className={`relative px-3 py-2 text-sm rounded-lg transition-colors ${active === n.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {active === n.id && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-lg bg-surface-2"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative">{n.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden md:flex items-center gap-2">
          <a
            href={RESUME_URL}
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass hover:border-accent/50 hover:text-accent text-sm font-medium transition-colors"
          >
            <Download size={16} /> Resume
          </a>
          <a href="#contact" className="inline-flex px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:shadow-glow transition-shadow">
            Let's talk
          </a>
        </div>
        <button onClick={() => setOpen((v) => !v)} className="md:hidden w-9 h-9 grid place-items-center rounded-lg bg-surface-2" aria-label="Menu">
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-5 bg-foreground transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-foreground transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-foreground transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.ul initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="glass rounded-2xl mt-2 p-2 md:hidden">
            {NAV.map((n) => (
              <li key={n.id}>
                <a onClick={() => setOpen(false)} href={`#${n.id}`} className="block px-4 py-3 rounded-xl hover:bg-surface-2 text-sm">
                  {n.label}
                </a>
              </li>
            ))}
            <li className="pt-1">
              <a
                onClick={() => setOpen(false)}
                href={RESUME_URL}
                download
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-accent text-accent-foreground text-sm font-medium"
              >
                <Download size={16} /> Download Resume
              </a>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label}
      className="w-10 h-10 grid place-items-center rounded-full glass hover:text-accent hover:border-accent/50 transition-colors">
      {children}
    </a>
  );
}

function Hero() {
  const typed = useTypingRoles();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-70" />
      <motion.div style={{ y }} className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-accent/20 blur-[140px]" />
      <motion.div style={{ y }} className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-secondary-accent/25 blur-[140px]" />
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-[1.15fr_1fr] gap-14 items-center relative z-10 w-full">
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Available for opportunities
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6">
            Hi, I'm <span className="text-gradient">Abdul Kasim</span>
          </motion.h1>
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            className="text-2xl md:text-3xl font-display text-muted-foreground mb-8 min-h-[2.5rem]">
            <span className="text-foreground">{typed}</span>
            <span className="inline-block w-[2px] h-7 bg-accent ml-1 align-middle animate-pulse" />
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="text-lg text-muted-foreground max-w-xl leading-relaxed mb-10">
            I craft intelligent software — combining machine learning, data analytics
            and modern web engineering into products that feel effortless.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex flex-wrap gap-3 items-center">
            <a href="#projects" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-accent text-accent-foreground font-medium hover:shadow-glow-lg transition-all">
              View Projects <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="/Abdul_Kasim_Resume.pdf" download className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full glass hover:bg-surface-2 font-medium transition-colors">
              Resume <Download size={18} />
            </a>
            <div className="flex items-center gap-2 pl-2">
              <SocialIcon href="https://github.com/abdulkashim444-lgtm" label="GitHub"><Github size={18} /></SocialIcon>
              <SocialIcon href="https://www.linkedin.com/in/abdul-kasim-567984332/" label="LinkedIn"><Linkedin size={18} /></SocialIcon>
              <SocialIcon href="mailto:abdulkashim444@gmail.com" label="Email"><Mail size={18} /></SocialIcon>
            </div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }} className="relative flex justify-center">
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-6 rounded-full border border-dashed border-accent/30" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-12 rounded-full border border-dashed border-secondary-accent/20" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/40 to-secondary-accent/40 blur-2xl" />
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-accent/40 float-slow">
              <img src={profileAsset.url} alt="Abdul Kasim" className="w-full h-full object-cover" />
            </div>
            {["React", "AI/ML", "Python", "TS"].map((t, i) => {
              const angle = (i / 4) * Math.PI * 2;
              const x = Math.cos(angle) * 200; const yy = Math.sin(angle) * 200;
              return (
                <motion.div key={t} animate={{ y: [0, -8, 0] }} transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.3 }}
                  className="absolute top-1/2 left-1/2 hidden md:block"
                  style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${yy}px))` }}>
                  <div className="glass px-3 py-1.5 rounded-full text-xs font-mono">{t}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Marquee() {
  return (
    <div className="relative overflow-hidden py-6 border-y border-border-soft bg-surface/30">
      <div className="flex marquee gap-12 whitespace-nowrap w-max">
        {[...MARQUEE, ...MARQUEE].map((t, i) => (
          <span key={i} className="text-2xl md:text-4xl font-display font-semibold text-muted-foreground/60 hover:text-accent transition-colors flex items-center gap-12">
            {t} <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="text-center mb-16">
      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono text-accent mb-4 uppercase tracking-widest">
        {eyebrow}
      </motion.div>
      <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="text-4xl md:text-6xl font-bold">{title}</motion.h2>
      {sub && <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">{sub}</p>}
    </div>
  );
}

function About() {
  return (
    <section id="about" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="grid grid-cols-2 gap-4">
          {STATS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }} viewport={{ once: true }} whileHover={{ y: -6 }}
              className="group relative p-6 rounded-2xl glass overflow-hidden">
              <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-accent/10 blur-2xl group-hover:bg-accent/25 transition" />
              <s.icon className="text-accent mb-4" size={26} />
              <div className="text-4xl font-display font-bold">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <div className="text-xs font-mono uppercase tracking-widest text-accent mb-3">About Me</div>
          <h3 className="text-3xl md:text-5xl font-bold mb-6">Turning complex problems into <span className="text-gradient">elegant systems</span>.</h3>
          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
            I'm a passionate engineer who lives at the intersection of AI, data and product.
            From training neural networks to shipping polished React interfaces, I care about
            details — how something loads, how it feels, how it scales.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            When I'm not coding, I'm grinding LeetCode (2250+ solved), exploring new ML
            papers, or reverse-engineering great product experiences.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="py-28 relative">
      <div className="max-w-5xl mx-auto px-6">
        <SectionTitle eyebrow="Journey" title="Where I've worked" />
        <div className="relative pl-6 md:pl-10">
          <div className="absolute left-0 md:left-4 top-2 bottom-2 w-px bg-gradient-to-b from-accent/60 via-border-soft to-transparent" />
          {EXPERIENCES.map((e, i) => (
            <motion.article key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }} viewport={{ once: true }} className="relative mb-10 group">
              <div className="absolute -left-[27px] md:-left-[7px] top-6 w-4 h-4 rounded-full bg-background border-2 border-accent shadow-[0_0_20px_rgba(255,120,80,0.5)]" />
              <div className="ml-4 p-6 rounded-2xl glass hover:border-accent/40 transition-colors">
                <div className="flex flex-wrap justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-xl font-display font-bold">{e.role}</h3>
                    <div className="flex items-center gap-2 text-accent mt-1 text-sm font-medium">
                      <Briefcase size={14} /> {e.company}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Calendar size={14} /> {e.period}
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">{e.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!project) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    // Focus the close button when the dialog opens
    const focusTimer = setTimeout(() => closeBtnRef.current?.focus(), 20);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-8 bg-background/70 backdrop-blur-md"
          onClick={onClose}
          aria-hidden="false"
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass rounded-3xl border border-border-soft focus:outline-none"
          >
            <button
              ref={closeBtnRef}
              onClick={onClose}
              aria-label={`Close ${project.title} details`}
              className="absolute top-4 right-4 z-10 w-10 h-10 grid place-items-center rounded-full bg-surface-2/80 hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors"
            >
              <X size={18} />
            </button>
            <div className="relative aspect-video overflow-hidden rounded-t-3xl">
              <img src={project.image} alt="" aria-hidden="true" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute bottom-4 left-6 flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-mono font-medium">
                  {project.category}
                </span>
                <span className="px-3 py-1 rounded-full glass text-xs font-mono text-muted-foreground">
                  {project.year}
                </span>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <h3 id={titleId} className="text-2xl md:text-3xl font-display font-bold mb-3">{project.title}</h3>
              <p id={descId} className="text-muted-foreground leading-relaxed mb-6">{project.longDescription}</p>
              <div className="mb-6">
                <div className="text-xs font-mono uppercase tracking-widest text-accent mb-3">Key Highlights</div>
                <ul className="space-y-2">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 size={16} className="text-accent mt-0.5 shrink-0" aria-hidden="true" />
                      <span className="text-muted-foreground">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full bg-surface-2 text-xs font-mono text-muted-foreground">{t}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={project.github} target="_blank" rel="noreferrer"
                   className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass hover:bg-surface-2 font-medium text-sm transition-colors">
                  <Github size={16} /> View Code
                </a>
                <a href={project.live} target="_blank" rel="noreferrer"
                   className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-accent-foreground font-medium text-sm hover:shadow-glow transition-shadow">
                  <ExternalLink size={16} /> Live Demo
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Projects() {
  const [filter, setFilter] = useState<(typeof PROJECT_CATEGORIES)[number]>("All");
  const [active, setActive] = useState<Project | null>(null);
  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle eyebrow="Selected Work" title="Featured Projects" sub="Real systems, real users, real impact — filter by category and dive into the details." />

        <div className="flex flex-wrap justify-center gap-2 mb-14">
          {PROJECT_CATEGORIES.map((c) => {
            const isActive = filter === c;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-accent shadow-glow"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{c}</span>
              </button>
            );
          })}
        </div>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.article
                layout
                key={p.title}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 220, damping: 24 }}
                whileHover={{ y: -6 }}
                onClick={() => setActive(p)}
                className="group cursor-pointer relative rounded-3xl glass overflow-hidden border border-border-soft hover:border-accent/50 transition-colors"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={p.image} alt={p.title} loading="lazy"
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-[10px] font-mono uppercase tracking-widest text-accent">
                    {p.category}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-display font-bold group-hover:text-accent transition-colors">{p.title}</h3>
                    <ArrowRight size={18} className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tech.slice(0, 4).map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-full bg-surface-2 text-[10px] font-mono text-muted-foreground">{t}</span>
                    ))}
                    {p.tech.length > 4 && (
                      <span className="px-2 py-0.5 rounded-full bg-surface-2 text-[10px] font-mono text-muted-foreground">+{p.tech.length - 4}</span>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-16 text-center">
          <a href="https://github.com/abdulkashim444-lgtm" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 text-accent font-medium hover:gap-4 transition-all">
            View more on GitHub <ArrowRight size={18} />
          </a>
        </div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}

function Certifications() {
  return (
    <section id="certifications" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionTitle
          eyebrow="Credentials"
          title="Certifications & Achievements"
          sub="Continuous learning across AI, engineering, data and problem solving."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CERTIFICATIONS.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="group relative p-6 rounded-3xl glass overflow-hidden hover:border-accent/50 transition-colors"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-accent/10 blur-2xl group-hover:bg-accent/25 transition" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-accent/15 grid place-items-center">
                    <c.icon className="text-accent" size={20} />
                  </div>
                  <Award size={18} className="text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <h3 className="font-display font-bold leading-tight mb-2">{c.title}</h3>
                <div className="text-xs text-muted-foreground mb-3">{c.issuer}</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-accent">{c.year}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle eyebrow="Toolkit" title="Technical Prowess" sub="The stack I reach for to build modern, scalable, intelligent software." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS.map((cat, i) => (
            <motion.div key={cat.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }} viewport={{ once: true }} whileHover={{ y: -6 }}
              className="group relative p-7 rounded-3xl glass overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "radial-gradient(400px circle at var(--x,50%) var(--y,50%), color-mix(in oklab, var(--accent) 15%, transparent), transparent 50%)" }} />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-accent/15 grid place-items-center mb-5">
                  <cat.icon className="text-accent" size={22} />
                </div>
                <h3 className="text-xl font-display font-bold mb-4">{cat.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-surface-2 text-xs font-mono text-muted-foreground">{s}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email").max(200, "Email is too long"),
  message: z.string().trim().min(10, "Message needs a bit more detail").max(2000, "Message is too long"),
});
type ContactValues = z.infer<typeof contactSchema>;
type ContactErrors = Partial<Record<keyof ContactValues, string>>;

function ContactForm() {
  const [values, setValues] = useState<ContactValues>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const nameId = useId(); const emailId = useId(); const messageId = useId();

  const update = (k: keyof ContactValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: ContactErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactValues;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setSubmitting(true);
    try {
      const { name, email, message } = parsed.data;
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      const mailto = `mailto:abdulkashim444@gmail.com?subject=${encodeURIComponent("Hello from your portfolio")}&body=${body}`;
      window.location.href = mailto;
      toast.success("Opening your email app — thanks for reaching out!");
      setValues({ name: "", email: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please email me directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-4 py-3.5 rounded-xl bg-surface/40 border border-border-soft placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 transition";

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 text-left" aria-label="Contact form">
      <div>
        <label htmlFor={nameId} className="block text-sm font-medium mb-2">Full Name</label>
        <input id={nameId} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${nameId}-err` : undefined}
          value={values.name} onChange={update("name")} placeholder="John Doe" className={inputCls} />
        {errors.name && <p id={`${nameId}-err`} className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor={emailId} className="block text-sm font-medium mb-2">Email Address</label>
        <input id={emailId} type="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? `${emailId}-err` : undefined}
          value={values.email} onChange={update("email")} placeholder="john@example.com" className={inputCls} />
        {errors.email && <p id={`${emailId}-err`} className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor={messageId} className="block text-sm font-medium mb-2">Message</label>
        <textarea id={messageId} aria-invalid={!!errors.message} aria-describedby={errors.message ? `${messageId}-err` : undefined}
          value={values.message} onChange={update("message")} rows={5} placeholder="How can I help you?"
          className={`${inputCls} resize-y`} />
        {errors.message && <p id={`${messageId}-err`} className="mt-1.5 text-xs text-red-400">{errors.message}</p>}
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-accent text-accent-foreground font-semibold hover:shadow-glow-lg transition-all disabled:opacity-70"
      >
        {submitting ? <Loader2 size={18} className="animate-spin" /> : <>Send Message <Send size={18} /></>}
      </button>
    </form>
  );
}

function Contact() {
  const prefersReducedMotion = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  const container: Variants = {
    hidden: {},
    show: {
      transition: prefersReducedMotion
        ? { staggerChildren: 0 }
        : { staggerChildren: 0.09, delayChildren: 0.05 },
    },
  };
  const rise: Variants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: prefersReducedMotion ? 0.001 : 0.7, ease },
    },
  };
  const fromLeft: Variants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -40 },
    show: { opacity: 1, x: 0, transition: { duration: prefersReducedMotion ? 0.001 : 0.75, ease } },
  };
  const fromRight: Variants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 40 },
    show: { opacity: 1, x: 0, transition: { duration: prefersReducedMotion ? 0.001 : 0.75, ease } },
  };

  return (
    <section id="contact" className="pt-28 pb-0 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[140px] pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease }}
        />
      )}
      <motion.div
        className="max-w-7xl mx-auto px-6 relative"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div variants={fromLeft}>
            <motion.h2 variants={rise} className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Let's Connect.
            </motion.h2>
            <motion.p variants={rise} className="text-muted-foreground text-lg leading-relaxed max-w-md">
              I'm currently looking for new opportunities and collaborations. Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </motion.p>
            <motion.a
              variants={rise}
              href="mailto:abdulkashim444@gmail.com"
              className="mt-10 flex items-center gap-4 group w-fit"
              whileHover={prefersReducedMotion ? undefined : { x: 4 }}
              transition={{ duration: 0.3, ease }}
            >
              <span className="w-12 h-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <Mail size={20} />
              </span>
              <span>
                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Email me</div>
                <div className="font-semibold">abdulkashim444@gmail.com</div>
              </span>
            </motion.a>
            <motion.div variants={rise} className="mt-8 flex items-center gap-3">
              {[
                { href: "https://github.com/abdulkashim444-lgtm", label: "GitHub", icon: Github },
                { href: "https://www.linkedin.com/in/abdul-kasim-567984332/", label: "LinkedIn", icon: Linkedin },
                { href: "https://instagram.com/", label: "Instagram", icon: Instagram },
              ].map(({ href, label, icon: Icon }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-11 h-11 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/50 transition-colors"
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: prefersReducedMotion ? 0.001 : 0.5, ease, delay: prefersReducedMotion ? 0 : 0.4 + i * 0.08 }}
                  whileHover={prefersReducedMotion ? undefined : { y: -3, scale: 1.05 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div variants={fromRight} className="glass rounded-3xl p-6 md:p-10">
            <ContactForm />
          </motion.div>
        </div>


        <footer className="mt-24 py-8 border-t border-border-soft grid gap-4 md:grid-cols-3 items-center text-sm text-muted-foreground">
          <div>
            <div className="text-accent font-bold text-2xl">AK.</div>
            <div className="mt-1">© {new Date().getFullYear()} Abdul Kasim. All rights reserved.</div>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-6">
            <a href="#home" className="hover:text-accent transition-colors">Home</a>
            <a href="#about" className="hover:text-accent transition-colors">About</a>
            <a href="#projects" className="hover:text-accent transition-colors">Projects</a>
            <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
          </nav>
          <div className="md:text-right italic">
            Designed &amp; Developed with <Heart size={14} className="inline text-accent fill-accent -mt-0.5" /> by Abdul Kasim
          </div>
        </footer>
      </motion.div>
    </section>
  );
}

function Portfolio() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const a = t.closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth", block: "start" }); }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      document.querySelectorAll<HTMLElement>(".group").forEach((el) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - r.left}px`);
        el.style.setProperty("--y", `${e.clientY - r.top}px`);
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <main className="min-h-screen text-foreground">
      <ProgressBar />
      <Cursor />
      <Nav />
      <Hero />
      <Marquee />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Certifications />
      <Contact />
      <ChatBot />
      <Toaster position="bottom-right" theme="dark" richColors closeButton />
    </main>
  );
}
