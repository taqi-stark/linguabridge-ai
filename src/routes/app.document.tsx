import { createFileRoute } from "@tanstack/react-router";
import { FileText, Upload } from "lucide-react";

export const Route = createFileRoute("/app/document")({ component: () => (
  <div>
    <h1 className="font-display text-3xl mb-6">Document Translator</h1>
    <div className="glass-strong rounded-3xl p-10 text-center">
      <FileText className="h-12 w-12 mx-auto text-primary mb-3" />
      <h3 className="font-display text-xl">PDF & Document Translation</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">For images and screenshots use the Image translator. Full PDF page-by-page translation is coming soon.</p>
      <button className="mt-5 inline-flex items-center gap-2 rounded-full gradient-mint text-primary-foreground px-5 py-2.5 shadow-glow"><Upload className="h-4 w-4" /> Coming soon</button>
    </div>
  </div>
)});
