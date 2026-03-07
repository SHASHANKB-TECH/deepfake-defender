import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import AtmosphericBackground from "@/components/AtmosphericBackground";
import { motion } from "framer-motion";

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
          email, password,
          options: { data: { display_name: displayName }, emailRedirectTo: window.location.origin },
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
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ background: "#050508" }}>
      <AtmosphericBackground />
      <div className="relative w-full max-w-md z-10">
        <Link to="/" className="inline-flex items-center gap-2 mb-8 text-sm font-mono tracking-wider" style={{ color: "#888899" }}>
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <motion.div
          className="glass rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="font-display text-lg font-black" style={{ color: "#00F5FF", textShadow: "0 0 15px rgba(0,245,255,0.5)" }}>⛨</span>
            <span className="font-display text-sm font-bold tracking-[0.2em]" style={{ color: "#F0F0F0" }}>CROWN SHIELD</span>
          </div>

          <h1 className="font-display text-xl font-bold mb-1" style={{ color: "#F0F0F0" }}>
            {mode === "signup" ? "Create Account" : mode === "forgot" ? "Reset Password" : "Welcome Back"}
          </h1>
          <p className="text-sm mb-6" style={{ color: "#888899" }}>
            {mode === "signup" ? "Sign up to start detecting deepfakes." : mode === "forgot" ? "Enter your email." : "Log in to your account."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name" className="text-xs font-mono tracking-wider" style={{ color: "#888899" }}>DISPLAY NAME</Label>
                <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" className="mt-1.5 bg-muted/50 border-primary/10 focus:border-primary/40" />
              </div>
            )}
            <div>
              <Label htmlFor="email" className="text-xs font-mono tracking-wider" style={{ color: "#888899" }}>EMAIL</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1.5 bg-muted/50 border-primary/10 focus:border-primary/40" />
            </div>
            {mode !== "forgot" && (
              <div>
                <Label htmlFor="password" className="text-xs font-mono tracking-wider" style={{ color: "#888899" }}>PASSWORD</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="mt-1.5 bg-muted/50 border-primary/10 focus:border-primary/40" />
              </div>
            )}
            <Button type="submit" className="w-full font-display text-sm tracking-[0.15em] glow-primary btn-press bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
              {loading ? "Processing..." : mode === "signup" ? "Create Account" : mode === "forgot" ? "Send Reset Link" : "Log In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm space-y-2" style={{ color: "#888899" }}>
            {mode === "login" && (
              <>
                <button onClick={() => setMode("forgot")} className="hover:underline block mx-auto" style={{ color: "#00F5FF" }}>Forgot password?</button>
                <p>Don't have an account? <button onClick={() => setMode("signup")} style={{ color: "#00F5FF" }} className="hover:underline">Sign up</button></p>
              </>
            )}
            {mode === "signup" && (
              <p>Already have an account? <button onClick={() => setMode("login")} style={{ color: "#00F5FF" }} className="hover:underline">Log in</button></p>
            )}
            {mode === "forgot" && (
              <button onClick={() => setMode("login")} style={{ color: "#00F5FF" }} className="hover:underline">Back to login</button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
