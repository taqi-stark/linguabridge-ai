import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { LANGUAGES, langBcp47 } from "@/lib/languages";
import { translateText } from "@/server/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

export const Route = createFileRoute("/app/voice")({ component: VoicePage });

function VoicePage() {
  const [source, setSource] = useState("en");
  const [target, setTarget] = useState("it");
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const recRef = useRef<any>(null);
  const tr = useServerFn(translateText);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.continuous = true; r.interimResults = true;
    r.onresult = (e: any) => {
      let txt = "";
      for (let i = 0; i < e.results.length; i++) txt += e.results[i][0].transcript;
      setTranscript(txt);
    };
    r.onend = () => setListening(false);
    recRef.current = r;
  }, []);

  useEffect(() => { if (recRef.current) recRef.current.lang = langBcp47(source); }, [source]);

  const start = () => {
    if (!recRef.current) return toast.error("Speech recognition not supported. Try Chrome or Edge.");
    setTranscript(""); setTranslation("");
    recRef.current.lang = langBcp47(source);
    recRef.current.start(); setListening(true);
  };
  const stop = async () => {
    recRef.current?.stop(); setListening(false);
    if (!transcript.trim()) return;
    setLoading(true);
    try {
      const r = await tr({ data: { text: transcript, source, target, tone: "neutral", wantTransliteration: false } });
      setTranslation(r.translation);
      const u = new SpeechSynthesisUtterance(r.translation); u.lang = langBcp47(target); speechSynthesis.speak(u);
    } catch (e) { toast.error((e as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl">Voice Translator</h1>
        <p className="text-muted-foreground text-sm mt-1">Speak naturally — we'll translate and speak it back.</p>
      </div>

      <div className="glass-strong rounded-3xl p-8 shadow-elegant text-center">
        <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>{LANGUAGES.filter(l => l.code !== "auto").map(l => <SelectItem key={l.code} value={l.code}>{l.flag} {l.label}</SelectItem>)}</SelectContent>
          </Select>
          <span className="text-muted-foreground">→</span>
          <Select value={target} onValueChange={setTarget}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>{LANGUAGES.filter(l => l.code !== "auto").map(l => <SelectItem key={l.code} value={l.code}>{l.flag} {l.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <motion.button
          onClick={listening ? stop : start}
          whileTap={{ scale: 0.95 }}
          className={`relative h-40 w-40 mx-auto rounded-full gradient-mint flex items-center justify-center shadow-glow ${listening ? "animate-pulse-glow" : ""}`}>
          {loading ? <Loader2 className="h-12 w-12 text-primary-foreground animate-spin" /> :
            listening ? <Square className="h-12 w-12 text-primary-foreground" /> :
            <Mic className="h-14 w-14 text-primary-foreground" />}
        </motion.button>
        <p className="mt-5 text-sm text-muted-foreground">
          {listening ? "Listening… tap to stop" : loading ? "Translating…" : "Tap to start speaking"}
        </p>

        {(transcript || translation) && (
          <div className="grid md:grid-cols-2 gap-3 mt-8 text-left">
            <div className="glass rounded-2xl p-4">
              <div className="text-xs text-muted-foreground uppercase mb-1">You said</div>
              <div className={source === "ur" ? "text-right" : ""} dir={source === "ur" ? "rtl" : "ltr"}>{transcript || "—"}</div>
            </div>
            <div className="glass rounded-2xl p-4">
              <div className="text-xs text-muted-foreground uppercase mb-1 flex items-center justify-between">Translation
                {translation && <button onClick={() => { const u = new SpeechSynthesisUtterance(translation); u.lang = langBcp47(target); speechSynthesis.speak(u); }}><Volume2 className="h-4 w-4" /></button>}
              </div>
              <div className={target === "ur" ? "text-right" : ""} dir={target === "ur" ? "rtl" : "ltr"}>{translation || "—"}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
