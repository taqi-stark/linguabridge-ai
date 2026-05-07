import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Languages, Mic, Image as ImageIcon, FileText, Bot, MessagesSquare, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/app/")({ component: Dashboard });

const tiles = [
  { to: "/app/text", icon: Languages, t: "Text Translator", d: "Type or paste text" },
  { to: "/app/voice", icon: Mic, t: "Voice", d: "Speak & translate" },
  { to: "/app/image", icon: ImageIcon, t: "Image / OCR", d: "Translate from photos" },
  { to: "/app/document", icon: FileText, t: "Documents", d: "Upload PDFs" },
  { to: "/app/assistant", icon: Bot, t: "AI Assistant", d: "Explain anything" },
  { to: "/app/conversation", icon: MessagesSquare, t: "Conversation", d: "Live interpreter" },
];

function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl">Welcome back 👋</h1>
        <p className="text-muted-foreground mt-1">What would you like to translate today?</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map((t, i) => (
          <motion.div key={t.to} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Link to={t.to} className="block glass rounded-2xl p-5 hover:ring-glow transition group">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-xl gradient-mint flex items-center justify-center group-hover:scale-110 transition">
                  <t.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
              </div>
              <h3 className="font-display text-lg mt-4">{t.t}</h3>
              <p className="text-sm text-muted-foreground">{t.d}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-8">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h3 className="font-display text-lg">Recent activity</h3>
          <p className="text-sm text-muted-foreground mt-1">Your translations show up in <Link to="/app/history" className="text-primary">History</Link>.</p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="glass rounded-xl p-3 text-muted-foreground">No translations yet — try the text translator to get started.</div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="font-display text-lg">Tip</h3>
          <p className="text-sm text-muted-foreground mt-1">Press the swap button in the text translator to flip languages instantly.</p>
        </div>
      </div>
    </div>
  );
}
