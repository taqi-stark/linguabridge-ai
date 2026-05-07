import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Bot, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { assistantChat } from "@/server/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

export const Route = createFileRoute("/app/assistant")({ component: AssistantPage });

const SUGGEST = [
  "Explain this Italian university letter",
  "Summarize this immigration document",
  "Write a formal reply in Italian",
  "What deadlines should I watch for?",
];

function AssistantPage() {
  const [msgs, setMsgs] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chat = useServerFn(assistantChat);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs, loading]);

  const send = async (text?: string) => {
    const t = (text ?? input).trim();
    if (!t || loading) return;
    const next = [...msgs, { role: "user" as const, content: t }];
    setMsgs(next); setInput(""); setLoading(true);
    try {
      const r = await chat({ data: { messages: next } });
      setMsgs([...next, { role: "assistant", content: r.reply }]);
    } catch (e) { toast.error((e as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)]">
      <div className="mb-4">
        <h1 className="font-display text-3xl flex items-center gap-2"><Bot className="h-7 w-7 text-primary" /> AI Assistant</h1>
        <p className="text-muted-foreground text-sm">Ask anything about your translations or documents.</p>
      </div>

      <div className="flex-1 glass rounded-2xl p-4 overflow-y-auto space-y-4">
        {msgs.length === 0 && (
          <div className="text-center py-10">
            <Bot className="h-12 w-12 mx-auto text-primary mb-3" />
            <div className="text-muted-foreground text-sm mb-4">Try one of these:</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGEST.map(s => <button key={s} onClick={() => send(s)} className="text-xs glass rounded-full px-3 py-1.5 hover:ring-glow">{s}</button>)}
            </div>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "glass" : "gradient-mint"}`}>
              {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary-foreground" />}
            </div>
            <div className={`glass rounded-2xl px-4 py-3 max-w-[80%] prose prose-sm dark:prose-invert prose-p:my-1 prose-headings:my-2 ${m.role === "user" ? "" : "shadow-glow"}`}>
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <div className="flex gap-3"><div className="h-8 w-8 rounded-full gradient-mint flex items-center justify-center"><Bot className="h-4 w-4 text-primary-foreground" /></div><div className="glass rounded-2xl px-4 py-3"><Loader2 className="h-4 w-4 animate-spin" /></div></div>}
        <div ref={endRef} />
      </div>

      <div className="mt-3 flex gap-2 items-end">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }}} placeholder="Message the assistant…" className="flex-1 min-h-12 max-h-40 glass border-0 resize-none" />
        <Button onClick={() => send()} disabled={loading || !input.trim()} className="rounded-full gradient-mint text-primary-foreground border-0 shadow-glow h-12 w-12 p-0"><Send className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
