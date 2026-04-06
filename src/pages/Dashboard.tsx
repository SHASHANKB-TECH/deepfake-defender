import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload, ScanLine, ShieldCheck, AlertTriangle, TrendingUp,
  Clock, Plus, Activity, BarChart3, Eye, Zap, ArrowUpRight,
  FileSearch, ChevronRight, Shield, Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import AtmosphericBackground from "@/components/AtmosphericBackground";
import Navbar from "@/components/Navbar";
import CountUp from "@/components/CountUp";

interface Analysis {
  id: string;
  file_name: string;
  file_type: string;
  overall_score: number | null;
  risk_level: string | null;
  created_at: string;
  scan_mode: string | null;
  suspected_method: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate("/auth");
      else setUser(session.user);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
      else setUser(session.user);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchAnalyses = async () => {
      const { data } = await supabase.from("analyses").select("id, file_name, file_type, overall_score, risk_level, created_at, scan_mode, suspected_method").order("created_at", { ascending: false }).limit(10);
      setAnalyses((data as Analysis[]) || []);
      setLoading(false);
    };
    fetchAnalyses();
  }, [user]);

  const totalScans = analyses.length;
  const deepfakes = analyses.filter(a => a.risk_level === "likely_deepfake").length;
  const suspicious = analyses.filter(a => a.risk_level === "suspicious").length;
  const authentic = analyses.filter(a => a.risk_level === "authentic").length;
  const avgScore = totalScans > 0 ? Math.round(analyses.reduce((s, a) => s + (a.overall_score || 0), 0) / totalScans) : 0;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const riskColor = (risk: string | null) => {
    if (risk === "authentic") return "text-emerald-400";
    if (risk === "suspicious") return "text-secondary";
    if (risk === "inconclusive") return "text-primary";
    return "text-destructive";
  };

  const riskBg = (risk: string | null) => {
    if (risk === "authentic") return "bg-emerald-400/10 border-emerald-400/20";
    if (risk === "suspicious") return "bg-secondary/10 border-secondary/20";
    if (risk === "inconclusive") return "bg-primary/10 border-primary/20";
    return "bg-destructive/10 border-destructive/20";
  };

  const riskLabel = (risk: string | null) => {
    if (risk === "authentic") return "Authentic";
    if (risk === "suspicious") return "Suspicious";
    if (risk === "inconclusive") return "Inconclusive";
    if (risk === "likely_deepfake") return "Deepfake";
    return "—";
  };

  const riskIcon = (risk: string | null) => {
    if (risk === "authentic") return ShieldCheck;
    if (risk === "suspicious") return AlertTriangle;
    if (risk === "inconclusive") return Eye;
    return AlertTriangle;
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-xs text-muted-foreground font-mono tracking-widest">LOADING</p>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: ScanLine, label: "Total Scans", value: totalScans, accent: "primary" as const },
    { icon: ShieldCheck, label: "Authentic", value: authentic, accent: "emerald" as const },
    { icon: AlertTriangle, label: "Suspicious", value: suspicious, accent: "secondary" as const },
    { icon: TrendingUp, label: "Avg Score", value: avgScore, suffix: "%", accent: "primary" as const },
  ];

  const accentStyles = {
    primary: { icon: "text-primary", bg: "bg-primary/10", border: "border-primary/20", glow: "group-hover:shadow-[0_0_20px_hsl(265_90%_65%/0.15)]" },
    emerald: { icon: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", glow: "group-hover:shadow-[0_0_20px_hsl(155_80%_45%/0.15)]" },
    secondary: { icon: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20", glow: "group-hover:shadow-[0_0_20px_hsl(38_100%_55%/0.15)]" },
  };

  return (
    <div className="min-h-screen font-body relative bg-background">
      <AtmosphericBackground />
      <Navbar showAnalyze onLogout={handleLogout} />

      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10 max-w-6xl">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-mono tracking-[0.3em] uppercase text-primary mb-2">{getGreeting()}</p>
              <h1 className="font-display text-3xl md:text-4xl font-black text-foreground">
                Command <span className="text-gradient-primary">Center</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5">Monitor your media analysis activity</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="font-display text-xs tracking-wider border-primary/15 bg-transparent hover:bg-primary/5 rounded-xl">
                <Link to="/history"><Clock className="h-3.5 w-3.5 mr-1.5" /> History</Link>
              </Button>
              <Button asChild size="sm" className="font-display text-xs tracking-wider btn-press bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl glow-primary">
                <Link to="/analyze"><Plus className="h-3.5 w-3.5 mr-1.5" /> New Scan</Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {stats.map((s, i) => {
            const style = accentStyles[s.accent];
            return (
              <motion.div
                key={s.label}
                className={`group relative rounded-2xl p-5 border border-primary/[0.06] bg-card/40 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:-translate-y-0.5 ${style.glow}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.04), transparent 70%)" }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${style.bg} border ${style.border}`}>
                      <s.icon className={`h-4.5 w-4.5 ${style.icon}`} />
                    </div>
                    <Sparkles className="h-3 w-3 text-muted-foreground/30 group-hover:text-primary/40 transition-colors" />
                  </div>
                  <p className="text-3xl font-display font-black text-foreground leading-none">
                    <CountUp end={s.value} suffix={s.suffix || ""} />
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1.5 font-mono tracking-wider uppercase">{s.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions Row */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link to="/analyze" className="group rounded-2xl p-5 border border-primary/[0.06] bg-card/30 backdrop-blur-sm hover:border-primary/20 hover:bg-card/50 transition-all duration-300 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-display font-bold text-foreground">Upload Media</p>
              <p className="text-xs text-muted-foreground">Analyze a photo or video</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>

          <Link to="/history" className="group rounded-2xl p-5 border border-primary/[0.06] bg-card/30 backdrop-blur-sm hover:border-primary/20 hover:bg-card/50 transition-all duration-300 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center group-hover:bg-secondary/15 transition-colors">
              <BarChart3 className="h-5 w-5 text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-display font-bold text-foreground">View Reports</p>
              <p className="text-xs text-muted-foreground">Browse past analyses</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-secondary transition-colors" />
          </Link>

          <div className="group rounded-2xl p-5 border border-primary/[0.06] bg-card/30 backdrop-blur-sm flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-display font-bold text-foreground">Detection Rate</p>
              <p className="text-xs text-muted-foreground">
                {totalScans > 0 ? `${avgScore}% average confidence` : "No data yet"}
              </p>
            </div>
            <Zap className="h-4 w-4 text-emerald-400/40" />
          </div>
        </motion.div>

        {/* Recent Analyses */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-foreground">Recent Activity</h2>
                <p className="text-[10px] text-muted-foreground font-mono tracking-wider">LATEST SCANS</p>
              </div>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary group">
              <Link to="/history">View All <ChevronRight className="h-3 w-3 ml-0.5 group-hover:translate-x-0.5 transition-transform" /></Link>
            </Button>
          </div>

          {analyses.length === 0 ? (
            <motion.div
              className="rounded-2xl p-16 text-center border border-dashed border-primary/10 bg-card/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="h-16 w-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto mb-5">
                <FileSearch className="h-8 w-8 text-primary/40" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">No analyses yet</h3>
              <p className="mb-6 text-sm text-muted-foreground max-w-xs mx-auto">Upload your first image or video to start detecting deepfakes with AI.</p>
              <Button asChild className="font-display text-xs tracking-wider glow-primary btn-press bg-primary text-primary-foreground rounded-xl px-8">
                <Link to="/analyze"><Upload className="h-4 w-4 mr-2" /> Start Analyzing</Link>
              </Button>
            </motion.div>
          ) : (
            <div className="rounded-2xl border border-primary/[0.06] bg-card/30 backdrop-blur-sm overflow-hidden">
              {analyses.map((a, i) => {
                const RiskIcon = riskIcon(a.risk_level);
                return (
                  <motion.div
                    key={a.id}
                    className={`flex items-center justify-between p-4 transition-all duration-300 cursor-pointer hover:bg-primary/[0.03] ${i !== analyses.length - 1 ? "border-b border-primary/[0.04]" : ""}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.04 }}
                    onClick={() => navigate(`/results/${a.id}`)}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 border ${riskBg(a.risk_level)}`}>
                        <RiskIcon className={`h-4 w-4 ${riskColor(a.risk_level)}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate text-foreground">{a.file_name}</p>
                          {a.scan_mode === "deep" && (
                            <Badge className="text-[9px] px-1.5 py-0 border-none bg-secondary/15 text-secondary font-mono">DEEP</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <span>{new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                          {a.suspected_method && a.suspected_method !== "None detected" && a.suspected_method !== "Unknown" && (
                            <>
                              <span className="text-primary/20">•</span>
                              <span className="text-primary/60">{a.suspected_method}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-lg font-display font-black text-foreground leading-none">{a.overall_score ?? "—"}<span className="text-xs text-muted-foreground">%</span></p>
                      </div>
                      <Badge variant="outline" className={`text-[10px] px-2.5 py-0.5 font-mono tracking-wider border ${riskBg(a.risk_level)} ${riskColor(a.risk_level)}`}>
                        {riskLabel(a.risk_level)}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
