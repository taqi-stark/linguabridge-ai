import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [resending, setResending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setEmailNotConfirmed(false);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      if (error.message.includes("Email not confirmed")) {
        setEmailNotConfirmed(true);
        toast.error("Please confirm your email first");
        return;
      }
      return toast.error(error.message);
    }
    toast.success("Welcome back!");
    nav({ to: "/app" });
  };

  const resendEmail = async () => {
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    setResending(false);
    if (error) return toast.error(error.message);
    toast.success("Confirmation email resent!");
  };

  const google = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/app` },
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl p-8 sm:p-10 w-full max-w-md shadow-sm"
      >
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <Globe2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold">LinguaBridge AI</span>
        </Link>
        <h1 className="font-display text-2xl">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to continue translating.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          {emailNotConfirmed && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm text-amber-700">
              Your email is not confirmed yet. Check your inbox for the confirmation link or resend
              it below.
            </div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary text-primary-foreground text-primary-foreground border-0 shadow-sm h-11"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        {emailNotConfirmed && (
          <Button
            onClick={resendEmail}
            disabled={resending}
            variant="outline"
            className="w-full rounded-full bg-card h-11 mt-3"
          >
            {resending ? "Resending..." : "Resend confirmation email"}
          </Button>
        )}
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" />
          OR
          <div className="flex-1 h-px bg-border" />
        </div>
        <Button variant="outline" onClick={google} className="w-full rounded-full bg-card h-11">
          Continue with Google
        </Button>
        <p className="mt-6 text-sm text-center text-muted-foreground">
          No account?{" "}
          <Link to="/signup" className="text-primary">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
