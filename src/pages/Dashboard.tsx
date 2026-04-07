import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload, ScanLine, ShieldCheck, AlertTriangle, TrendingUp,
  Clock, Plus, Activity, BarChart3, Eye, ArrowUpRight,
  FileSearch, ChevronRight, Shield, Sparkles, Target, Flame,
  ArrowRight, Scan, Fingerprint
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

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div className="relative h-14 w-14">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/20"
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Fingerprint className="h-5 w-5 text-primary" />
          </div>
        </motion.div>
      </div>
    );
  }

  const containerAnim = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
  };
  const itemAnim = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="min-h-screen font-body relative bg-background">
      <AtmosphericBackground />
      <Navbar showAnalyze onLogout={handleLogout} />

      <motion.div
        className="container mx-auto px-4 sm:px-6 pt-24 pb-16 relative z-10 max-w-7xl"
        variants={containerAnim}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={itemAnim} className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-muted-foreground mb-1">{getGreeting()}</p>
            <h1 className="font-display text-3xl md:text-4xl font-black text-foreground">
              Dashboard
            </h1>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="text-xs border-primary/10 bg-card/40 backdrop-blur-sm hover:bg-primary/5 rounded-xl h-9 px-4">
              <Link to="/history"><Clock className="h-3.5 w-3.5 mr-1.5" /> History</Link>
            </Button>
            <Button asChild size="sm" className="text-xs btn-press bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-9 px-5 glow-primary">
              <Link to="/analyze"><Plus className="h-3.5 w-3.5 mr-1.5" /> New Scan</Link>
            </Button>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-4">

          {/* Stat: Total Scans */}
          <motion.div variants={itemAnim} className="col-span-6 lg:col-span-3">
            <div className="group h-full rounded-2xl border border-primary/[0.08] bg-card/30 backdrop-blur-md p-5 hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 ring-1 ring-primary/15 flex items-center justify-center">
                  <ScanLine className="h-4.5 w-4.5 text-primary" />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground/50 tracking-wider">ALL TIME</span>
              </div>
              <p className="text-4xl font-display font-black text-foreground leading-none mb-1">
                <CountUp end={totalScans} />
              </p>
              <p className="text-[11px] text-muted-foreground font-mono tracking-wider">Total Scans</p>
            </div>
          </motion.div>

          {/* Stat: Authentic */}
          <motion.div variants={itemAnim} className="col-span-6 lg:col-span-3">
            <div className="group h-full rounded-2xl border border-primary/[0.08] bg-card/30 backdrop-blur-md p-5 hover:border-emerald-400/20 transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-400/10 ring-1 ring-emerald-400/15 flex items-center justify-center">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
                </div>
                <span className="text-[10px] font-mono text-emerald-400/40 tracking-wider">SAFE</span>
              </div>
              <p className="text-4xl font-display font-black text-foreground leading-none mb-1">
                <CountUp end={authentic} />
              </p>
              <p className="text-[11px] text-muted-foreground font-mono tracking-wider">Verified Safe</p>
            </div>
          </motion.div>

          {/* Stat: Threats */}
          <motion.div variants={itemAnim} className="col-span-6 lg:col-span-3">
            <div className="group h-full rounded-2xl border border-primary/[0.08] bg-card/30 backdrop-blur-md p-5 hover:border-destructive/20 transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-destructive/10 ring-1 ring-destructive/15 flex items-center justify-center">
                  <AlertTriangle className="h-4.5 w-4.5 text-destructive" />
                </div>
                <span className="text-[10px] font-mono text-destructive/40 tracking-wider">ALERT</span>
              </div>
              <p className="text-4xl font-display font-black text-foreground leading-none mb-1">
                <CountUp end={deepfakes + suspicious} />
              </p>
              <p className="text-[11px] text-muted-foreground font-mono tracking-wider">Threats Found</p>
            </div>
          </motion.div>

          {/* Stat: Confidence */}
          <motion.div variants={itemAnim} className="col-span-6 lg:col-span-3">
            <div className="group h-full rounded-2xl border border-primary/[0.08] bg-card/30 backdrop-blur-md p-5 hover:border-secondary/20 transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-secondary/10 ring-1 ring-secondary/15 flex items-center justify-center">
                  <TrendingUp className="h-4.5 w-4.5 text-secondary" />
                </div>
                <span className="text-[10px] font-mono text-secondary/40 tracking-wider">AVG</span>
              </div>
              <p className="text-4xl font-display font-black text-foreground leading-none mb-1">
                <CountUp end={avgScore} suffix="%" />
              </p>
              <p className="text-[11px] text-muted-foreground font-mono tracking-wider">Confidence</p>
            </div>
          </motion.div>

          {/* CTA: New Analysis - Large Card */}
          <motion.div variants={itemAnim} className="col-span-12 lg:col-span-4">
            <Link to="/analyze" className="group block h-full">
              <div className="relative h-full rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/[0.08] to-card/30 backdrop-blur-md p-6 overflow-hidden hover:border-primary/25 transition-all duration-500 hover:-translate-y-0.5">
                {/* Decorative */}
                <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight className="h-5 w-5 text-primary" />
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
                  <div>
                    <div className="h-12 w-12 rounded-2xl bg-primary/15 ring-1 ring-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Scan className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-1">Start New Analysis</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Upload a photo or video to detect deepfakes using our AI forensic engine.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-primary font-medium mt-4 group-hover:gap-3 transition-all">
                    <span>Upload Media</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Detection Ring + Threat Bars */}
          <motion.div variants={itemAnim} className="col-span-12 lg:col-span-4">
            <div className="h-full rounded-2xl border border-primary/[0.08] bg-card/30 backdrop-blur-md p-6">
              <div className="flex items-center gap-2 mb-5">
                <Target className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm font-bold text-foreground">Detection Overview</h3>
              </div>

              <div className="flex items-center gap-6">
                {/* Ring */}
                <div className="relative h-[100px] w-[100px] flex-shrink-0">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted) / 0.25)" strokeWidth="7" />
                    <motion.circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="7" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - avgScore / 100) }}
                      transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-display font-black text-foreground leading-none">{avgScore}</span>
                    <span className="text-[9px] text-muted-foreground font-mono">%</span>
                  </div>
                </div>

                {/* Bars */}
                <div className="flex-1 space-y-3">
                  {[
                    { label: "Safe", count: authentic, color: "bg-emerald-400" },
                    { label: "Suspicious", count: suspicious, color: "bg-secondary" },
                    { label: "Deepfake", count: deepfakes, color: "bg-destructive" },
                  ].map((item) => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-mono text-foreground">{item.count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${item.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: totalScans > 0 ? `${(item.count / totalScans) * 100}%` : "0%" }}
                          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground/50 font-mono text-center mt-4">
                {totalScans > 0 ? `Based on ${totalScans} scan${totalScans > 1 ? "s" : ""}` : "No data yet"}
              </p>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemAnim} className="col-span-12 lg:col-span-4">
            <div className="h-full rounded-2xl border border-primary/[0.08] bg-card/30 backdrop-blur-md p-6 flex flex-col">
              <h3 className="font-display text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4">Quick Links</h3>
              <div className="space-y-2.5 flex-1">
                <Link to="/analyze" className="group flex items-center gap-3 p-3 rounded-xl border border-primary/[0.06] hover:border-primary/20 hover:bg-primary/5 transition-all">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Upload className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Upload & Scan</p>
                    <p className="text-[10px] text-muted-foreground">Analyze new media</p>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </Link>
                <Link to="/history" className="group flex items-center gap-3 p-3 rounded-xl border border-primary/[0.06] hover:border-secondary/20 hover:bg-secondary/5 transition-all">
                  <div className="h-9 w-9 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Reports</p>
                    <p className="text-[10px] text-muted-foreground">Browse past analyses</p>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-secondary transition-colors" />
                </Link>
              </div>

              {/* Mini streak */}
              <div className="mt-4 pt-4 border-t border-primary/[0.06]">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-secondary" />
                  <span className="text-xs text-muted-foreground">
                    {totalScans > 0 ? `${totalScans} total scans completed` : "Start scanning to build your streak"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity - Full Width */}
          <motion.div variants={itemAnim} className="col-span-12">
            <div className="rounded-2xl border border-primary/[0.08] bg-card/25 backdrop-blur-md overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-primary/[0.05]">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 ring-1 ring-primary/15 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="font-display text-sm font-bold text-foreground">Recent Activity</h2>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary group h-8">
                  <Link to="/history">View All <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" /></Link>
                </Button>
              </div>

              {analyses.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto mb-4">
                    <FileSearch className="h-7 w-7 text-primary/30" />
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground mb-1.5">No analyses yet</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">Upload your first media file to start detecting deepfakes.</p>
                  <Button asChild className="text-xs bg-primary text-primary-foreground rounded-xl px-6 h-9 glow-primary btn-press">
                    <Link to="/analyze"><Upload className="h-3.5 w-3.5 mr-2" /> Start Analyzing</Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-primary/[0.04]">
                  {analyses.map((a, i) => {
                    const RiskIcon = riskIcon(a.risk_level);
                    return (
                      <motion.div
                        key={a.id}
                        className="flex items-center justify-between px-6 py-3.5 cursor-pointer hover:bg-primary/[0.02] transition-colors group"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.04 }}
                        onClick={() => navigate(`/results/${a.id}`)}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 border ${riskBg(a.risk_level)}`}>
                            <RiskIcon className={`h-4 w-4 ${riskColor(a.risk_level)}`} />
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
                                  <span className="text-primary/20">·</span>
                                  <span className="text-primary/50">{a.suspected_method}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="hidden sm:block text-lg font-display font-black text-foreground">{a.overall_score ?? "—"}<span className="text-[10px] text-muted-foreground">%</span></span>
                          <Badge variant="outline" className={`text-[10px] px-2 py-0.5 font-mono tracking-wider border ${riskBg(a.risk_level)} ${riskColor(a.risk_level)}`}>
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
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
