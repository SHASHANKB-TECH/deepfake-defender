import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload, ScanLine, ShieldCheck, AlertTriangle, TrendingUp,
  Clock, Plus, Activity, BarChart3, Eye, Zap, ArrowUpRight,
  FileSearch, ChevronRight, Shield, Sparkles, Layers, Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

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
        <div className="flex flex-col items-center gap-6">
          <motion.div className="relative h-16 w-16">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/30"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-1 rounded-full border-2 border-primary border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-3 rounded-full border-2 border-secondary/60 border-b-transparent"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary" />
            </div>
          </motion.div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-xs text-muted-foreground font-mono tracking-[0.4em] uppercase">Initializing</p>
            <motion.div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="h-1 w-1 rounded-full bg-primary"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: ScanLine, label: "Total Scans", value: totalScans, desc: "All time", accent: "primary" as const },
    { icon: ShieldCheck, label: "Verified Safe", value: authentic, desc: "Authentic media", accent: "emerald" as const },
    { icon: AlertTriangle, label: "Threats Found", value: deepfakes + suspicious, desc: "Require attention", accent: "destructive" as const },
    { icon: TrendingUp, label: "Confidence", value: avgScore, suffix: "%", desc: "Average score", accent: "secondary" as const },
  ];

  const accentMap = {
    primary: { icon: "text-primary", bg: "bg-primary/8", ring: "ring-primary/20", gradient: "from-primary/20 to-transparent" },
    emerald: { icon: "text-emerald-400", bg: "bg-emerald-400/8", ring: "ring-emerald-400/20", gradient: "from-emerald-400/20 to-transparent" },
    destructive: { icon: "text-destructive", bg: "bg-destructive/8", ring: "ring-destructive/20", gradient: "from-destructive/20 to-transparent" },
    secondary: { icon: "text-secondary", bg: "bg-secondary/8", ring: "ring-secondary/20", gradient: "from-secondary/20 to-transparent" },
  };

  return (
    <div className="min-h-screen font-body relative bg-background">
      <AtmosphericBackground />
      <Navbar showAnalyze onLogout={handleLogout} />

      <div className="container mx-auto px-4 sm:px-6 pt-24 pb-16 relative z-10 max-w-7xl">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-primary">{getGreeting()}</span>
              </motion.div>
              <h1 className="font-display text-4xl md:text-5xl font-black text-foreground leading-tight">
                Command <span className="text-gradient-primary">Center</span>
              </h1>
              <p className="text-sm text-muted-foreground max-w-md">
                Real-time overview of your media forensics activity and threat detection metrics.
              </p>
            </div>
            <div className="flex gap-2.5">
              <Button asChild variant="outline" size="sm" className="font-display text-xs tracking-wider border-primary/10 bg-card/40 backdrop-blur-sm hover:bg-primary/5 rounded-xl h-10 px-4">
                <Link to="/history"><Clock className="h-3.5 w-3.5 mr-2" /> History</Link>
              </Button>
              <Button asChild size="sm" className="font-display text-xs tracking-wider btn-press bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl glow-primary h-10 px-5">
                <Link to="/analyze"><Plus className="h-3.5 w-3.5 mr-2" /> New Scan</Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => {
            const style = accentMap[s.accent];
            const isHovered = hoveredStat === i;
            return (
              <motion.div
                key={s.label}
                className="group relative rounded-2xl border border-primary/[0.06] bg-card/30 backdrop-blur-md overflow-hidden cursor-default"
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setHoveredStat(i)}
                onMouseLeave={() => setHoveredStat(null)}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                {/* Hover gradient */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-b ${style.gradient} pointer-events-none`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                />

                <div className="relative z-10 p-5 sm:p-6">
                  <div className="flex items-start justify-between mb-5">
                    <motion.div
                      className={`h-11 w-11 rounded-xl ${style.bg} ring-1 ${style.ring} flex items-center justify-center`}
                      animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <s.icon className={`h-5 w-5 ${style.icon}`} />
                    </motion.div>
                    <motion.div
                      animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sparkles className={`h-3.5 w-3.5 ${style.icon}`} />
                    </motion.div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-3xl sm:text-4xl font-display font-black text-foreground leading-none tracking-tight">
                      <CountUp end={s.value} suffix={s.suffix || ""} />
                    </p>
                    <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-muted-foreground">{s.label}</p>
                    <p className="text-[10px] text-muted-foreground/60">{s.desc}</p>
                  </div>
                </div>

                {/* Bottom line accent */}
                <motion.div
                  className={`h-[2px] ${style.bg}`}
                  style={{ background: `hsl(var(--${s.accent === "emerald" ? "primary" : s.accent}))` }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity - Takes 2 cols */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="rounded-2xl border border-primary/[0.06] bg-card/25 backdrop-blur-md overflow-hidden">
              {/* Section Header */}
              <div className="flex items-center justify-between p-5 border-b border-primary/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/8 ring-1 ring-primary/20 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-sm font-bold text-foreground">Recent Activity</h2>
                    <p className="text-[10px] text-muted-foreground font-mono tracking-[0.2em]">LATEST SCANS</p>
                  </div>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary group h-8">
                  <Link to="/history">
                    View All <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
              </div>

              {analyses.length === 0 ? (
                <motion.div
                  className="p-16 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="relative inline-block mb-6">
                    <div className="h-20 w-20 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto">
                      <FileSearch className="h-9 w-9 text-primary/30" />
                    </div>
                    <motion.div
                      className="absolute -inset-3 rounded-3xl border border-primary/10"
                      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">No analyses yet</h3>
                  <p className="mb-8 text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    Upload your first image or video to start detecting deepfakes with AI-powered forensics.
                  </p>
                  <Button asChild className="font-display text-xs tracking-wider glow-primary btn-press bg-primary text-primary-foreground rounded-xl px-8 h-10">
                    <Link to="/analyze"><Upload className="h-4 w-4 mr-2" /> Start Analyzing</Link>
                  </Button>
                </motion.div>
              ) : (
                <div className="divide-y divide-primary/[0.04]">
                  {analyses.map((a, i) => {
                    const RiskIcon = riskIcon(a.risk_level);
                    return (
                      <motion.div
                        key={a.id}
                        className="flex items-center justify-between px-5 py-4 transition-all duration-200 cursor-pointer hover:bg-primary/[0.03] group"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.55 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        onClick={() => navigate(`/results/${a.id}`)}
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${riskBg(a.risk_level)} transition-transform group-hover:scale-105`}>
                            <RiskIcon className={`h-4.5 w-4.5 ${riskColor(a.risk_level)}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate text-foreground group-hover:text-primary transition-colors">{a.file_name}</p>
                              {a.scan_mode === "deep" && (
                                <Badge className="text-[9px] px-1.5 py-0 border-none bg-secondary/10 text-secondary font-mono">DEEP</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                              <span>{new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                              {a.suspected_method && a.suspected_method !== "None detected" && a.suspected_method !== "Unknown" && (
                                <>
                                  <span className="text-primary/20">•</span>
                                  <span className="text-primary/50">{a.suspected_method}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right hidden sm:block">
                            <p className="text-lg font-display font-black text-foreground leading-none">{a.overall_score ?? "—"}<span className="text-[10px] text-muted-foreground ml-0.5">%</span></p>
                          </div>
                          <Badge variant="outline" className={`text-[10px] px-2.5 py-0.5 font-mono tracking-wider border ${riskBg(a.risk_level)} ${riskColor(a.risk_level)}`}>
                            {riskLabel(a.risk_level)}
                          </Badge>
                          <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary/60 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {/* Quick Actions */}
            <div className="rounded-2xl border border-primary/[0.06] bg-card/25 backdrop-blur-md p-5">
              <h3 className="font-display text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2.5">
                <Link to="/analyze" className="group flex items-center gap-3.5 p-3.5 rounded-xl border border-primary/[0.06] bg-card/30 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center group-hover:ring-primary/40 transition-all">
                    <Upload className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-display font-bold text-foreground">Upload & Scan</p>
                    <p className="text-[11px] text-muted-foreground">Analyze new media</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </Link>

                <Link to="/history" className="group flex items-center gap-3.5 p-3.5 rounded-xl border border-primary/[0.06] bg-card/30 hover:border-secondary/20 hover:bg-secondary/5 transition-all duration-300">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 ring-1 ring-secondary/20 flex items-center justify-center group-hover:ring-secondary/40 transition-all">
                    <BarChart3 className="h-4.5 w-4.5 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-display font-bold text-foreground">View Reports</p>
                    <p className="text-[11px] text-muted-foreground">Browse past results</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-secondary transition-colors" />
                </Link>
              </div>
            </div>

            {/* Threat Overview */}
            <div className="rounded-2xl border border-primary/[0.06] bg-card/25 backdrop-blur-md p-5">
              <h3 className="font-display text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4">Threat Overview</h3>
              <div className="space-y-3">
                {[
                  { label: "Authentic", count: authentic, color: "bg-emerald-400", total: totalScans },
                  { label: "Suspicious", count: suspicious, color: "bg-secondary", total: totalScans },
                  { label: "Deepfake", count: deepfakes, color: "bg-destructive", total: totalScans },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-mono text-foreground">{item.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${item.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: item.total > 0 ? `${(item.count / item.total) * 100}%` : "0%" }}
                        transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {totalScans === 0 && (
                <p className="text-[11px] text-muted-foreground/60 text-center mt-3 font-mono">No data yet</p>
              )}
            </div>

            {/* Detection Rate Card */}
            <div className="rounded-2xl border border-primary/[0.06] bg-card/25 backdrop-blur-md p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-400/8 ring-1 ring-emerald-400/20 flex items-center justify-center">
                  <Target className="h-4.5 w-4.5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-display font-bold text-foreground">Detection Rate</p>
                  <p className="text-[10px] text-muted-foreground font-mono tracking-wider">SYSTEM ACCURACY</p>
                </div>
              </div>
              <div className="relative flex items-center justify-center py-3">
                <div className="relative h-24 w-24">
                  <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted)/0.3)" strokeWidth="6" />
                    <motion.circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - avgScore / 100) }}
                      transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-display font-black text-foreground">{avgScore}%</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground text-center mt-1">
                {totalScans > 0 ? `Based on ${totalScans} scan${totalScans > 1 ? "s" : ""}` : "Run scans to see accuracy"}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
