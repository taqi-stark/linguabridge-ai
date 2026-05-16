import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import {
  FileText,
  Loader2,
  Upload,
  Download,
  FileJson,
  FileCode2,
  Image as ImageIcon,
  AlertTriangle,
  RefreshCcw,
  GraduationCap,
  Camera,
  Wand2,
} from "lucide-react";
import { translateText, ocrAndTranslate, magicDocumentAutofill } from "@/server-functions/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { LANGUAGES } from "@/lib/languages";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";

export const Route = createFileRoute("/app/document")({ component: FileTranslator });

function FileTranslator() {
  const [target, setTarget] = useState("it");
  const [loading, setLoading] = useState(false);

  // Document State
  const [progress, setProgress] = useState<number | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultRawUrl, setResultRawUrl] = useState<string | null>(null);
  const [resultName, setResultName] = useState("");
  const [chunksRaw, setChunksRaw] = useState<string[]>([]);
  const [chunksTrans, setChunksTrans] = useState<string[]>([]);

  // Image/OCR State
  const [isImageMode, setIsImageMode] = useState(false);
  const [magicFillMode, setMagicFillMode] = useState(false);
  const [liveLensMode, setLiveLensMode] = useState(false);
  const videoRef = import("react").then((m) => m.useRef<HTMLVideoElement>(null));
  const activeVideoRef = React.useRef<HTMLVideoElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [ocrResult, setOcrResult] = useState<{
    extracted_text: string;
    translation: string;
    confidence: number;
    document_type: string;
    detected_language?: string;
  } | null>(null);
  const [mutableText, setMutableText] = useState("");
  const [retranslating, setRetranslating] = useState(false);

  const tr = useServerFn(translateText);
  const ocr = useServerFn(ocrAndTranslate);
  const autofillFn = useServerFn(magicDocumentAutofill);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 1200;
          let width = img.width;
          let height = img.height;
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.6));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processImage = async (file: File) => {
    setIsImageMode(true);
    setPreview(URL.createObjectURL(file));
    setOcrResult(null);
    setLoading(true);
    try {
      const glossary = localStorage.getItem("lb-glossary") || "";
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id || "anon";

      const compressedUrl = await compressImage(file);
      const r = await ocr({ data: { imageDataUrl: compressedUrl, target, glossary, userId } });
      setOcrResult(r);
      setMutableText(r.extracted_text);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (liveLensMode) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => { if (activeVideoRef.current) activeVideoRef.current.srcObject = stream; })
        .catch((e) => toast.error("Camera access denied or unavailable."));
    } else {
      if (activeVideoRef.current?.srcObject) {
         (activeVideoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    }
  }, [liveLensMode]);

  const captureLens = () => {
    if (!activeVideoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = activeVideoRef.current.videoWidth || 1080;
    canvas.height = activeVideoRef.current.videoHeight || 1920;
    canvas.getContext("2d")?.drawImage(activeVideoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
    
    // convert base64 to file
    var arr = dataUrl.split(","), mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    var bstr = atob(arr[arr.length - 1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    const f = new File([u8arr], "live_lens_capture.jpg", { type: mime });
    
    setLiveLensMode(false);
    processImage(f);
  };

  const processDocument = async (file: File) => {
    setIsImageMode(false);
    setLoading(true);
    setProgress(0);
    setResultUrl(null);
    setResultRawUrl(null);
    setChunksRaw([]);
    setChunksTrans([]);
    try {
      const isJson = file.name.endsWith(".json");
      const isPdf = file.name.endsWith(".pdf") || file.type === "application/pdf";
      const ext = file.name.split(".").pop() || "txt";

      let chunks: string[] = [];
      let originalText = "";

      if (isPdf) {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items
            .map((item) => ("str" in item ? String(item.str) : ""))
            .join(" ");
          if (pageText.trim()) chunks.push(pageText);
        }
      } else if (isJson) {
        originalText = await file.text();
        const obj = JSON.parse(originalText);
        chunks = Object.values(obj).filter((v) => typeof v === "string") as string[];
      } else {
        originalText = await file.text();
        chunks = originalText.split(/\n\n+/).filter(Boolean);
      }

      let translatedTxt = "";
      const outJson: Record<string, string> = {};
      const glossary = localStorage.getItem("lb-glossary") || "";
      setChunksRaw(chunks);
      const tempOut: string[] = [];

      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id || "anon";

      for (let i = 0; i < chunks.length; i++) {
        setProgress(Math.round((i / chunks.length) * 100));
        const req = {
          data: {
            text: chunks[i],
            source: "auto",
            target,
            tone: "neutral" as const,
            wantTransliteration: false,
            glossary,
            contextType: "document" as const,
            userId,
          },
        };
        const res = await tr(req);
        if (isJson) {
          const keys = Object.keys(JSON.parse(originalText)).filter(
            (k) => typeof JSON.parse(originalText)[k] === "string",
          );
          outJson[keys[i]] = res.translation;
        }
        translatedTxt += res.translation + "\n\n";

        tempOut.push(res.translation);
        setChunksTrans([...tempOut]);
      }

      setProgress(100);

      let blob;
      let rawBlob;

      if (isPdf) {
        const doc = new jsPDF();
        const pWidth = doc.internal.pageSize.getWidth();
        const splitText = doc.splitTextToSize(translatedTxt, pWidth - 20);
        let cursorY = 15;
        for (const line of splitText) {
          if (cursorY > 280) {
            doc.addPage();
            cursorY = 15;
          }
          doc.text(line, 10, cursorY);
          cursorY += 7;
        }
        blob = new Blob([doc.output("arraybuffer")], { type: "application/pdf" });
        rawBlob = new Blob([translatedTxt], { type: "text/plain" });
      } else if (isJson) {
        blob = new Blob([JSON.stringify(outJson, null, 2)], { type: "application/json" });
        rawBlob = new Blob([translatedTxt], { type: "text/plain" });
      } else {
        blob = new Blob([translatedTxt], { type: "text/plain" });
        rawBlob = blob;
      }

      setResultUrl(URL.createObjectURL(blob));
      setResultRawUrl(URL.createObjectURL(rawBlob));
      setResultName(file.name.replace(`.${ext}`, `_${target}.${ext}`));
      toast.success("Document completely translated!");
    } catch (e) {
      toast.error("Failed to process document: " + (e as Error).message);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(null), 2000);
    }
  };

  const processFile = (file?: File) => {
    if (!file) return;
    if (file.size > 20_000_000) return toast.error("File excessively large. Limit to 20MB.");
    if (file.type.startsWith("image/")) processImage(file);
    else processDocument(file);
  };

  const forceRetranslate = async () => {
    if (!mutableText) return;
    setRetranslating(true);
    try {
      const glossary = localStorage.getItem("lb-glossary") || "";
      const r = await tr({
        data: {
          text: mutableText,
          source: ocrResult?.detected_language || "auto",
          target,
          tone: "neutral",
          wantTransliteration: false,
          glossary,
        },
      });
      setOcrResult((prev) => (prev ? { ...prev, translation: r.translation } : null));
      toast.success("Retranslated successfully based on edits!");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setRetranslating(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="File Translator"
        description="Drop images, PDFs, or structured documents. We automatically detect and natively translate them."
      />
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2 bg-card rounded-full p-1 border border-border/50">
           <Button variant={!magicFillMode ? "secondary" : "ghost"} size="sm" className="rounded-full px-5 text-xs font-semibold" onClick={() => setMagicFillMode(false)}>Standard Translation</Button>
           <Button variant={magicFillMode ? "secondary" : "ghost"} size="sm" className={`rounded-full px-5 text-xs font-semibold gap-2 ${magicFillMode ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground hover:text-primary"}`} onClick={() => setMagicFillMode(true)}><Wand2 className="h-3 w-3" /> Magic Autofill</Button>
        </div>
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
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Upload Zone */}
        <label
          className={`relative bg-card rounded-xl border-2 border-dashed border-primary/40 hover:border-primary/80 transition cursor-pointer flex flex-col items-center justify-center min-h-[400px] p-6 text-center ${loading ? "opacity-50 pointer-events-none" : ""}`}
        >
          <input
            type="file"
            accept=".pdf,.txt,.md,.json,.csv,image/*"
            className="hidden"
            onChange={(e) => processFile(e.target.files?.[0])}
            disabled={loading}
          />

          {loading && !isImageMode ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <div className="font-display text-lg">Parsing File Chunks...</div>
              {progress !== null && (
                <div className="w-full max-w-xs mt-3 h-2 bg-foreground/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          ) : preview && isImageMode && !magicFillMode ? (
            <img
              src={preview}
              alt="upload"
              className="max-h-80 rounded-xl shadow-sm object-contain"
            />
          ) : magicFillMode ? (
            <>
              <Wand2 className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-display text-xl text-primary-glow">Autonomous AI Copilot</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-[280px]">
                Drop destination government PDFs here. We will instantly extract data from your native vault documents and autofill the form.
              </p>
              <div className="mt-8">
                 <Button onClick={async (e) => {
                     e.preventDefault();
                     setLoading(true);
                     try {
                        const r = await autofillFn({ data: { targetForm: 'mock', userVaultData: 'mock' } });
                        toast.success(r.message);
                        setChunksRaw(["Bureaucracy Field Mapping Completed"]);
                        setChunksTrans([JSON.stringify(r.mappedFields, null, 2)]);
                        setResultName("Autofilled_Form.pdf");
                        setIsImageMode(false);
                     } catch(err) {} finally { setLoading(false); }
                 }} className="bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30 rounded-full font-semibold shadow-sm w-full"><Wand2 className="mr-2 h-4 w-4"/> Inject Dummy Vault Data</Button>
              </div>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-display text-xl">Upload System</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-[250px]">
                Drop PDFs, images, documents, or JSON files. Over 20MB is fully supported.
              </p>
              <div className="flex items-center gap-3 mt-6 text-muted-foreground">
                <FileText className="h-5 w-5" /> <ImageIcon className="h-5 w-5" />{" "}
                <FileCode2 className="h-5 w-5" /> <FileJson className="h-5 w-5" />
              </div>
              <div className="mt-8 relative z-20">
                <Button 
                  onClick={(e) => { e.preventDefault(); setLiveLensMode(true); }}
                  variant="outline" 
                  className="rounded-full bg-card border border-primary/40 text-primary hover:bg-primary/10 pointer-events-auto shadow-sm"
                >
                  <Camera className="mr-2 h-4 w-4"/> Open Live Lens AR
                </Button>
              </div>
            </>
          )}
        </label>

        {/* Dynamic Display Zone */}
        <div className="bg-card rounded-xl min-h-[400px] flex flex-col shadow-sm border border-border/50 overflow-hidden relative">
          
          {/* LIVE LENS AR MODE */}
          {liveLensMode && (
             <div className="fixed inset-0 z-[100] bg-black flex flex-col">
               <video ref={activeVideoRef} autoPlay playsInline muted className="flex-1 object-cover w-full opacity-80" />
               <div className="absolute inset-x-0 bottom-12 flex justify-center z-10">
                 <button onClick={captureLens} className="w-16 h-16 shadow-[0_0_20px_rgba(255,255,255,0.4)] rounded-full bg-white/20 border-4 border-white flex items-center justify-center hover:bg-white/40 backdrop-blur-md transition-colors" />
               </div>
               <button onClick={() => setLiveLensMode(false)} className="absolute top-10 right-4 z-10 bg-black/50 text-white w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md">
                 ✕
               </button>
             </div>
          )}

          {/* IMAGE MODE OUPUT */}
          {preview && isImageMode ? (
            <div className="flex flex-col h-full absolute inset-0 animate-in fade-in duration-500 overflow-y-auto p-5">
              {loading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Extracting & trans-coding OCR...
                </div>
              )}
              {ocrResult && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      {ocrResult.document_type}
                    </span>
                    <span
                      className={`text-xs bg-card rounded-full px-2 py-0.5 ${ocrResult.confidence < 0.85 ? "bg-red-500/20 text-red-400" : "text-primary"}`}
                    >
                      Confidence {(ocrResult.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  {ocrResult.confidence < 0.85 && (
                    <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg flex items-start gap-2 text-red-400 text-xs">
                      <AlertTriangle className="h-4 w-4 mt-0.5" />
                      <span>
                        Low OCR confidence detected. You may need to manually correct hallucinated
                        letters below.
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="text-xs text-muted-foreground mb-1 flex items-center justify-between">
                      <span>Source Extraction (Editable)</span>
                      <button
                        onClick={forceRetranslate}
                        disabled={retranslating || mutableText === ocrResult.extracted_text}
                        className={`text-[10px] uppercase font-bold flex items-center gap-1 ${mutableText !== ocrResult.extracted_text ? "text-primary-glow" : "text-muted"}`}
                      >
                        <RefreshCcw className={`h-3 w-3 ${retranslating ? "animate-spin" : ""}`} />{" "}
                        Apply Edits
                      </button>
                    </div>
                    <textarea
                      value={mutableText}
                      onChange={(e) => setMutableText(e.target.value)}
                      className={`w-full bg-card rounded-xl p-3 text-sm h-32 resize-none focus:outline-none focus:ring-1 focus:border-transparent ${ocrResult.confidence < 0.85 ? "border-red-500/50 focus:ring-red-500" : "border-border/50 focus:ring-primary/40"}`}
                    />
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Translation Matrix ({target})
                    </div>
                    <div
                      className="bg-card rounded-xl p-3 text-sm whitespace-pre-wrap"
                      dir={target === "ur" ? "rtl" : "ltr"}
                    >
                      {ocrResult.translation}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/40 mt-4 pb-24">
                    <Button asChild className="w-full rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-none font-medium text-[13px] h-10">
                      <Link to="/app/roleplay" search={{ lang: target, scenario: `Discussing a newly translated document: ${ocrResult.document_type}` }}>
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Practice custom scenario about this document
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : /* DOCUMENT MODE OUPUT */
          !isImageMode && chunksRaw.length > 0 ? (
            <div className="flex flex-col h-full absolute inset-0 animate-in fade-in duration-500">
              <div className="bg-black/20 p-4 border-b border-white/5 flex items-center justify-between shadow-sm z-10 flex-wrap gap-2">
                <div>
                  <h3 className="font-display font-medium text-foreground text-sm truncate max-w-[150px]">
                    {resultName || "Translating..."}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {chunksTrans.length} of {chunksRaw.length} chunks
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  {resultRawUrl && resultRawUrl !== resultUrl && (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="rounded-full bg-white/5 border-border/50"
                    >
                      <a
                        href={resultRawUrl}
                        download={resultName.replace(`.${resultName.split(".").pop()}`, "_raw.txt")}
                      >
                        <FileText className="h-4 w-4 mr-2" /> Raw Text
                      </a>
                    </Button>
                  )}
                  {resultUrl && (
                    <Button asChild size="sm" className="rounded-full bg-primary text-primary-foreground border-0 shadow-sm">
                      <a href={resultUrl} download={resultName}>
                        <Download className="h-4 w-4 mr-2" /> Download Formatted
                      </a>
                    </Button>
                  )}
                  {resultUrl && (
                    <Button asChild size="sm" variant="outline" className="rounded-full border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 shadow-sm">
                      <Link to="/app/roleplay" search={{ lang: target, scenario: `Reviewing a newly translated document: ${resultName}` }}>
                        <GraduationCap className="h-4 w-4 mr-2" /> Practice
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
                {chunksRaw.map((raw, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
                    <div className="text-muted-foreground pr-2 whitespace-pre-wrap opacity-70 break-words overflow-hidden text-ellipsis">
                      {raw}
                    </div>
                    <div className="pl-2 whitespace-pre-wrap border-l border-white/5 break-words overflow-hidden text-ellipsis">
                      {chunksTrans[idx] || (
                        <span className="flex items-center text-muted-foreground italic">
                          <Loader2 className="h-3 w-3 animate-spin mr-2" /> translating...
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* IDLE OUPUT */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Your translated assets will appear instantly here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
