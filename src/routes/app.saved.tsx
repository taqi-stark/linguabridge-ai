import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";

export const Route = createFileRoute("/app/saved")({ component: () => (
  <div>
    <h1 className="font-display text-3xl mb-6">Saved</h1>
    <div className="glass-strong rounded-3xl p-10 text-center">
      <Bookmark className="h-12 w-12 mx-auto text-primary mb-3" />
      <p className="text-muted-foreground">Star translations in <Link to="/app/history" className="text-primary">History</Link> to see them here.</p>
    </div>
  </div>
)});
