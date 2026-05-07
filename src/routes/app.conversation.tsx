import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { LANGUAGES, langBcp47, langFlag, langLabel } from "@/lib/languages";
import { translateText } from "@/server/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

export const Route = createFileRoute("/app/conversation")({ component: ConvPage });

type Turn = { speaker: "A" | "B"; original: string; translated: string };

function ConvPage() {
  const [langA, setLangA] = useState("it");
  const [langB, setLangB] = useState("en");
  const [active, setActive] = useState<"A" | "B" | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const recRef = useRef<any>(null);
  const tr = useServerFn(translateText);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    recRef.current = new SR(); recRef.current.continuous = false; recRef.current.interimResults = false;
  }, []);

  const speak = (speaker: "A" | "B") => {
    if (!recRef.current) return toast.error("Speech recognition not supported");
    const from = speaker === "A" ? langA : langB;
    const to = speaker === "A" ? langB : langA;
    recRef.current.lang = langBcp47(from);
    setActive(speaker);
    recRef.current.onresult = async (e: any) => {
      const text = e.results[0][0].transcript;
      try {
        const r = await tr({ data: { text, source: from, target: to, tone: "neutral", wantTransliteration: false } });
        setTurns(t => [...t, { speaker, original: text, translated: r.translation }]);
        const u = new SpeechSynthesisUtterance(r.translation); u.lang = langBcp47(to); speechSynthesis.speak(u);
      } catch (err) { toast.error((err as Error).message); }
      setActive(null);
    };
    recRef.current.onend = () => setActive(null);
    recRef.current.start();
  };
  const stop = () => { recRef.current?.stop(); setActive(null); };

  return (
    <div>
      <h1 className="font-display text-3xl mb-1">Live Conversation</h1>
      <p className="text-muted-foreground text-sm mb-6">Two-speaker real-time interpreter.</p>

      <div className="grid md:grid-cols-2 gap-4 min-h-[60vh]">
        {(["A", "B"] as const).map((s, i) => {
          const lang = s === "A" ? langA : langB;
          const setter = s === "A" ? setLangA : setLangB;
          const isActive = active === s;
          return (
            <div key={s} className={`glass-strong rounded-3xl p-5 flex flex-col ${i === 1 ? "md:rotate-180" : ""}`}>
              <div className={i === 1 ? "md:rotate-180" : ""}>
                <div className="flex items-center justify-between mb-4">
                  <Select value={lang} onValueChange={setter}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>{LANGUAGES.filter(l => l.code !== "auto").map(l => <SelectItem key={l.code} value={l.code}>{l.flag} {l.label}</SelectItem>)}</SelectContent>
                  </Select>
                  <span className="text-2xl">{langFlag(lang)}</span>
                </div>
                <div className="flex-1 space-y-2 max-h-72 overflow-auto mb-4">
                  {turns.filter(t => t.speaker === s).map((t, idx) => (
                    <div key={idx} className="glass rounded-xl p-3 text-sm">
                      <div className={lang === "ur" ? "text-right" : ""}>{t.original}</div>
                      <div className="text-xs text-muted-foreground mt-1">→ {t.translated}</div>
                    </div>
                  ))}
                  {turns.filter(t => t.speaker !== s).slice(-1).map((t, idx) => (
                    <div key={`o${idx}`} className="glass rounded-xl p-3 text-sm border border-primary/40">
                      <div className="text-xs text-muted-foreground">{langLabel(s === "A" ? langB : langA)}</div>
                      <div>{t.translated}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => isActive ? stop() : speak(s)} className={`w-full h-14 rounded-2xl gradient-mint text-primary-foreground font-medium flex items-center justify-center gap-2 ${isActive ? "animate-pulse-glow" : "shadow-glow"}`}>
                  {isActive ? <><Square className="h-4 w-4" /> Listening… stop</> : <><Mic className="h-4 w-4" /> Speak {langLabel(lang)}</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
