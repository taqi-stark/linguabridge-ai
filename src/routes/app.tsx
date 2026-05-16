import {
  createFileRoute,
  Outlet,
  Link,
  useRouterState,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import {
  Globe2,
  Home,
  Languages,
  Image as ImageIcon,
  FileText,
  History,
  Bookmark,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  PlaySquare,
  ChevronLeft,
  ChevronRight,
  Mic,
  GraduationCap,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/app")({ component: AppLayout });

const NAV = [
  { to: "/app" as const, icon: Home, label: "Home", desc: "Overview & shortcuts" },
  { to: "/app/text" as const, icon: Languages, label: "Text", desc: "Paste or type to translate" },
  { to: "/app/voice" as const, icon: Mic, label: "Voice", desc: "Speak and hear translations" },
  { to: "/app/document" as const, icon: FileText, label: "File translation", desc: "PDFs, images & documents" },
  { to: "/app/student-guide" as const, icon: GraduationCap, label: "Study abroad", desc: "Visa, housing & more" },
  { to: "/app/roleplay" as const, icon: PlaySquare, label: "Roleplay", desc: "Practice real scenarios" },
  { to: "/app/history" as const, icon: History, label: "History", desc: "Past translations" },
  { to: "/app/saved" as const, icon: Bookmark, label: "Saved", desc: "Flashcards & deck" },
  { to: "/app/community" as const, icon: Users, label: "Campus Hub", desc: "Connect & Multiplayer" },
  { to: "/app/settings" as const, icon: Settings, label: "Settings", desc: "Account & preferences" },
] as const;

function navItemActive(pathname: string, to: string): boolean {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (to === "/app") return path === "/app";
  return path === to || path.startsWith(`${to}/`);
}

const SIDEBAR_GROUPS: { title: string | null; items: (typeof NAV)[number][] }[] = [
  { title: null, items: [NAV[0]] },
  { title: "Translate", items: [NAV[1], NAV[2], NAV[3]] },
  { title: "Learn", items: [NAV[4], NAV[5]] },
  { title: "Network", items: [NAV[8]] },
  { title: "Library", items: [NAV[6], NAV[7], NAV[9]] },
];

const MOBILE_DOCK = [NAV[0], NAV[1], NAV[2], NAV[3], NAV[4]];

function AppLayout() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const { theme, toggle } = useTheme();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof localStorage !== "undefined")
      return localStorage.getItem("lb-sidebar-collapsed") === "true";
    return false;
  });
  const handleToggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (typeof localStorage !== "undefined")
        localStorage.setItem("lb-sidebar-collapsed", String(next));
      return next;
    });
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/login" });
  }, [user, loading, nav]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  const signOut = async () => {
    // Clear all offline PWA cache associated with this session before logging out
    localStorage.removeItem("lb-history-cache");
    localStorage.removeItem("lb-glossary");
    localStorage.removeItem("lb-locked-terms");
    localStorage.removeItem("lb-mastery");

    await supabase.auth.signOut();
    toast.success("Signed out");
    nav({ to: "/" });
  };

  return (
    <div className="min-h-screen flex bg-background w-full">
      {/* Desktop Sidebar (Minimal ChatGPT style) */}
      <aside
        className={`hidden lg:flex sticky top-0 z-40 h-screen ${isCollapsed ? "w-[72px]" : "w-[260px]"} bg-[#f9f9f9] dark:bg-[#171717] border-r border-border flex flex-col transition-all duration-300 relative`}
      >
        <div
          className={`flex items-center ${isCollapsed ? "justify-center" : "justify-start"} px-5 h-16`}
        >
          <Link to="/app" className="flex items-center gap-3">
            <div
              className={`shrink-0 h-8 w-8 rounded-lg bg-black dark:bg-white flex items-center justify-center ${isCollapsed ? "scale-110" : "shadow-sm"}`}
            >
              <Globe2 className="h-5 w-5 text-white dark:text-black" />
            </div>
            {!isCollapsed && (
              <span className="font-display font-semibold text-lg tracking-tight whitespace-nowrap overflow-hidden">
                LinguaBridge
              </span>
            )}
          </Link>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={handleToggleSidebar}
          className="absolute -right-3.5 top-6 h-7 w-7 bg-background rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground z-50 shadow-sm transition-transform hover:scale-110"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        <div className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-none mt-2">
          <div className="space-y-1 w-full">
            {SIDEBAR_GROUPS.map((group, gi) => (
              <div key={gi}>
                {group.title && !isCollapsed && (
                  <div className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-6 first:mt-4 whitespace-nowrap">
                    {group.title}
                  </div>
                )}
                {group.title && isCollapsed && gi > 0 && (
                  <div className="h-px w-8 bg-border/50 mx-auto my-3" />
                )}
                {group.items.map((n) => {
                  const active = navItemActive(path, n.to);
                  return (
                    <Link
                      key={n.to}
                      to={n.to}
                      title={isCollapsed ? `${n.label} — ${n.desc}` : undefined}
                      className={`flex items-center ${isCollapsed ? "justify-center px-0 py-2.5 mx-auto w-10 h-10" : "gap-3 px-3 py-2 w-full"} rounded-lg text-sm font-medium transition-all ${active ? "bg-black/5 dark:bg-white/10 text-foreground" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"}`}
                    >
                      <n.icon className={`h-4 w-4 shrink-0 ${active ? "" : "opacity-80"}`} />
                      {!isCollapsed && (
                        <span className="flex flex-col min-w-0 leading-tight flex-1">
                          <span className="whitespace-nowrap overflow-hidden">{n.label}</span>
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="p-3 mt-auto border-t border-border/50 flex flex-col">
          <div className={`flex ${isCollapsed ? "flex-col items-center gap-4" : "items-center justify-between px-3"} mb-4 mt-2`}>
            <button
              onClick={toggle}
              className="h-8 w-8 hover:bg-white/5 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            {!isCollapsed && (
              <button className="h-8 w-8 hover:bg-white/5 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" title="Notifications">
                <Bell className="h-4 w-4" />
              </button>
            )}
            <div className="h-8 w-8 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-semibold text-xs cursor-pointer" title={user.email || "Profile"}>
              {(user.email ?? "U")[0].toUpperCase()}
            </div>
          </div>
          <button
            onClick={signOut}
            title={isCollapsed ? "Sign Out" : undefined}
            className={`w-full flex items-center ${isCollapsed ? "justify-center px-0 w-10 h-10 mx-auto" : "gap-3 px-3"} py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap">Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden relative w-full bg-background transition-all">
        {/* Mobile Header */}
        {!path.startsWith("/app/student-guide") && (
          <header className="lg:hidden sticky top-safe-4 z-30 mx-4 mt-6 bg-card rounded-lg border border-border/50 px-4 py-3 flex items-center justify-between shadow-sm transition-all">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground shadow-sm flex items-center justify-center">
                <Globe2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold text-lg tracking-tight">LinguaBridge</span>
            </Link>
            <div className="flex items-center gap-1">
              <button
                onClick={toggle}
                className="h-10 w-10 bg-black/5 dark:bg-white/5 border border-border/50 rounded-full flex items-center justify-center shadow-sm"
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
            </div>
          </header>
        )}

        <main className="flex-1 overflow-y-auto w-full relative z-10 flex flex-col h-full scrollbar-none pb-24 lg:pb-0 overflow-x-hidden [-webkit-overflow-scrolling:touch]">
          <AnimatePresence mode="wait">
            <motion.div
              key={path}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="max-w-7xl xl:max-w-[min(92rem,100%)] w-full mx-auto px-4 py-5 sm:px-6 lg:px-10 lg:py-8 h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Bottom Navigation Pill (Mobile) */}
      <div className="lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-1.5rem)] bg-card/80 backdrop-blur-3xl border border-border/50 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.2)] rounded-full px-1.5 py-1.5 flex items-center gap-0.5">
        {MOBILE_DOCK.map((n) => {
          const active = navItemActive(path, n.to);
          return (
            <Link
              key={n.to}
              to={n.to}
              title={`${n.label} — ${n.desc}`}
              className={`relative h-11 w-11 flex items-center justify-center rounded-full transition-all ${active ? "bg-primary text-primary-foreground text-primary-foreground shadow-sm scale-105" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}
            >
              <n.icon className="h-[21px] w-[21px]" />
            </Link>
          );
        })}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="relative h-11 w-11 flex items-center justify-center rounded-full transition-all text-muted-foreground hover:bg-white/5 hover:text-foreground"
        >
          <Menu className="h-[21px] w-[21px]" />
        </button>
      </div>

      {/* Mobile Bottom-Sheet Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm lg:hidden flex flex-col justify-end"
          >
            <div className="absolute inset-0" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="relative w-full max-h-[85vh] bg-card border-t border-border/50 shadow-2xl rounded-t-3xl flex flex-col overflow-hidden"
            >
              <div className="w-12 h-1.5 rounded-full bg-border/50 mx-auto mt-4 mb-2" />
              <div className="px-6 py-4 flex items-center justify-between border-b border-border/30">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-sm flex items-center justify-center text-primary-foreground font-semibold text-lg text-white">
                    {(user.email ?? "U")[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-semibold text-base">
                      LinguaBridge Profile
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {user.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 -mr-2 bg-black/10 dark:bg-white/10 rounded-full"
                >
                  <X className="h-5 w-5 text-foreground" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                <div className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  All tools
                </div>
                {NAV.map((n) => {
                  const active = navItemActive(path, n.to);
                  return (
                    <Link
                      key={n.to}
                      to={n.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-lg text-[15px] font-medium transition-all ${active ? "bg-primary text-primary-foreground text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}
                    >
                      <n.icon className={`h-5 w-5 shrink-0 ${active ? "" : "text-foreground/70"}`} />
                      <span className="flex flex-col min-w-0">
                        <span>{n.label}</span>
                        <span className="text-xs font-normal text-muted-foreground/90 truncate">
                          {n.desc}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="p-5 border-t border-border/30 pb-safe-8">
                <button
                  onClick={signOut}
                  className="w-full flex items-center justify-center gap-2 bg-destructive/10 text-destructive hover:bg-destructive/20 font-medium py-4 rounded-lg transition shadow-sm"
                >
                  <LogOut className="h-5 w-5" /> Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
