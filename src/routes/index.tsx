import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, Download, Github, Linkedin, Mail, MapPin, ExternalLink,
  Terminal, Code2, Cpu, Trophy, Briefcase, Calendar,
  Layout, Server, Brain, BarChart, Database, Sparkles,
} from "lucide-react";
import profileImg from "@/assets/profile.jpg";

export const Route = createFileRoute("/")({
  component: Portfolio,
  head: () => ({
    meta: [
      { title: "Abdul Kashim — AI Engineer & Full Stack Developer" },
      { name: "description", content: "Portfolio of Abdul Kashim: AI, ML, data analytics and modern web engineering." },
      { property: "og:title", content: "Abdul Kashim — AI Engineer & Full Stack Developer" },
      { property: "og:description", content: "AI, ML, data analytics and modern web engineering." },
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

const PROJECTS = [
  { title: "AI-Powered Fake News Detection",
    description: "End-to-end ML + NLP system identifying fraudulent news with 85% accuracy. Real-time RESTful API and responsive React UI.",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1200",
    tech: ["Python", "Flask", "NLP", "React", "Scikit-learn"],
    github: "https://github.com/abdulkashim444-lgtm/AI-FakeNews-Detector", live: "#" },
  { title: "Real-Time Analytics Dashboard",
    description: "Full-stack analytics processing thousands of daily events. Automated ETL and dynamic D3.js visualizations.",
    image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=1200",
    tech: ["Python", "Pandas", "D3.js", "React", "PostgreSQL"], github: "#", live: "#" },
  { title: "Computer Vision Object Detection",
    description: "Real-time YOLOv8 detection at 20 FPS on standard hardware, TensorRT-optimized inference and streaming pipeline.",
    image: "https://images.unsplash.com/photo-1527430253228-e92688e1ad3a?auto=format&fit=crop&q=80&w=1200",
    tech: ["YOLOv8", "TensorRT", "OpenCV", "Python", "React"],
    github: "https://github.com/abdulkashim444-lgtm/Computer-Vision-Object-Detection-System", live: "#" },
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
  { id: "skills", label: "Skills" }, { id: "contact", label: "Contact" },
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
          <span className="hidden sm:inline">Abdul Kashim</span>
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
        <a href="#contact" className="hidden md:inline-flex px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:shadow-glow transition-shadow">
          Let's talk
        </a>
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
            Hi, I'm <span className="text-gradient">Abdul Kashim</span>
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
            <a href="/ABDUL_KASHIM_Updated_Resume.pdf" download className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full glass hover:bg-surface-2 font-medium transition-colors">
              Resume <Download size={18} />
            </a>
            <div className="flex items-center gap-2 pl-2">
              <SocialIcon href="https://github.com/abdulkashim444-lgtm" label="GitHub"><Github size={18} /></SocialIcon>
              <SocialIcon href="https://www.linkedin.com/in/abdul-kashim-567984332" label="LinkedIn"><Linkedin size={18} /></SocialIcon>
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
              <img src={profileImg} alt="Abdul Kashim" className="w-full h-full object-cover" />
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

function Projects() {
  return (
    <section id="projects" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle eyebrow="Selected Work" title="Featured Projects" sub="A few things I've built recently — real systems, real users, real impact." />
        <div className="space-y-28">
          {PROJECTS.map((p, i) => (
            <motion.article key={p.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
              className={`grid md:grid-cols-2 gap-10 items-center ${i % 2 ? "md:[direction:rtl]" : ""}`}>
              <div className="md:[direction:ltr] relative group">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-accent/40 to-secondary-accent/40 blur-2xl opacity-40 group-hover:opacity-70 transition-opacity" />
                <motion.div whileHover={{ y: -6 }} className="relative rounded-3xl overflow-hidden border border-border-soft aspect-video">
                  <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                </motion.div>
              </div>
              <div className="md:[direction:ltr] space-y-5">
                <div className="text-xs font-mono uppercase tracking-widest text-accent">Project {String(i + 1).padStart(2, "0")}</div>
                <h3 className="text-3xl md:text-4xl font-display font-bold">{p.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full glass text-xs font-mono text-muted-foreground">{t}</span>
                  ))}
                </div>
                <div className="flex gap-6 pt-2">
                  <a href={p.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-medium hover:text-accent transition-colors">
                    <Github size={18} /> Code
                  </a>
                  <a href={p.live} className="inline-flex items-center gap-2 font-medium hover:text-accent transition-colors">
                    <ExternalLink size={18} /> Live
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="mt-20 text-center">
          <a href="https://github.com/abdulkashim444-lgtm" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 text-accent font-medium hover:gap-4 transition-all">
            View more on GitHub <ArrowRight size={18} />
          </a>
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

function Contact() {
  return (
    <section id="contact" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="max-w-4xl mx-auto px-6 relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative glass rounded-3xl p-10 md:p-16 text-center overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-accent/20 blur-[120px]" />
          <div className="relative">
            <div className="text-xs font-mono uppercase tracking-widest text-accent mb-4">Get in touch</div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Let's build something <span className="text-gradient">extraordinary</span>.</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
              Have a project in mind, an opportunity, or just want to chat about AI and product? I'd love to hear from you.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="mailto:abdulkashim444@gmail.com" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-accent text-accent-foreground font-medium hover:shadow-glow-lg transition-all">
                <Mail size={18} /> abdulkashim444@gmail.com
              </a>
              <a href="https://www.linkedin.com/in/abdul-kashim-567984332" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full glass hover:bg-surface-2 font-medium transition-colors">
                <Linkedin size={18} /> LinkedIn
              </a>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} /> Available worldwide — remote friendly
            </div>
          </div>
        </motion.div>
        <footer className="mt-16 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} Abdul Kashim. Crafted with care.</div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/abdulkashim444-lgtm" target="_blank" rel="noreferrer" className="hover:text-accent"><Github size={18} /></a>
            <a href="https://www.linkedin.com/in/abdul-kashim-567984332" target="_blank" rel="noreferrer" className="hover:text-accent"><Linkedin size={18} /></a>
            <a href="mailto:abdulkashim444@gmail.com" className="hover:text-accent"><Mail size={18} /></a>
          </div>
        </footer>
      </div>
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
      <Contact />
    </main>
  );
}
