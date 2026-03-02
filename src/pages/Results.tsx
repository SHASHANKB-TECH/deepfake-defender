import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowLeft, Eye, ScanLine, AudioLines, BarChart3, Timer, Brain, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const MODULE_META = [
  { key: "eye_reflection", icon: Eye, label: "Eye Reflection Consistency" },
  { key: "facial_artifact", icon: ScanLine, label: "Facial Artifact Detection" },
  { key: "audio_visual", icon: AudioLines, label: "Audio-Visual Sync" },
  { key: "frequency_domain", icon: BarChart3, label: "Frequency Domain Analysis" },
  { key: "temporal_consistency", icon: Timer, label: "Temporal Consistency" },
  { key: "physiological", icon: Brain, label: "Physiological Signals" },
];

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate("/auth");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("analyses")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setAnalysis(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Analysis not found.
      </div>
    );
  }

  const score = analysis.overall_score ?? 0;
  const riskLevel = analysis.risk_level;
  const gaugeColor = riskLevel === "authentic" ? "text-green-400" : riskLevel === "suspicious" ? "text-yellow-400" : "text-red-400";
  const riskBadgeVariant = riskLevel === "authentic" ? "default" : riskLevel === "suspicious" ? "secondary" : "destructive";
  const riskLabel = riskLevel === "authentic" ? "Authentic" : riskLevel === "suspicious" ? "Suspicious" : "Likely Deepfake";

  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="min-h-screen bg-background font-body">
      <nav className="sticky top-0 z-50 glass-strong">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-display text-sm font-bold tracking-wider">DEEPFAKE-X</span>
          </Link>
          <Button asChild variant="ghost" size="sm" className="text-xs">
            <Link to="/dashboard"><ArrowLeft className="h-3.5 w-3.5 mr-1" /> Dashboard</Link>
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="font-display text-2xl font-bold mb-1">Analysis Results</h1>
          <p className="text-sm text-muted-foreground mb-8">{analysis.file_name}</p>
        </motion.div>

        {/* Gauge */}
        <motion.div className="glass rounded-2xl p-8 text-center mb-8" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="relative inline-block mb-4">
            <svg width="180" height="180" className="-rotate-90">
              <circle cx="90" cy="90" r="70" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
              <circle
                cx="90" cy="90" r="70" fill="none"
                stroke={riskLevel === "authentic" ? "#4ade80" : riskLevel === "suspicious" ? "#facc15" : "#f87171"}
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-display text-4xl font-black ${gaugeColor}`}>{score}%</span>
              <span className="text-xs text-muted-foreground">Authenticity</span>
            </div>
          </div>
          <Badge variant={riskBadgeVariant} className="font-display text-xs tracking-wider px-4 py-1">
            {riskLabel}
          </Badge>
        </motion.div>

        {/* Module Breakdown */}
        <h2 className="font-display text-lg font-semibold mb-4">Module Breakdown</h2>
        <div className="space-y-3">
          {MODULE_META.map((mod, i) => {
            const scoreVal = analysis[`${mod.key}_score`] ?? 0;
            const pass = analysis[`${mod.key}_pass`];
            const detail = analysis[`${mod.key}_detail`] || "";

            return (
              <motion.div
                key={mod.key}
                className="glass rounded-xl p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <mod.icon className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="font-display text-sm font-semibold tracking-wider">{mod.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-bold">{scoreVal}%</span>
                    {pass ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 mb-2">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-700 ${
                      scoreVal >= 80 ? "bg-green-400" : scoreVal >= 50 ? "bg-yellow-400" : "bg-red-400"
                    }`}
                    style={{ width: `${scoreVal}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{detail}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Results;
