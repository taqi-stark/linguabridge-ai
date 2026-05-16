import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import {
  Mic,
  Square,
  PlaySquare,
  GraduationCap,
  Volume2,
  Send,
  Loader2,
  ArrowLeft,
  AlertTriangle,
  Utensils,
  Plane,
  Building,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { LANGUAGES, langBcp47 } from "@/lib/languages";
import { roleplayChat, translateText, analyzeSentence } from "@/server-functions/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/app/roleplay")({ 
  component: RoleplayPage,
  validateSearch: z.object({
    lang: z.string().optional(),
    scenario: z.string().optional()
  })
});

const SCENARIOS = [
  {
    id: "restaurant",
    title: "Ordering Food at a Restaurant",
    icon: <Utensils className="h-10 w-10 text-primary" />,
    desc: "Practice ordering, asking for recommendations, and paying the bill.",
  },
  {
    id: "airport",
    title: "Navigating the Airport",
    icon: <Plane className="h-10 w-10 text-primary" />,
    desc: "Checking in, finding your gate, and passing security.",
  },
  {
    id: "hotel",
    title: "Checking into a Hotel",
    icon: <Building className="h-10 w-10 text-primary" />,
    desc: "Booking a room, asking about amenities, and checking out.",
  },
  {
    id: "job",
    title: "Job Interview",
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    desc: "A formal scenario answering questions about your experience.",
  },
];

function RoleplayPage() {
  const search = Route.useSearch();
  const [targetLang, setTargetLang] = useState(search.lang || "it");
  const [scenario, setScenario] = useState<string | null>(search.scenario ? "custom" : null);
  const [scenarioTitle, setScenarioTitle] = useState<string | null>(search.scenario || null);

  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string; translation?: string; cefr?: string; score?: number; suggestions?: string[]; correction?: string | null }[]
  >([]);
  const [inputText, setInputText] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inlineTrans, setInlineTrans] = useState<Record<number, string>>({});
  const [transLoading, setTransLoading] = useState<Record<number, boolean>>({});
  const [analysis, setAnalysis] = useState<Record<number, any>>({});
  const [analysisLoading, setAnalysisLoading] = useState<Record<number, boolean>>({});

  const recRef = useRef<any>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const playRef = useServerFn(roleplayChat);
  const textTr = useServerFn(translateText);
  const analyzeRef = useServerFn(analyzeSentence);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.continuous = false;
    r.interimResults = false;
    r.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setInputText(text);
    };
    r.onend = () => setListening(false);
    recRef.current = r;
  }, []);

  useEffect(() => {
    if (search.scenario && search.lang) {
      setTargetLang(search.lang);
      startScenario("custom", search.scenario);
    }
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Clean up any speaking when the component is closed
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const startListening = () => {
    if (!recRef.current) return toast.error("Speech recognition not supported in your browser.");
    recRef.current.lang = langBcp47(targetLang);
    recRef.current.start();
    setListening(true);
  };

  const stopListening = () => {
    recRef.current?.stop();
    setListening(false);
  };

  const sendMessageText = async (text: string, overrideTitle?: string) => {
    const activeScenarioTitle = overrideTitle || scenarioTitle || SCENARIOS.find((s) => s.id === scenario)?.title || "";
    if (!text.trim() || !activeScenarioTitle) return;
    const newMsgs = [...messages, { role: "user" as const, content: text }];
    setMessages(newMsgs);
    setInputText("");
    setLoading(true);
    
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    try {
      const res = await playRef({
        data: {
          messages: newMsgs,
          scenario: activeScenarioTitle,
          targetLanguage: targetLang,
        },
      });
      setMessages([
        ...newMsgs,
        { role: "assistant", content: res.reply, translation: res.translation, cefr: res.cefr, score: res.score, suggestions: res.suggestions, correction: res.correction },
      ]);

      if (typeof window !== "undefined" && window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance(res.reply.replace(/\[.*?\]/g, ""));
        u.lang = langBcp47(targetLang);
        window.speechSynthesis.speak(u);
      }
    } catch (e) {
      toast.error((e as Error).message);
      setMessages(newMsgs.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const startScenario = (id: string, customTitle?: string) => {
    setScenario(id);
    const title = customTitle || SCENARIOS.find(s => s.id === id)?.title;
    if (title) setScenarioTitle(title);
    
    setMessages([]);
    setInputText("");
    setInlineTrans({});
    setTimeout(() => {
      sendMessageText("Hi, let's start the roleplay simulation.", title);
    }, 500);
  };

  const decodeInline = async (idx: number, txt: string) => {
    if (inlineTrans[idx]) return;
    setTransLoading((prev) => ({ ...prev, [idx]: true }));
    try {
      const res = await textTr({
        data: { text: txt, source: targetLang, target: "en", tone: "neutral", contextType: "text" },
      });
      setInlineTrans((prev) => ({ ...prev, [idx]: res.translation }));
    } catch (e) {
      toast.error("Translation fail: " + (e as Error).message);
    } finally {
      setTransLoading((prev) => ({ ...prev, [idx]: false }));
    }
  };

  const getAnalysis = async (idx: number, txt: string) => {
    if (analysis[idx]) {
      setAnalysis((prev) => { const n = {...prev}; delete n[idx]; return n; })
      return;
    }
    setAnalysisLoading((prev) => ({ ...prev, [idx]: true }));
    try {
      const res = await analyzeRef({
        data: { sentence: txt, targetLanguage: targetLang },
      });
      setAnalysis((prev) => ({ ...prev, [idx]: res }));
    } catch (e) {
      toast.error("Analysis fail: " + (e as Error).message);
    } finally {
      setAnalysisLoading((prev) => ({ ...prev, [idx]: false }));
    }
  };

  const replayAudio = (txt: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(txt.replace(/\[.*?\]/g, ""));
    u.lang = langBcp47(targetLang);
    window.speechSynthesis.speak(u);
  };

  const stopAudio = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
  };

  return (
    <div className="flex flex-col h-full h-[calc(100vh-8rem)]">
      <PageHeader
        title="Roleplay Coach"
        description="Immerse yourself perfectly in realistic interactive scenarios."
        badge={
          <Select value={targetLang} onValueChange={setTargetLang} disabled={scenario !== null}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.filter((l) => l.code !== "auto" && l.code !== "en").map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  {l.flag} {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {!scenario ? (
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {SCENARIOS.map((s) => (
            <motion.div
              key={s.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => startScenario(s.id)}
              className="bg-card rounded-xl p-6 cursor-pointer shadow-sm border border-border/50 hover:border-primary/50 transition-colors"
            >
              <div className="mb-4">{s.icon}</div>
              <h3 className="font-display text-xl mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0 bg-card/40 rounded-xl border border-border/50 overflow-hidden shadow-sm relative">
          <div className="bg-card px-6 py-4 flex items-center justify-between z-10 border-b border-border/50">
            <div className="flex items-center gap-4">
               <button
                 onClick={() => {
                   stopAudio();
                   setScenario(null);
                 }}
                 className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground"
               >
                 <ArrowLeft className="h-5 w-5" />
               </button>
               <div className="font-display text-lg">
                 Simulation: {scenarioTitle || SCENARIOS.find((s) => s.id === scenario)?.title}
               </div>
            </div>
            
            <Button onClick={stopAudio} variant="outline" size="sm" className="rounded-full shadow-sm">
              <Square className="h-4 w-4 mr-2" /> Stop Audio
            </Button>
          </div>

          <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.slice(1).map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="flex flex-col gap-1 max-w-[95%] sm:max-w-[85%]">
                  <div
                    className={`rounded-lg px-5 py-3 ${m.role === "user" ? "bg-primary text-primary-foreground text-primary-foreground rounded-tr-sm shadow-sm" : "bg-card rounded-tl-sm"}`}
                  >
                    {m.correction && (
                      <div className="mt-0 mb-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm shadow-sm transition-all overflow-hidden animate-in zoom-in-95">
                        <span className="font-bold flex items-center gap-1.5 mb-1 text-[13px] uppercase tracking-wide"><AlertTriangle className="h-3.5 w-3.5"/> Coach Correction</span>
                        {m.correction}
                      </div>
                    )}
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    {(m.translation || inlineTrans[i]) && (
                      <div className="mt-3 pt-3 border-t border-border/40 text-[15px] text-primary-glow font-medium italic !text-foreground opacity-90 leading-relaxed">
                        {m.translation || inlineTrans[i]}
                      </div>
                    )}
                  </div>
                  {m.role === "assistant" && (
                    <div className="flex items-center gap-3 pl-2 mt-1">
                      {m.cefr && m.cefr !== "N/A" && (
                        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wide">
                          <span className="text-primary-glow">CEFR est: {m.cefr}</span>
                          <span className="text-muted-foreground">•</span>
                          <span
                            className={
                              m.score && m.score > 80 ? "text-green-400" : "text-yellow-400"
                            }
                          >
                            Pronunciation: {m.score}%
                          </span>
                        </div>
                      )}
                      {!m.translation && !inlineTrans[i] && (
                        <button
                          onClick={() => decodeInline(i, m.content)}
                          disabled={transLoading[i]}
                          className="text-[10px] uppercase font-bold tracking-wide text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                        >
                          {transLoading[i] ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            "Translate"
                          )}
                        </button>
                      )}
                      
                      <button
                        onClick={() => getAnalysis(i, m.content)}
                        disabled={analysisLoading[i]}
                        className="text-[10px] uppercase font-bold tracking-wide text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                      >
                        {analysisLoading[i] ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <><BookOpen className="h-3 w-3"/> Analyze Breakdown</>
                        )}
                      </button>

                      <button
                        onClick={() => replayAudio(m.content)}
                        className="text-[10px] uppercase font-bold tracking-wide text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <Volume2 className="h-3 w-3" /> Replay
                      </button>
                    </div>
                  )}
                  {analysis[i] && (
                    <div className="mt-2 text-sm bg-card border border-border/60 rounded-lg p-4 shadow-sm animate-in zoom-in-95 duration-200">
                      <div className="flex gap-2 items-center mb-3 text-primary font-medium border-b border-border/50 pb-2">
                        <BookOpen className="h-4 w-4"/> Syntax Analysis
                      </div>
                      <div className="italic text-muted-foreground mb-4 text-[13px] border-l-2 border-primary/30 pl-3 py-1">"{analysis[i].literal_translation}"</div>
                      <div className="space-y-3 mb-4">
                        {analysis[i].words?.map((w: any, k: number) => (
                          <div key={k} className="flex flex-wrap items-center gap-2 text-[13px]">
                            <span className="font-bold text-foreground px-1.5 py-0.5 rounded-md bg-muted/60">{w.word}</span>
                            <span className="text-muted-foreground">({w.base_form})</span>
                            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm uppercase tracking-wider">{w.grammar_role}</span>
                            <span className="text-muted-foreground max-w-[200px] truncate">— {w.meaning}</span>
                          </div>
                        ))}
                      </div>
                      {analysis[i].slang_idioms && analysis[i].slang_idioms !== "None" && (
                        <div className="mb-4 bg-orange-500/10 border border-orange-500/20 text-orange-700 dark:text-orange-400 p-3 rounded-md text-[13px] leading-relaxed">
                          <span className="font-bold uppercase text-[10px] tracking-widest block mb-1">Cultural Note</span>
                          {analysis[i].slang_idioms}
                        </div>
                      )}
                      {analysis[i].how_to_reply?.length > 0 && (
                        <div>
                           <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-2 block">How to respond:</span>
                           <ul className="list-disc pl-5 space-y-1.5 text-[13px] text-muted-foreground">
                              {analysis[i].how_to_reply.map((r: string, rid: number) => <li key={rid}>{r}</li>)}
                           </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-card rounded-lg rounded-tl-sm px-5 py-4 flex items-center gap-2 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" />
                  <div
                    className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  />
                </div>
              </div>
            )}

            {/* Smart Pills rendering at bottom of chat */}
            {!loading && messages.length > 0 && messages[messages.length - 1].role === "assistant" && messages[messages.length - 1].suggestions && messages[messages.length - 1].suggestions!.length > 0 && (
              <div className="flex flex-col gap-2.5 pt-2 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Suggested Replies:</span>
                <div className="flex flex-wrap gap-2">
                  {messages[messages.length - 1].suggestions!.map((syg, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputText(syg)}
                      className="px-4 py-2 rounded-full border border-primary/30 bg-primary/5 hover:bg-primary/20 text-primary transition-colors text-[13px] font-medium shadow-sm text-left align-middle"
                    >
                      {syg}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-card z-10 flex items-end gap-3 rounded-b-3xl">
            <button
              onClick={listening ? stopListening : startListening}
              className={`h-[52px] w-[52px] shrink-0 rounded-full flex items-center justify-center transition-all ${listening ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-card hover:bg-accent text-foreground"}`}
            >
              {listening ? (
                <Square className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5 text-primary" />
              )}
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessageText(inputText)}
                placeholder="Type or speak your reply..."
                className="w-full h-[52px] rounded-full bg-card px-6 pr-14 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/40 border-0"
              />
              <button
                onClick={() => sendMessageText(inputText)}
                disabled={!inputText.trim() || loading}
                className="absolute right-2 top-2 h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-primary-foreground disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
