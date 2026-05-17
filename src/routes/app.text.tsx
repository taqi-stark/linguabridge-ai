import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { translateText } from "@/server-functions/ai.functions";
import { saveTranslation } from "@/server-functions/history.functions";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { LANGUAGES, langBcp47 } from "@/lib/languages";
import { ArrowLeftRight, Copy, Download, Volume2, Save, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/layout/PageHeader";

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
    setSource(target);
    setTarget(source);
    setText(out);
    setOut(text);
  };

  const run = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setOut("");
    setConf(0);

    // Translation Memory (TM) Optimization
    try {
      const tmCache = localStorage.getItem("lb-history-cache");
      if (tmCache) {
        const rows = JSON.parse(tmCache);
        const match = rows.find(
          (r: any) =>
            r.source_text?.trim() === text.trim() &&
            r.target_lang === target &&
            r.source_lang === source,
        );
        if (match) {
          setOut(match.translated_text);
          setConf(1);
          setTranslit("");
          toast.success("TM Match: Saved compute cost ⚡");

          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error("TM Parse error", e);
    }

    try {
      const g_rules = localStorage.getItem("lb-glossary") || "";
      const locksRaw = localStorage.getItem("lb-locked-terms");
      let g_locks = "";
      if (locksRaw) {
        try {
          const lks = JSON.parse(locksRaw);
          if (lks.length > 0)
            g_locks =
              "ABSOLUTE TERM LOCKS (DO NOT VIOLATE):\n" +
              lks
                .map((t: any) => `- ${t.term} MUST BE TRANSLATED EXACTLY AS: ${t.lock}`)
                .join("\n");
        } catch (e) {}
      }
      const glossary = [g_rules, g_locks].filter(Boolean).join("\n\n");
      const r = await tr({
        data: { text, source, target, tone, wantTransliteration: target === "ur", glossary },
      });
      setOut(r.translation);
      setConf(r.confidence);
      setTranslit(r.transliteration);

    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const speak = () => {
    if (!out || typeof window === "undefined") return;
    const u = new SpeechSynthesisUtterance(out);
    u.lang = langBcp47(target);
    speechSynthesis.speak(u);
  };

  const copy = () => {
    navigator.clipboard.writeText(out);
    toast.success("Copied");
  };
  const download = () => {
    const blob = new Blob([`Source (${source}):\n${text}\n\nTranslation (${target}):\n${out}`], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "translation.txt";
    a.click();
    URL.revokeObjectURL(url);
  };
  const persist = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      await save({
        data: {
          type: "text",
          source_lang: source,
          target_lang: target,
          source_text: text,
          translated_text: out,
          tone,
          starred: false,
        },
        headers: { Authorization: `Bearer ${data.session?.access_token}` },
      });
      toast.success("Saved to history");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div>
      <PageHeader
        title="Text Translator"
        description="Translate between Italian, English, and Urdu with AI grammar enhancement."
      />

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-xs text-muted-foreground mr-2">Tone:</span>
        {TONES.map((t) => (
          <button
            key={t}
            onClick={() => setTone(t)}
            className={`text-xs px-3 py-1.5 rounded-full transition capitalize ${tone === t ? "bg-primary text-primary-foreground text-primary-foreground shadow-sm" : "bg-card text-muted-foreground hover:text-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
        <motion.div layout className="bg-card rounded-lg p-4 flex flex-col">
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-44 mb-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  {l.flag} {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text..."
            className="flex-1 min-h-32 lg:min-h-56 bg-transparent border-0 resize-none focus-visible:ring-0 text-base"
            maxLength={5000}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">{text.length}/5000</span>
            <Button
              size="sm"
              onClick={run}
              disabled={loading || !text.trim()}
              className="rounded-full bg-primary text-primary-foreground text-primary-foreground border-0"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}{" "}
              Translate
            </Button>
          </div>
        </motion.div>

        <div className="flex md:flex-col items-center justify-center">
          <button
            onClick={swap}
            className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-sm flex items-center justify-center hover:scale-110 transition"
            aria-label="Swap"
          >
            <ArrowLeftRight className="h-5 w-5 text-primary-foreground" />
          </button>
        </div>

        <motion.div layout className="bg-card rounded-lg p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger className="w-44">
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
            {conf > 0 && (
              <span className="text-xs text-muted-foreground">
                Confidence: {(conf * 100).toFixed(0)}%
              </span>
            )}
          </div>
          <div
            className={`flex-1 min-h-32 lg:min-h-56 text-base whitespace-pre-wrap flex flex-col ${target === "ur" ? "text-right" : ""}`}
            dir={target === "ur" ? "rtl" : "ltr"}
          >
            {loading ? (
              <span className="text-muted-foreground">Translating…</span>
            ) : (
              out || <span className="text-muted-foreground">Translation will appear here.</span>
            )}
          </div>
          {translit && (
            <div className="mt-2 pt-2 border-t border-border/50 text-sm text-muted-foreground italic">
              {translit}
            </div>
          )}
          {out && (
            <div className="flex flex-wrap gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={copy} className="rounded-full bg-card">
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={speak} className="rounded-full bg-card">
                <Volume2 className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={download} className="rounded-full bg-card">
                <Download className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={persist} className="rounded-full bg-card">
                <Save className="h-4 w-4" />
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
