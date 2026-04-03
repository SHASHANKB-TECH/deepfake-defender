import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, ScanLine, ShieldCheck, AlertTriangle, TrendingUp, Clock, Plus, Activity } from "lucide-react";
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
  const avgScore = totalScans > 0 ? Math.round(analyses.reduce((s, a) => s + (a.overall_score || 0), 0) / totalScans) : 0;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const riskColor = (risk: string | null) => {
    if (risk === "authentic") return "hsl(155 80% 45%)";
    if (risk === "suspicious") return "hsl(38 100% 55%)";
    if (risk === "inconclusive") return "hsl(265 90% 65%)";
    return "hsl(0 85% 55%)";
  };

  const riskLabel = (risk: string | null) => {
    if (risk === "authentic") return "Authentic";
    if (risk === "suspicious") return "Suspicious";
    if (risk === "inconclusive") return "Inconclusive";
    if (risk === "likely_deepfake") return "Likely Deepfake";
    return "—";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  const stats = [
    { icon: ScanLine, label: "Total Scans", value: totalScans, color: "hsl(265 90% 65%)" },
    { icon: ShieldCheck, label: "Deepfakes", value: deepfakes, color: "hsl(0 85% 55%)" },
    { icon: AlertTriangle, label: "Suspicious", value: suspicious, color: "hsl(38 100% 55%)" },
    { icon: TrendingUp, label: "Avg Score", value: avgScore, suffix: "%", color: "hsl(155 80% 45%)" },
  ];

  return (
    <div className="min-h-screen font-body relative bg-background">
      <AtmosphericBackground />
      <Navbar showAnalyze onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-1">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Your analysis overview</p>
          </div>
          <Button asChild size="sm" className="font-display text-xs tracking-wider btn-press bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg glow-primary">
            <Link to="/analyze"><Plus className="h-4 w-4 mr-1" /> New Scan</Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="rounded-2xl p-5 border border-primary/[0.06] bg-card/40 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15` }}>
                  <s.icon className="h-4 w-4" style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-2xl font-display font-bold text-foreground">
                <CountUp end={s.value} suffix={s.suffix || ""} />
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <h2 className="font-display text-base font-semibold text-foreground">Recent Analyses</h2>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground">
            <Link to="/history">View All →</Link>
          </Button>
        </div>

        {analyses.length === 0 ? (
          <motion.div
            className="rounded-2xl p-14 text-center border border-primary/[0.06] bg-card/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <p className="mb-5 text-muted-foreground">No analyses yet. Upload your first media file.</p>
            <Button asChild className="font-display text-xs tracking-wider glow-primary btn-press bg-primary text-primary-foreground rounded-lg">
              <Link to="/analyze">Start Analyzing</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {analyses.map((a, i) => (
              <motion.div
                key={a.id}
                className="rounded-xl p-4 flex items-center justify-between transition-all duration-300 cursor-pointer border border-primary/[0.04] bg-card/30 backdrop-blur-sm hover:border-primary/15 hover:bg-card/50"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => navigate(`/results/${a.id}`)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/8">
                    <ScanLine className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate text-foreground">{a.file_name}</p>
                      {a.scan_mode === "deep" && (
                        <Badge className="text-[9px] px-1.5 py-0 border-none bg-secondary/15 text-secondary">DEEP</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(a.created_at).toLocaleDateString()}</span>
                      {a.suspected_method && a.suspected_method !== "None detected" && a.suspected_method !== "Unknown" && (
                        <span className="text-secondary text-[10px]">• {a.suspected_method}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-display font-bold text-foreground">{a.overall_score ?? "—"}%</p>
                    <p className="text-xs font-mono" style={{ color: riskColor(a.risk_level) }}>{riskLabel(a.risk_level)}</p>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="text-xs btn-press border-primary/15 bg-transparent hover:bg-primary/5 rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link to={`/results/${a.id}`}>View</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
