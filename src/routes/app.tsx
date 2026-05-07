import { createFileRoute, Outlet, redirect, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { Globe2, Home, Languages, Mic, Image as ImageIcon, FileText, Bot, History, Bookmark, Settings, MessagesSquare, LogOut, Search, Bell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/app")({ component: AppLayout });

const NAV = [
  { to: "/app", icon: Home, label: "Home" },
  { to: "/app/text", icon: Languages, label: "Text" },
  { to: "/app/voice", icon: Mic, label: "Voice" },
  { to: "/app/conversation", icon: MessagesSquare, label: "Conversation" },
  { to: "/app/image", icon: ImageIcon, label: "Image / OCR" },
  { to: "/app/document", icon: FileText, label: "Document" },
  { to: "/app/assistant", icon: Bot, label: "AI Assistant" },
  { to: "/app/history", icon: History, label: "History" },
  { to: "/app/saved", icon: Bookmark, label: "Saved" },
  { to: "/app/settings", icon: Settings, label: "Settings" },
];

function AppLayout() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) nav({ to: "/login" });
  }, [user, loading, nav]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    nav({ to: "/" });
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 z-40 h-screen w-64 glass-strong border-r border-border/50 transition-transform ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-mint flex items-center justify-center"><Globe2 className="h-4 w-4 text-primary-foreground" /></div>
            <span className="font-display font-semibold">LinguaBridge</span>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden"><X className="h-5 w-5" /></button>
        </div>
        <nav className="px-3 space-y-0.5">
          {NAV.map((n) => {
            const active = path === n.to;
            return (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${active ? "gradient-mint text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-3 right-3">
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-accent">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 glass border-b border-border/50">
          <div className="flex items-center gap-3 px-4 sm:px-6 py-3">
            <button onClick={() => setOpen(true)} className="lg:hidden"><Menu className="h-5 w-5" /></button>
            <div className="flex-1 max-w-md relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Search translations…" className="w-full pl-9 pr-3 py-2 rounded-full glass text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggle} className="h-9 w-9 rounded-full glass flex items-center justify-center" aria-label="Toggle theme">{theme === "dark" ? "☀️" : "🌙"}</button>
              <button className="h-9 w-9 rounded-full glass flex items-center justify-center"><Bell className="h-4 w-4" /></button>
              <div className="h-9 w-9 rounded-full gradient-mint flex items-center justify-center text-primary-foreground font-semibold text-sm">
                {(user.email ?? "U")[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto"><Outlet /></main>
      </div>
    </div>
  );
}
