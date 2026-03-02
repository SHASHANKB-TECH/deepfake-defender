import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Shield, Upload, ScanLine, ShieldCheck, BarChart3, LogOut, Clock } from "lucide-react";
import { motion } from "framer-motion";
import type { User } from "@supabase/supabase-js";

interface Analysis {
  id: string;
  file_name: string;
  file_type: string;
  overall_score: number | null;
  risk_level: string | null;
  created_at: string;
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
        .select("id, file_name, file_type, overall_score, risk_level, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      setAnalyses(data || []);
      setLoading(false);
    };
    fetchAnalyses();
  }, [user]);

  const totalScans = analyses.length;
  const deepfakes = analyses.filter((a) => a.risk_level === "likely_deepfake").length;
  const avgScore = totalScans > 0
    ? Math.round(analyses.reduce((s, a) => s + (a.overall_score || 0), 0) / totalScans)
    : 0;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const riskColor = (risk: string | null) => {
    if (risk === "authentic") return "text-green-400";
    if (risk === "suspicious") return "text-yellow-400";
    return "text-red-400";
  };

  const riskLabel = (risk: string | null) => {
    if (risk === "authentic") return "Authentic";
    if (risk === "suspicious") return "Suspicious";
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
      {/* Nav */}
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

      <div className="container mx-auto px-4 py-8">
        <motion.h1 className="font-display text-2xl font-bold mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Dashboard
        </motion.h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: ScanLine, label: "Total Scans", value: totalScans, color: "text-primary" },
            { icon: ShieldCheck, label: "Deepfakes Found", value: deepfakes, color: "text-red-400" },
            { icon: BarChart3, label: "Avg Authenticity", value: `${avgScore}%`, color: "text-green-400" },
          ].map((s, i) => (
            <motion.div key={s.label} className="glass rounded-xl p-5 flex items-center gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-display tracking-wider">{s.label}</p>
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
              <motion.div key={a.id} className="glass rounded-xl p-4 flex items-center justify-between" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <ScanLine className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{a.file_name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(a.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-display font-bold">{a.overall_score ?? "—"}%</p>
                    <p className={`text-xs font-display tracking-wider ${riskColor(a.risk_level)}`}>{riskLabel(a.risk_level)}</p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="text-xs">
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
