import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Languages,
  Mic,
  FileText,
  Image as ImageIcon,
  MessagesSquare,
  GraduationCap,
  History,
  Bookmark,
  Settings,
  ArrowUpRight,
  Sparkles,
  Flame,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { studentGuideData } from "@/lib/student-guide-data";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/app/")({ component: Dashboard });

const WORKSPACES: {
  to: "/app/text" | "/app/voice" | "/app/document" | "/app/roleplay";
  icon: typeof Languages;
  title: string;
  blurb: string;
  accent: string;
}[] = [
  {
    to: "/app/text",
    icon: Languages,
    title: "Text",
    blurb: "Paste paragraphs, refine tone, and copy results in one place.",
    accent: "from-primary/20 to-transparent",
  },
  {
    to: "/app/voice",
    icon: Mic,
    title: "Voice",
    blurb: "Speak naturally and hear translations — good for travel and calls.",
    accent: "from-emerald-500/15 to-transparent",
  },
  {
    to: "/app/document",
    icon: FileText,
    title: "File Translation",
    blurb: "Keep layout on PDFs, JSON, images, and Markdown without reformatting.",
    accent: "from-amber-500/15 to-transparent",
  },
  {
    to: "/app/roleplay",
    icon: MessagesSquare,
    title: "Roleplay coach",
    blurb: "Practice realistic dialogues with live corrections.",
    accent: "from-violet-500/15 to-transparent",
  },
];

const SECONDARY: {
  to: "/app/history" | "/app/saved" | "/app/settings";
  icon: typeof History;
  label: string;
  hint: string;
}[] = [
  { to: "/app/history", icon: History, label: "History", hint: "Recent work" },
  { to: "/app/saved", icon: Bookmark, label: "Saved deck", hint: "Review & SRS" },
  { to: "/app/settings", icon: Settings, label: "Settings", hint: "Account" },
];

const COUNTRY_FLAG: Record<string, string> = {
  DE: "🇩🇪",
  GB: "🇬🇧",
  FR: "🇫🇷",
  ES: "🇪🇸",
  NL: "🇳🇱",
  IT: "🇮🇹",
};

function Dashboard() {
  const countries = Object.values(studentGuideData);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [studied, setStudied] = useState(0);

  useEffect(() => {
    try {
      setStreak(parseInt(localStorage.getItem("lb-streak") || "4"));
      setXp(parseInt(localStorage.getItem("lb-xp") || "350"));
      setStudied(parseInt(localStorage.getItem("lb-studied-today") || "12"));
    } catch (e) {}
  }, []);

  return (
    <div className="space-y-10 pb-8">
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border/50 pb-6"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">
            Workspace
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Everything in one screen
          </h1>
          <p className="text-muted-foreground text-sm sm:text-[15px] mt-2 max-w-xl leading-relaxed">
            Jump straight into a tool or open a country guide — no extra menus. Use the{" "}
            <span className="text-foreground/90 font-medium">Jump to</span> bar up top anytime.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          {SECONDARY.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              title={s.hint}
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              <s.icon className="h-4 w-4 text-primary" />
              {s.label}
            </Link>
          ))}
        </div>
      </motion.header>

      {/* Primary tools — equal cards with copy */}
      <section aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="sr-only">
          Translation tools
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {WORKSPACES.map((w, i) => (
            <motion.div
              key={w.to}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
            >
              <Link
                to={w.to}
                className={`group relative flex h-full flex-col overflow-hidden rounded-lg border border-border/60 bg-card/40 p-5 shadow-sm transition-all hover:border-primary/35 hover:shadow-sm`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${w.accent} opacity-0 transition-opacity group-hover:opacity-100`}
                />
                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/20">
                    <w.icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <h3 className="relative mt-4 font-display text-lg font-semibold tracking-tight">
                  {w.title}
                </h3>
                <p className="relative mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {w.blurb}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Study abroad — direct country links (skip an extra landing tap) */}
      <section aria-labelledby="guides-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h2 id="guides-heading" className="font-display text-lg font-semibold tracking-tight">
              Student guides
            </h2>
          </div>
          <Link
            to="/app/student-guide"
            className="text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            Browse all countries
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {countries.map((c, i) => (
            <motion.div
              key={c.countryCode}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.03 * i }}
            >
              <Link
                to="/app/student-guide/$country"
                params={{ country: c.countryCode.toLowerCase() }}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 py-2 pl-3 pr-4 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-primary/8 hover:shadow-sm"
              >
                <span className="text-base" aria-hidden>
                  {COUNTRY_FLAG[c.countryCode] ?? "🌍"}
                </span>
                {c.country}
                <span className="text-[11px] font-normal text-muted-foreground">
                  {Object.keys(c.categories).length} topics
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-lg border border-primary/25 bg-card p-6 sm:p-8 shadow-sm"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">Saved phrases & deck</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-lg leading-relaxed">
                Promote lines from history into your deck for spaced repetition — no extra app.
              </p>
            </div>
          </div>
          <div className="flex gap-4 sm:gap-6 flex-col sm:flex-row w-full sm:w-auto mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-sm font-bold">{streak} Days</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Streak</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-sm font-bold">{xp} XP</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</div>
              </div>
            </div>
            <div className="flex items-center gap-2 pr-4">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              <div>
                <div className="text-sm font-bold">{studied} Words</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Today</div>
              </div>
            </div>
            <Link
              to="/app/saved"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-[1.02]"
            >
              Study Now
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
