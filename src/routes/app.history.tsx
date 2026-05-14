import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  listTranslations,
  toggleStar,
  deleteTranslation,
} from "@/server-functions/history.functions";
import { useServerFn } from "@tanstack/react-start";
import { Star, Trash2, Loader2 } from "lucide-react";
import { langFlag } from "@/lib/languages";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/app/history")({ component: HistoryPage });

function HistoryPage() {
  const list = useServerFn(listTranslations);
  const star = useServerFn(toggleStar);
  const del = useServerFn(deleteTranslation);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "starred">("all");

  const refresh = async () => {
    setLoading(true);
    const cached = localStorage.getItem("lb-history-cache");
    if (cached) setRows(JSON.parse(cached));
    try {
      const { data } = await supabase.auth.getSession();
      const fresh = await list({
        headers: { Authorization: `Bearer ${data.session?.access_token}` },
      });
      setRows(fresh);
      localStorage.setItem("lb-history-cache", JSON.stringify(fresh));
    } catch (e) {
      if (!cached) toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refresh();
  }, []);

  const filtered =
    filter === "starred"
      ? Array.isArray(rows)
        ? rows.filter((r) => r.starred)
        : []
      : Array.isArray(rows)
        ? rows
        : [];

  return (
    <div>
      <PageHeader
        title="Translation History"
        description="Review, download, or bookmark your edge-cached translations."
        badge={
          <div className="flex gap-2 text-sm bg-black/5 dark:bg-white/5 p-1 rounded-full">
            {(["all", "starred"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full capitalize font-medium transition-all duration-300 ${filter === f ? "bg-white dark:bg-black text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                {f}
              </button>
            ))}
          </div>
        }
      />

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card rounded-lg p-10 text-center text-muted-foreground">
          No translations yet.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="bg-card rounded-lg p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {langFlag(r.source_lang)} → {langFlag(r.target_lang)}
                  </span>
                  <span>·</span>
                  <span className="capitalize">{r.type}</span>
                  {r.tone && (
                    <>
                      <span>·</span>
                      <span className="capitalize">{r.tone}</span>
                    </>
                  )}
                  <span>·</span>
                  <span>{new Date(r.created_at).toLocaleString()}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={async () => {
                      const { data } = await supabase.auth.getSession();
                      await star({
                        data: { id: r.id, starred: !r.starred },
                        headers: { Authorization: `Bearer ${data.session?.access_token}` },
                      });
                      refresh();
                    }}
                  >
                    <Star
                      className={`h-4 w-4 ${r.starred ? "fill-primary text-primary" : "text-muted-foreground"}`}
                    />
                  </button>
                  <button
                    onClick={async () => {
                      const { data } = await supabase.auth.getSession();
                      await del({
                        data: { id: r.id },
                        headers: { Authorization: `Bearer ${data.session?.access_token}` },
                      });
                      refresh();
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="bg-card rounded-xl p-2.5 line-clamp-3">{r.source_text}</div>
                <div
                  className="bg-card rounded-xl p-2.5 line-clamp-3"
                  dir={r.target_lang === "ur" ? "rtl" : "ltr"}
                >
                  {r.translated_text}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
