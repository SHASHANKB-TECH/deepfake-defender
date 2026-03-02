import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">(
    (searchParams.get("mode") as "login" | "signup") || "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) navigate("/dashboard");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard");
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account!");
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset email sent!");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <div className="glass rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-7 w-7 text-primary" />
            <span className="font-display text-lg font-bold tracking-wider">DEEPFAKE-X</span>
          </div>

          <h1 className="font-display text-xl font-bold mb-1">
            {mode === "signup" ? "Create Account" : mode === "forgot" ? "Reset Password" : "Welcome Back"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "signup"
              ? "Sign up to start detecting deepfakes."
              : mode === "forgot"
              ? "Enter your email to receive a reset link."
              : "Log in to your account."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name" className="text-xs font-display tracking-wider">DISPLAY NAME</Label>
                <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" className="mt-1.5 bg-background/50" />
              </div>
            )}
            <div>
              <Label htmlFor="email" className="text-xs font-display tracking-wider">EMAIL</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1.5 bg-background/50" />
            </div>
            {mode !== "forgot" && (
              <div>
                <Label htmlFor="password" className="text-xs font-display tracking-wider">PASSWORD</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="mt-1.5 bg-background/50" />
              </div>
            )}
            <Button type="submit" className="w-full font-display text-sm tracking-wider glow-primary" disabled={loading}>
              {loading ? "Processing..." : mode === "signup" ? "Create Account" : mode === "forgot" ? "Send Reset Link" : "Log In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground space-y-2">
            {mode === "login" && (
              <>
                <button onClick={() => setMode("forgot")} className="text-primary hover:underline block mx-auto">Forgot password?</button>
                <p>Don't have an account? <button onClick={() => setMode("signup")} className="text-primary hover:underline">Sign up</button></p>
              </>
            )}
            {mode === "signup" && (
              <p>Already have an account? <button onClick={() => setMode("login")} className="text-primary hover:underline">Log in</button></p>
            )}
            {mode === "forgot" && (
              <button onClick={() => setMode("login")} className="text-primary hover:underline">Back to login</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
