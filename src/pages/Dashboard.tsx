import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Upload, ScanLine, ShieldCheck, BarChart3, LogOut, Clock, AlertTriangle, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";
import type { User } from "@supabase/supabase-js";

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
      const { data } = await supabase
        .from("analyses")
        .select("id, file_name, file_type, overall_score, risk_level, created_at, scan_mode, suspected_method")
        .order("created_at", { ascending: false })
        .limit(10);
      setAnalyses((data as Analysis[]) || []);
      setLoading(false);
    };
    fetchAnalyses();
  }, [user]);

  const totalScans = analyses.length;
  const deepfakes = analyses.filter((a) => a.risk_level === "likely_deepfake").length;
  const suspicious = analyses.filter((a) => a.risk_level === "suspicious").length;
  const inconclusive = analyses.filter((a) => a.risk_level === "inconclusive").length;
  const avgScore = totalScans > 0 ? Math.round(analyses.reduce((s, a) => s + (a.overall_score || 0), 0) / totalScans) : 0;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const riskColor = (risk: string | null) => {
    if (risk === "authentic") return "text-emerald-400";
    if (risk === "suspicious") return "text-amber-400";
    if (risk === "inconclusive") return "text-violet-400";
    return "text-red-400";
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <nav className="sticky top-0 z-50 glass-strong">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-display text-sm font-bold tracking-wider">DEEPFAKE-X</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="font-display text-xs tracking-wider glow-primary">
              <Link to="/analyze"><Upload className="h-3.5 w-3.5 mr-1.5" /> Analyze</Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Log out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <h1 className="font-display text-2xl font-bold mb-1">Command Center</h1>
          <p className="text-sm text-muted-foreground">Welcome back. Here's your forensic analysis overview.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: ScanLine, label: "Total Scans", value: totalScans, color: "text-primary" },
            { icon: ShieldCheck, label: "Deepfakes Found", value: deepfakes, color: "text-red-400" },
            { icon: AlertTriangle, label: "Suspicious", value: suspicious, color: "text-amber-400" },
            { icon: TrendingUp, label: "Avg Score", value: `${avgScore}%`, color: "text-emerald-400" },
          ].map((s, i) => (
            <motion.div key={s.label} className="glass rounded-xl p-5 flex items-center gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-display tracking-wider uppercase">{s.label}</p>
                <p className="text-2xl font-display font-bold">{s.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold">Recent Analyses</h2>
          <Button asChild variant="ghost" size="sm" className="text-xs font-display tracking-wider">
            <Link to="/history">View All</Link>
          </Button>
        </div>

        {analyses.length === 0 ? (
          <motion.div className="glass rounded-xl p-12 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No analyses yet. Upload your first media file.</p>
            <Button asChild className="font-display text-xs tracking-wider glow-primary">
              <Link to="/analyze">Start Analyzing</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {analyses.map((a, i) => (
              <motion.div
                key={a.id}
                className="glass rounded-xl p-4 flex items-center justify-between hover:border-primary/20 transition-all cursor-pointer"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => navigate(`/results/${a.id}`)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <ScanLine className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{a.file_name}</p>
                      {a.scan_mode === "deep" && <Badge variant="secondary" className="text-[9px] px-1.5 py-0">DEEP</Badge>}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(a.created_at).toLocaleDateString()}</span>
                      {a.suspected_method && a.suspected_method !== "None detected" && a.suspected_method !== "Unknown" && (
                        <span className="text-[10px] text-amber-400">• {a.suspected_method}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-display font-bold">{a.overall_score ?? "—"}%</p>
                    <p className={`text-xs font-display tracking-wider ${riskColor(a.risk_level)}`}>{riskLabel(a.risk_level)}</p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="text-xs" onClick={(e) => e.stopPropagation()}>
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
