import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Languages, Mic, Image as ImageIcon, FileText, Bot, Sparkles, Globe2, Zap, Shield, ArrowRight, Check } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

function Nav() {
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl gradient-mint shadow-glow flex items-center justify-center">
            <Globe2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold text-lg">LinguaBridge <span className="text-gradient-mint">AI</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <Link to="/pricing" className="hover:text-foreground transition">Pricing</Link>
          <a href="#how" className="hover:text-foreground transition">How it works</a>
          <a href="#stack" className="hover:text-foreground transition">Tech</a>
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="h-9 w-9 rounded-full glass flex items-center justify-center hover:ring-glow transition" aria-label="Toggle theme">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <Link to="/login" className="text-sm hidden sm:inline px-3 py-2 hover:text-foreground text-muted-foreground">Login</Link>
          <Link to="/signup">
            <Button className="rounded-full gradient-mint text-primary-foreground border-0 shadow-glow">Sign up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function FloatingBadges() {
  const badges = [
    { t: "Ciao", l: "🇮🇹", x: "10%", y: "20%", d: 0 },
    { t: "Hello", l: "🇬🇧", x: "80%", y: "15%", d: 0.5 },
    { t: "ہیلو", l: "🇵🇰", x: "15%", y: "70%", d: 1 },
    { t: "Grazie", l: "🇮🇹", x: "85%", y: "65%", d: 1.5 },
    { t: "شکریہ", l: "🇵🇰", x: "50%", y: "85%", d: 0.8 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {badges.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
          className="absolute"
          style={{ left: b.x, top: b.y }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4 + b.d, repeat: Infinity, ease: "easeInOut", delay: b.d }}
            className="glass rounded-full px-4 py-2 text-sm font-medium shadow-elegant flex items-center gap-2"
          >
            <span>{b.l}</span><span>{b.t}</span>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

function AnimatedGlobe() {
  return (
    <div className="relative w-72 h-72 sm:w-96 sm:h-96 mx-auto">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-primary/30"
        style={{ background: "conic-gradient(from 0deg, transparent, oklch(0.82 0.17 165 / 0.25), transparent)" }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-6 rounded-full border border-primary/40"
      />
      <div className="absolute inset-12 rounded-full gradient-mint shadow-glow animate-pulse-glow flex items-center justify-center">
        <Globe2 className="h-24 w-24 text-primary-foreground" strokeWidth={1.2} />
      </div>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <motion.div
          key={deg}
          className="absolute top-1/2 left-1/2 h-2 w-2 rounded-full bg-primary shadow-glow"
          style={{ transform: `rotate(${deg}deg) translateY(-160px)` }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: deg / 360 }}
        />
      ))}
    </div>
  );
}

function Particles() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-primary/60"
          style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 3 + (i % 5), repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

const features = [
  { icon: Languages, title: "Text Translation", desc: "Instant translation with grammar enhancement and tone control." },
  { icon: Mic, title: "Voice Translator", desc: "Speak naturally — get translated audio in seconds." },
  { icon: ImageIcon, title: "Image OCR", desc: "Upload a photo, extract text, get a translation." },
  { icon: FileText, title: "Documents", desc: "PDFs, letters, official forms — translated end-to-end." },
  { icon: Bot, title: "AI Assistant", desc: "Explain immigration docs, write replies in formal Italian." },
  { icon: Sparkles, title: "Live Conversation", desc: "Real-time interpreter for two-speaker calls." },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Nav />
      <section className="relative overflow-hidden">
        <Particles />
        <FloatingBadges />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 sm:pt-24 sm:pb-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Powered by Lovable AI · Italian · English · Urdu
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-4xl sm:text-6xl md:text-7xl font-semibold leading-[1.05] tracking-tight">
              AI-Powered <span className="text-gradient-mint">Multilingual</span><br />Translation Assistant
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Translate text, speech, images, and documents instantly between Italian, English, and Urdu.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link to="/app/text"><Button size="lg" className="rounded-full gradient-mint text-primary-foreground border-0 shadow-glow h-12 px-6">Try Demo <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
              <Link to="/app/image"><Button size="lg" variant="outline" className="rounded-full glass h-12 px-6">Upload Document</Button></Link>
              <Link to="/app/voice"><Button size="lg" variant="outline" className="rounded-full glass h-12 px-6"><Mic className="mr-1 h-4 w-4" /> Start Voice</Button></Link>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="mt-16">
            <AnimatedGlobe />
          </motion.div>
        </div>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display text-3xl sm:text-5xl">Everything in one place</h2>
          <p className="mt-3 text-muted-foreground">A premium translation workspace built for real-world communication.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="glass rounded-3xl p-6 hover:ring-glow transition group">
              <div className="h-11 w-11 rounded-xl gradient-mint flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="how" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display text-3xl sm:text-5xl">How it works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { n: "01", t: "Choose a mode", d: "Text, voice, image, or document — pick what you need." },
            { n: "02", t: "Provide input", d: "Type, speak, drop a file or capture a photo." },
            { n: "03", t: "Get an instant translation", d: "Copy, save, or hear it spoken back to you." },
          ].map((s) => (
            <div key={s.n} className="glass rounded-3xl p-7">
              <div className="text-gradient-mint font-display text-3xl">{s.n}</div>
              <h3 className="font-display text-xl mt-2">{s.t}</h3>
              <p className="text-sm text-muted-foreground mt-2">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="stack" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="glass-strong rounded-3xl p-10 shadow-elegant">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl">Production-grade architecture</h2>
              <p className="text-muted-foreground mt-3">React + TanStack Start, server functions on the edge, AI gateway streaming, encrypted storage, and per-user RLS.</p>
              <ul className="mt-6 space-y-2 text-sm">
                {["React frontend", "Edge server functions", "Lovable AI Gateway", "PostgreSQL with RLS", "Object storage"].map((x) => (
                  <li key={x} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> {x}</li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { i: Zap, t: "Sub-second latency" },
                { i: Shield, t: "Encrypted by default" },
                { i: Globe2, t: "Global edge" },
                { i: Sparkles, t: "Streaming AI" },
              ].map((x) => (
                <div key={x.t} className="glass rounded-2xl p-5">
                  <x.i className="h-5 w-5 text-primary" />
                  <div className="mt-2 font-medium">{x.t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-10 text-sm text-muted-foreground flex flex-wrap items-center justify-between gap-4 border-t border-border/50">
        <div>© {new Date().getFullYear()} LinguaBridge AI</div>
        <div className="flex gap-5"><Link to="/pricing">Pricing</Link><Link to="/login">Login</Link><Link to="/signup">Sign up</Link></div>
      </footer>
    </div>
  );
}
