import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({ component: Signup });

function Signup() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resending, setResending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/app`, data: { display_name: name } },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setEmailSent(true);
    toast.success("Check your email to confirm your account!");
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
    <div className="min-h-screen flex items-center justify-center px-4">
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

        {emailSent ? (
          <>
            <h1 className="font-display text-2xl">Confirm your email</h1>
            <p className="text-sm text-muted-foreground mt-2">
              We sent a confirmation link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Click the link in your email to activate your account and start translating.
            </p>
            <Button
              onClick={resendEmail}
              disabled={resending}
              variant="outline"
              className="w-full rounded-full bg-card h-11 mt-6"
            >
              {resending ? "Resending..." : "Resend confirmation email"}
            </Button>
            <p className="mt-6 text-sm text-center text-muted-foreground">
              Already confirmed?{" "}
              <Link to="/login" className="text-primary">
                Sign in
              </Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">Start translating in seconds.</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
              </div>
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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-primary text-primary-foreground text-primary-foreground border-0 shadow-sm h-11"
              >
                {loading ? "Creating..." : "Create account"}
              </Button>
            </form>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex-1 h-px bg-border" />
              OR
              <div className="flex-1 h-px bg-border" />
            </div>
            <Button variant="outline" onClick={google} className="w-full rounded-full bg-card h-11">
              Continue with Google
            </Button>
            <p className="mt-6 text-sm text-center text-muted-foreground">
              Already have one?{" "}
              <Link to="/login" className="text-primary">
                Sign in
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
