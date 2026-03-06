import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, ScanLine, ShieldCheck, AlertTriangle, TrendingUp, Clock, Zap } from "lucide-react";
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
    if (risk === "authentic") return "#00FF88";
    if (risk === "suspicious") return "#FBBF24";
    if (risk === "inconclusive") return "#A78BFA";
    return "#FF003C";
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050508" }}>
        <div className="h-8 w-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#00F5FF", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-body relative" style={{ background: "#050508" }}>
      <AtmosphericBackground />
      <Navbar showAnalyze onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <h1 className="font-display text-2xl font-bold mb-1" style={{ color: "#F0F0F0" }}>Command Center</h1>
          <p className="text-sm font-mono tracking-wider" style={{ color: "#888899" }}>Forensic analysis overview</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: ScanLine, label: "Total Scans", value: totalScans, color: "#00F5FF" },
            { icon: ShieldCheck, label: "Deepfakes Found", value: deepfakes, color: "#FF003C" },
            { icon: AlertTriangle, label: "Suspicious", value: suspicious, color: "#FBBF24" },
            { icon: TrendingUp, label: "Avg Score", value: avgScore, suffix: "%", color: "#00FF88" },
          ].map((s, i) => (
            <motion.div key={s.label} className="glass rounded-xl p-5 flex items-center gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="h-11 w-11 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15` }}>
                <s.icon className="h-5 w-5" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-[10px] font-mono tracking-[0.15em] uppercase" style={{ color: "#888899" }}>{s.label}</p>
                <p className="text-2xl font-display font-bold" style={{ color: "#F0F0F0" }}>
                  <CountUp end={s.value} suffix={s.suffix || ""} />
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold" style={{ color: "#F0F0F0" }}>Recent Analyses</h2>
          <Button asChild variant="ghost" size="sm" className="text-xs font-mono tracking-wider" style={{ color: "#888899" }}>
            <Link to="/history">View All</Link>
          </Button>
        </div>

        {analyses.length === 0 ? (
          <motion.div className="glass rounded-xl p-12 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Upload className="h-10 w-10 mx-auto mb-4" style={{ color: "#888899" }} />
            <p className="mb-4" style={{ color: "#888899" }}>No analyses yet. Upload your first media file.</p>
            <Button asChild className="font-display text-xs tracking-[0.15em] glow-primary btn-press bg-primary text-primary-foreground">
              <Link to="/analyze">Start Analyzing</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {analyses.map((a, i) => (
              <motion.div
                key={a.id}
                className="glass rounded-xl p-4 flex items-center justify-between transition-all cursor-pointer hover:border-primary/30"
                style={{ borderColor: "rgba(0,245,255,0.05)" }}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => navigate(`/results/${a.id}`)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(0,245,255,0.08)" }}>
                    <ScanLine className="h-4 w-4" style={{ color: "#00F5FF" }} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate" style={{ color: "#F0F0F0" }}>{a.file_name}</p>
                      {a.scan_mode === "deep" && <Badge className="text-[9px] px-1.5 py-0 border-none" style={{ background: "rgba(255,0,60,0.15)", color: "#FF003C" }}>DEEP</Badge>}
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: "#888899" }}>
                      <Clock className="h-3 w-3" />
                      <span>{new Date(a.created_at).toLocaleDateString()}</span>
                      {a.suspected_method && a.suspected_method !== "None detected" && a.suspected_method !== "Unknown" && (
                        <span className="text-[10px]" style={{ color: "#FBBF24" }}>• {a.suspected_method}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-display font-bold" style={{ color: "#F0F0F0" }}>{a.overall_score ?? "—"}%</p>
                    <p className="text-xs font-mono tracking-wider" style={{ color: riskColor(a.risk_level) }}>{riskLabel(a.risk_level)}</p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="text-xs btn-press border-primary/20 bg-transparent hover:bg-primary/5" onClick={(e) => e.stopPropagation()}>
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
