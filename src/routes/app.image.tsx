import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { LANGUAGES } from "@/lib/languages";
import { ocrAndTranslate } from "@/server/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

export const Route = createFileRoute("/app/image")({ component: ImagePage });

function ImagePage() {
  const [target, setTarget] = useState("en");
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ extracted_text: string; translation: string; confidence: number; document_type: string } | null>(null);
  const ocr = useServerFn(ocrAndTranslate);

  const onFile = async (file?: File) => {
    if (!file) return;
    if (file.size > 6_000_000) return toast.error("Max 6MB");
    const reader = new FileReader();
    reader.onload = async () => {
      const url = String(reader.result);
      setPreview(url); setResult(null); setLoading(true);
      try { const r = await ocr({ data: { imageDataUrl: url, target } }); setResult(r); }
      catch (e) { toast.error((e as Error).message); }
      finally { setLoading(false); }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl">Image / OCR Translator</h1>
          <p className="text-muted-foreground text-sm mt-1">Drop an image — we extract text and translate it.</p>
        </div>
        <Select value={target} onValueChange={setTarget}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>{LANGUAGES.filter(l => l.code !== "auto").map(l => <SelectItem key={l.code} value={l.code}>{l.flag} {l.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <label className={`relative glass rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary/60 transition cursor-pointer flex flex-col items-center justify-center min-h-72 p-6 ${loading ? "scan-line" : ""}`}>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          {preview ? (
            <img src={preview} alt="upload" className="max-h-96 rounded-xl shadow-elegant" />
          ) : (
            <div className="text-center text-muted-foreground">
              <Upload className="h-10 w-10 mx-auto mb-3 text-primary" />
              <div className="font-medium text-foreground">Drop or click to upload</div>
              <div className="text-xs mt-1">PNG · JPG · HEIC · up to 6MB</div>
            </div>
          )}
        </label>

        <motion.div layout className="glass rounded-2xl p-5 min-h-72">
          {loading && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Extracting & translating…</div>}
          {result && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase">{result.document_type}</span>
                <span className="text-xs glass rounded-full px-2 py-0.5">Confidence {(result.confidence * 100).toFixed(0)}%</span>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Extracted text</div>
                <div className="glass rounded-xl p-3 text-sm whitespace-pre-wrap max-h-40 overflow-auto">{result.extracted_text}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Translation ({target})</div>
                <div className="glass rounded-xl p-3 text-sm whitespace-pre-wrap" dir={target === "ur" ? "rtl" : "ltr"}>{result.translation}</div>
              </div>
            </div>
          )}
          {!loading && !result && (
            <div className="text-muted-foreground text-sm flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Upload an image to begin.</div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
