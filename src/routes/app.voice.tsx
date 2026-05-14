import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { LANGUAGES, langBcp47, langFlag, langLabel } from "@/lib/languages";
import { translateText } from "@/server-functions/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/app/voice")({ component: ConvPage });

type Turn = { speaker: "A" | "B"; original: string; translated: string };

function ConvPage() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [langA, setLangA] = useState("it");
  const [langB, setLangB] = useState("en");
  const [active, setActive] = useState<"A" | "B" | null>(null);
  const [streamingText, setStreamingText] = useState("");
  const [processing, setProcessing] = useState(false);
  const recRef = useRef<any>(null);
  const tr = useServerFn(translateText);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    recRef.current = new SR();
    recRef.current.continuous = true;
    recRef.current.interimResults = true;
  }, []);

  const startSpeech = (speaker: "A" | "B") => {
    if (!recRef.current) return toast.error("Speech recognition not supported");
    const from = speaker === "A" ? langA : langB;
    recRef.current.lang = langBcp47(from);
    setActive(speaker);
    setStreamingText("");

    recRef.current.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (!e.results[i].isFinal) interim += e.results[i][0].transcript;
      }
      setStreamingText(interim);
    };

    try {
      recRef.current.start();
    } catch (e) {}
  };

  const stopSpeech = () => {
    if (!active) return;
    recRef.current?.stop();
    setProcessing(true);

    // Slight timeout ensures final transcription is captured
    setTimeout(async () => {
      const text = streamingText.trim();
      if (!text) {
        setActive(null);
        setProcessing(false);
        setStreamingText("");
        return;
      }
      const from = active === "A" ? langA : langB;
      const to = active === "A" ? langB : langA;

      try {
        const glossary = localStorage.getItem("lb-glossary") || "";
        const r = await tr({
          data: {
            text,
            source: from,
            target: to,
            tone: "neutral",
            wantTransliteration: false,
            glossary,
          },
        });
        setTurns((t) => [...t, { speaker: active, original: text, translated: r.translation }]);
        const u = new SpeechSynthesisUtterance(r.translation);
        u.lang = langBcp47(to);
        speechSynthesis.speak(u);
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setActive(null);
        setProcessing(false);
        setStreamingText("");
      }
    }, 500);
  };

  return (
    <div>
      <PageHeader
        title="Voice Intercom"
        description="Two-speaker real-time WebRTC push-to-talk interpreter."
      />
      <div className="grid md:grid-cols-2 gap-4 min-h-[60vh]">
        {(["A", "B"] as const).map((s, i) => {
          const lang = s === "A" ? langA : langB;
          const setter = s === "A" ? setLangA : setLangB;
          const isActive = active === s;
          return (
            <div
              key={s}
              className={`bg-card rounded-xl p-5 flex flex-col ${i === 1 ? "md:rotate-180" : ""}`}
            >
              <div className={i === 1 ? "md:rotate-180" : ""}>
                <div className="flex items-center justify-between mb-4">
                  <Select value={lang} onValueChange={setter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.filter((l) => l.code !== "auto").map((l) => (
                        <SelectItem key={l.code} value={l.code}>
                          {l.flag} {l.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-2xl">{langFlag(lang)}</span>
                </div>
                <div className="flex-1 space-y-2 max-h-72 overflow-auto mb-4">
                  {turns
                    .filter((t) => t.speaker === s)
                    .map((t, idx) => (
                      <div key={idx} className="bg-card rounded-xl p-3 text-sm">
                        <div className={lang === "ur" ? "text-right" : ""}>{t.original}</div>
                        <div className="text-xs text-muted-foreground mt-1">→ {t.translated}</div>
                      </div>
                    ))}
                  {turns
                    .filter((t) => t.speaker !== s)
                    .slice(-1)
                    .map((t, idx) => (
                      <div
                        key={`o${idx}`}
                        className="bg-card rounded-xl p-3 text-sm border border-primary/40"
                      >
                        <div className="text-xs text-muted-foreground">
                          {langLabel(s === "A" ? langB : langA)}
                        </div>
                        <div>{t.translated}</div>
                      </div>
                    ))}
                  {isActive && streamingText && (
                    <div className="bg-card rounded-xl p-3 text-sm border-l-2 border-primary animate-in slide-in-from-bottom-2">
                      <span className="text-muted-foreground animate-pulse">{streamingText}</span>
                    </div>
                  )}
                  {processing && active === s && (
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" /> Translating via Edge Router...
                    </div>
                  )}
                </div>
                <button
                  onMouseDown={() => startSpeech(s)}
                  onMouseUp={stopSpeech}
                  onMouseLeave={stopSpeech}
                  onTouchStart={() => startSpeech(s)}
                  onTouchEnd={stopSpeech}
                  disabled={processing && active !== s}
                  className={`w-full h-14 rounded-lg bg-primary text-primary-foreground text-primary-foreground font-medium flex items-center justify-center gap-2 transition-all select-none ${isActive ? "scale-95 shadow-sm" : "hover:scale-[1.02] shadow-sm"} ${processing && active !== s ? "opacity-50 grayscale" : ""}`}
                >
                  {isActive ? (
                    <>
                      <Mic className="h-5 w-5 animate-bounce" /> Release to Translate
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" /> Hold to Speak {langLabel(lang)}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
