import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { translateText } from "@/server/ai.functions";
import { saveTranslation } from "@/server/history.functions";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { LANGUAGES, langBcp47 } from "@/lib/languages";
import { ArrowLeftRight, Copy, Download, Volume2, Save, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/text")({ component: TextTranslator });

const TONES = ["neutral", "formal", "casual", "academic"] as const;

function TextTranslator() {
  const [source, setSource] = useState("auto");
  const [target, setTarget] = useState("it");
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  const [tone, setTone] = useState<(typeof TONES)[number]>("neutral");
  const [loading, setLoading] = useState(false);
  const [conf, setConf] = useState(0);
  const [translit, setTranslit] = useState("");
  const tr = useServerFn(translateText);
  const save = useServerFn(saveTranslation);

  const swap = () => {
    if (source === "auto") return toast.info("Pick a source language to swap");
    setSource(target); setTarget(source); setText(out); setOut(text);
  };

  const run = async () => {
    if (!text.trim()) return;
    setLoading(true); setOut(""); setConf(0);
    try {
      const r = await tr({ data: { text, source, target, tone, wantTransliteration: target === "ur" } });
      setOut(r.translation); setConf(r.confidence); setTranslit(r.transliteration);
    } catch (e) { toast.error((e as Error).message); }
    finally { setLoading(false); }
  };

  const speak = () => {
    if (!out || typeof window === "undefined") return;
    const u = new SpeechSynthesisUtterance(out);
    u.lang = langBcp47(target);
    speechSynthesis.speak(u);
  };

  const copy = () => { navigator.clipboard.writeText(out); toast.success("Copied"); };
  const download = () => {
    const blob = new Blob([`Source (${source}):\n${text}\n\nTranslation (${target}):\n${out}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = "translation.txt"; a.click(); URL.revokeObjectURL(url);
  };
  const persist = async () => {
    try {
      await save({ data: { type: "text", source_lang: source, target_lang: target, source_text: text, translated_text: out, tone, starred: false } });
      toast.success("Saved to history");
    } catch (e) { toast.error((e as Error).message); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl">Text Translator</h1>
        <p className="text-muted-foreground text-sm mt-1">Translate between Italian, English, and Urdu with AI grammar enhancement.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-xs text-muted-foreground mr-2">Tone:</span>
        {TONES.map((t) => (
          <button key={t} onClick={() => setTone(t)} className={`text-xs px-3 py-1.5 rounded-full transition capitalize ${tone === t ? "gradient-mint text-primary-foreground shadow-glow" : "glass text-muted-foreground hover:text-foreground"}`}>{t}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
        <motion.div layout className="glass rounded-2xl p-4 flex flex-col">
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-44 mb-2"><SelectValue /></SelectTrigger>
            <SelectContent>{LANGUAGES.map(l => <SelectItem key={l.code} value={l.code}>{l.flag} {l.label}</SelectItem>)}</SelectContent>
          </Select>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste text..." className="flex-1 min-h-56 bg-transparent border-0 resize-none focus-visible:ring-0 text-base" maxLength={5000} />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">{text.length}/5000</span>
            <Button size="sm" onClick={run} disabled={loading || !text.trim()} className="rounded-full gradient-mint text-primary-foreground border-0">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Translate
            </Button>
          </div>
        </motion.div>

        <div className="flex md:flex-col items-center justify-center">
          <button onClick={swap} className="h-12 w-12 rounded-full gradient-mint shadow-glow flex items-center justify-center hover:scale-110 transition" aria-label="Swap">
            <ArrowLeftRight className="h-5 w-5 text-primary-foreground" />
          </button>
        </div>

        <motion.div layout className="glass rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>{LANGUAGES.filter(l => l.code !== "auto").map(l => <SelectItem key={l.code} value={l.code}>{l.flag} {l.label}</SelectItem>)}</SelectContent>
            </Select>
            {conf > 0 && <span className="text-xs text-muted-foreground">Confidence: {(conf * 100).toFixed(0)}%</span>}
          </div>
          <div className={`flex-1 min-h-56 text-base whitespace-pre-wrap ${target === "ur" ? "text-right" : ""}`} dir={target === "ur" ? "rtl" : "ltr"}>
            {loading ? <span className="text-muted-foreground">Translating…</span> : (out || <span className="text-muted-foreground">Translation will appear here.</span>)}
          </div>
          {translit && <div className="mt-2 pt-2 border-t border-border/50 text-sm text-muted-foreground italic">{translit}</div>}
          {out && (
            <div className="flex flex-wrap gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={copy} className="rounded-full glass"><Copy className="h-4 w-4" /></Button>
              <Button size="sm" variant="outline" onClick={speak} className="rounded-full glass"><Volume2 className="h-4 w-4" /></Button>
              <Button size="sm" variant="outline" onClick={download} className="rounded-full glass"><Download className="h-4 w-4" /></Button>
              <Button size="sm" variant="outline" onClick={persist} className="rounded-full glass"><Save className="h-4 w-4" /></Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
