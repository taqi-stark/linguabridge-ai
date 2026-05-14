import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listTranslations } from "@/server-functions/history.functions";
import { Bookmark, Loader2, CheckCircle2, XCircle, BrainCircuit, ShieldAlert, ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/layout/PageHeader";
import { toast } from "sonner";

export const Route = createFileRoute("/app/saved")({ component: SavedPage });

function SavedPage() {
  const list = useServerFn(listTranslations);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<Record<string, "show" | "hide">>({});
  const [mastery, setMastery] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      setMastery(JSON.parse(localStorage.getItem("lb-mastery") || "{}"));
    } catch (e) {}
    // Optimistic Offline cache load
    const cached = localStorage.getItem("lb-history-cache");
    if (cached) {
      const arr = JSON.parse(cached);
      setRows(arr.filter((a: any) => a.starred));
      setLoading(false);
    }

    supabase.auth.getSession().then(({ data }) => {
      list({ headers: { Authorization: `Bearer ${data.session?.access_token}` } })
        .then((res) => {
          const arr = Array.isArray(res) ? res : [];
          setRows(arr.filter((a) => a.starred));
          localStorage.setItem("lb-history-cache", JSON.stringify(arr));
          setLoading(false);
        })
        .catch((e) => {
          if (!cached) setLoading(false);
        });
    });
  }, []);

  const updateMastery = (id: string, delta: number, actionLog: string) => {
    setMastery((prev) => {
      const m = Math.min(100, Math.max(0, (prev[id] || 0) + delta));
      const next = { ...prev, [id]: m };
      localStorage.setItem("lb-mastery", JSON.stringify(next));
      return next;
    });
    setReviewing((r) => ({ ...r, [id]: "hide" }));
    
    // Add XP & Global Study count
    try {
       const todayCount = parseInt(localStorage.getItem("lb-studied-today") || "12") + 1;
       localStorage.setItem("lb-studied-today", todayCount.toString());
       const xpCount = parseInt(localStorage.getItem("lb-xp") || "350") + (delta > 0 ? 10 : 2);
       localStorage.setItem("lb-xp", xpCount.toString());
    } catch(e) {}
    
    toast.success(`Marked as ${actionLog}`);
  };

  if (loading)
    return (
      <div className="p-10 flex items-center gap-2">
        <Loader2 className="animate-spin h-5 w-5" /> Loading study deck...
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Study Deck"
        description="Review your starred translations using flashcards."
        badge={
          <div className="text-sm font-medium bg-black/5 dark:bg-white/5 border border-border/30 px-3 py-1.5 rounded-full">
            {rows.length} Cards
          </div>
        }
      />

      {rows.length === 0 ? (
        <div className="bg-card rounded-xl p-10 text-center shadow-sm mt-10">
          <Bookmark className="h-12 w-12 mx-auto text-primary mb-3" />
          <p className="text-muted-foreground">
            Star translations in{" "}
            <Link to="/app/history" className="text-primary hover:underline">
              History
            </Link>{" "}
            to build your deck.
          </p>
        </div>
      ) : (
        <div className="w-full mt-6 flex flex-col gap-3">
          <div className="grid grid-cols-12 gap-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            <div className="col-span-5">Source Term</div>
            <div className="col-span-4">Recall</div>
            <div className="col-span-3 text-right">Mastery (SRS)</div>
          </div>

          {rows.map((row: any) => (
            <div
              key={row.id}
              className="bg-card rounded-lg p-4 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center"
            >
              <div className="col-span-5 w-full font-display text-lg">
                <span className="text-[10px] uppercase text-muted-foreground block mb-1">
                  {row.source_lang}
                </span>
                {row.source_text}
              </div>

              <div className="col-span-4 w-full flex items-center justify-start">
                {!reviewing[row.id] || reviewing[row.id] === "hide" ? (
                  <Button
                    variant="ghost"
                    onClick={() => setReviewing((r) => ({ ...r, [row.id]: "show" }))}
                    className="text-xs bg-primary text-primary-foreground text-primary-foreground rounded-full w-full max-w-[140px] shadow-sm"
                  >
                    Reveal Answer
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2 w-full">
                    <span className="font-display text-lg text-primary-glow">
                      {row.translated_text}
                    </span>
                    <div className="flex flex-wrap gap-2 mt-1 w-full justify-between sm:justify-start">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs border-red-500/30 text-red-500 hover:bg-red-500/10 flex-1 sm:flex-none"
                        onClick={() => updateMastery(row.id, -20, "Hard")}
                      >
                         Hard (-20%)
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs border-blue-500/30 text-blue-500 hover:bg-blue-500/10 flex-1 sm:flex-none"
                        onClick={() => updateMastery(row.id, 10, "Good")}
                      >
                        Good (+10%)
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 flex-1 sm:flex-none"
                        onClick={() => updateMastery(row.id, 25, "Easy")}
                      >
                        Easy (+25%)
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="col-span-3 w-full flex items-center justify-end gap-3 opacity-80">
                <div className="w-24 h-2 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${mastery[row.id] || 0}%` }}
                  />
                </div>
                <span className="text-xs font-mono w-8 text-right">{mastery[row.id] || 0}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
