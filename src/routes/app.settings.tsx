import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/layout/PageHeader";
import { toast } from "sonner";

export const Route = createFileRoute("/app/settings")({ component: SettingsPage });

function SettingsPage() {
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const [glossary, setGlossary] = useState("");
  const [lockedTerms, setLockedTerms] = useState<{ term: string; lock: string }[]>([]);
  const [newTerm, setNewTerm] = useState("");
  const [newLock, setNewLock] = useState("");

  useEffect(() => {
    setGlossary(localStorage.getItem("lb-glossary") || "");
    const locks = localStorage.getItem("lb-locked-terms");
    if (locks) {
      try {
        setLockedTerms(JSON.parse(locks));
      } catch (e) {}
    }
  }, []);

  const saveGlossary = (v: string) => {
    setGlossary(v);
    localStorage.setItem("lb-glossary", v);
  };

  const addLock = () => {
    if (!newTerm.trim() || !newLock.trim()) return;
    const arr = [...lockedTerms, { term: newTerm.trim(), lock: newLock.trim() }];
    setLockedTerms(arr);
    localStorage.setItem("lb-locked-terms", JSON.stringify(arr));
    setNewTerm("");
    setNewLock("");
  };

  const removeLock = (idx: number) => {
    const arr = lockedTerms.filter((_, i) => i !== idx);
    setLockedTerms(arr);
    localStorage.setItem("lb-locked-terms", JSON.stringify(arr));
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Mange your account, application preferences, and syntax locks."
      />
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg p-5">
          <h3 className="font-display text-lg mb-3">Profile</h3>
          <div className="text-sm text-muted-foreground">Email</div>
          <div>{user?.email}</div>
        </div>
        <div className="bg-card rounded-lg p-5">
          <h3 className="font-display text-lg mb-3">Accessibility Features</h3>
          <div className="flex items-center justify-between mt-2">
            <div>
              <div className="font-medium">Auto-Speak Translations</div>
              <div className="text-xs text-muted-foreground">
                Automatically read translations aloud.
              </div>
            </div>
            <button
              onClick={() => {
                const ns = localStorage.getItem("lb-auto-speak") === "true" ? "false" : "true";
                localStorage.setItem("lb-auto-speak", ns);
                window.dispatchEvent(new Event("storage"));
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${localStorage.getItem("lb-auto-speak") === "true" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${localStorage.getItem("lb-auto-speak") === "true" ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>
        </div>

        <div className="bg-card rounded-lg p-5 col-span-1 md:col-span-2 border shadow-sm">
          <h3 className="font-display text-lg mb-2 flex items-center gap-2">
            Subscription & Billing
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Manage your Stripe premium subscription, request API limit expansions, and view invoicing history.
          </p>
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="bg-muted/30 border border-border/50 p-4 rounded-xl flex-1">
              <h4 className="font-medium">Free Tier</h4>
              <p className="text-xs mt-1 text-muted-foreground">50 Documents / 15 Images Daily</p>
              <div className="mt-4 text-[11px] uppercase tracking-wider font-bold text-muted-foreground border border-border/50 inline-block px-2 py-1 rounded-md">Active Plan</div>
            </div>
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex-1 relative overflow-hidden transition-all hover:bg-primary/10">
              <div className="absolute top-0 right-0 bg-primary/20 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-bl-lg">Scaffold</div>
              <h4 className="font-medium text-primary-glow flex items-center gap-2">Pro Tier <span className="opacity-70 font-normal">($9.99/mo)</span></h4>
              <p className="text-xs mt-1 text-muted-foreground">Unlimited Documents & Vector RAG Core</p>
              <button className="mt-4 text-xs font-semibold bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:scale-105 transition-transform" onClick={() => toast.info('Stripe SDK not linked. Please inject STRIPE_SECRET_KEY in server-functions.')}>
                Deploy Stripe Checkout
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-5 col-span-1 md:col-span-2">
          <h3 className="font-display text-lg mb-2 text-red-400 font-semibold flex items-center gap-2">
            Syntax & Term Locking
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Strictly force the AI to translate specific terms exactly as provided (e.g. keeping
            'React' or API names intact). This protects structural integrity.
          </p>

          <div className="flex gap-2 mb-4">
            <input
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
              placeholder="Original Term"
              className="flex-1 px-3 py-2 rounded-xl bg-card bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 border border-border/50"
            />
            <input
              value={newLock}
              onChange={(e) => setNewLock(e.target.value)}
              placeholder="Forced Translation"
              className="flex-1 px-3 py-2 rounded-xl bg-card bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 border border-border/50"
            />
            <button
              onClick={addLock}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-primary-foreground font-medium text-sm"
            >
              Lock
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {lockedTerms.map((t, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-4 py-2 rounded-lg bg-black/20 border border-border/30"
              >
                <div className="text-sm">
                  <span className="text-muted-foreground">{t.term}</span>{" "}
                  <span className="mx-2">→</span>{" "}
                  <span className="font-medium text-primary-glow">{t.lock}</span>
                </div>
                <button
                  onClick={() => removeLock(idx)}
                  className="text-red-400 text-sm hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg p-5 col-span-1 md:col-span-2">
          <h3 className="font-display text-lg mb-2">General Instructions & Context</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Define your profession or general semantic rules. The AI will adapt all future
            translations to this contextual persona.
          </p>
          <textarea
            value={glossary}
            onChange={(e) => saveGlossary(e.target.value)}
            placeholder="e.g. I am a medical professional. Speak formally and clinically."
            className="w-full h-24 p-4 rounded-xl bg-card bg-transparent text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 border border-border/50"
          />
        </div>
        <div className="bg-card rounded-lg p-5 col-span-1 md:col-span-2">
          <h3 className="font-display text-lg mb-3">Appearance</h3>
          <button
            onClick={toggle}
            className="rounded-full bg-primary text-primary-foreground text-primary-foreground font-medium px-5 py-2.5 text-sm shadow-sm hover:scale-105 transition-transform"
          >
            Switch to {theme === "dark" ? "Light" : "Dark"} Mode
          </button>
        </div>
      </div>
    </div>
  );
}
