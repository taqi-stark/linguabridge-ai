import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/app/settings")({ component: SettingsPage });

function SettingsPage() {
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Settings</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5">
          <h3 className="font-display text-lg mb-3">Profile</h3>
          <div className="text-sm text-muted-foreground">Email</div>
          <div>{user?.email}</div>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="font-display text-lg mb-3">Appearance</h3>
          <button onClick={toggle} className="rounded-full glass px-4 py-2 text-sm">Switch to {theme === "dark" ? "light" : "dark"} mode</button>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="font-display text-lg mb-3">Voice</h3>
          <p className="text-sm text-muted-foreground">Playback uses your browser's voices for Italian, English, and Urdu.</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="font-display text-lg mb-3">API</h3>
          <p className="text-sm text-muted-foreground">API access available on Pro and Enterprise plans.</p>
        </div>
      </div>
    </div>
  );
}
