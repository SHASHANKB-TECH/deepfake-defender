import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowLeft, Eye, ScanLine, AudioLines, BarChart3, Timer, Brain, CheckCircle, XCircle, Download, Share2 } from "lucide-react";
import { motion } from "framer-motion";

const MODULE_META = [
  { key: "eye_reflection", icon: Eye, label: "Eye Reflection Consistency", color: "from-cyan-400 to-blue-500" },
  { key: "facial_artifact", icon: ScanLine, label: "Facial Artifact Detection", color: "from-violet-400 to-purple-500" },
  { key: "audio_visual", icon: AudioLines, label: "Audio-Visual Sync", color: "from-pink-400 to-rose-500" },
  { key: "frequency_domain", icon: BarChart3, label: "Frequency Domain Analysis", color: "from-amber-400 to-orange-500" },
  { key: "temporal_consistency", icon: Timer, label: "Temporal Consistency", color: "from-emerald-400 to-green-500" },
  { key: "physiological", icon: Brain, label: "Physiological Signals", color: "from-sky-400 to-indigo-500" },
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
        <div className="relative">
          <div className="h-12 w-12 border-2 border-primary/30 rounded-full" />
          <div className="absolute inset-0 h-12 w-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
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
  const isAuthentic = riskLevel === "authentic";
  const isSuspicious = riskLevel === "suspicious";

  const gaugeColor = isAuthentic ? "text-emerald-400" : isSuspicious ? "text-amber-400" : "text-red-400";
  const gaugeStroke = isAuthentic ? "url(#greenGrad)" : isSuspicious ? "url(#yellowGrad)" : "url(#redGrad)";
  const glowClass = isAuthentic ? "shadow-[0_0_40px_hsl(150_60%_50%/0.2)]" : isSuspicious ? "shadow-[0_0_40px_hsl(45_90%_55%/0.2)]" : "shadow-[0_0_40px_hsl(0_70%_55%/0.2)]";
  const riskBadgeVariant = isAuthentic ? "default" : isSuspicious ? "secondary" : "destructive";
  const riskLabel = isAuthentic ? "Authentic" : isSuspicious ? "Suspicious" : "Likely Deepfake";
  const riskEmoji = isAuthentic ? "✓" : isSuspicious ? "⚠" : "✕";

  const circumference = 2 * Math.PI * 72;
  const offset = circumference - (score / 100) * circumference;

  const passCount = MODULE_META.filter(m => analysis[`${m.key}_pass`]).length;

  return (
    <div className="min-h-screen bg-background font-body relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

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

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold mb-1 text-gradient-primary">Analysis Results</h1>
              <p className="text-sm text-muted-foreground">{analysis.file_name}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs gap-1.5">
                <Share2 className="h-3.5 w-3.5" /> Share
              </Button>
              <Button variant="outline" size="sm" className="text-xs gap-1.5">
                <Download className="h-3.5 w-3.5" /> Export
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Score Card */}
        <motion.div
          className={`glass rounded-2xl p-8 md:p-10 text-center mb-8 ${glowClass} relative overflow-hidden`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Decorative grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />

          <div className="relative z-10">
            <div className="relative inline-block mb-6">
              <svg width="200" height="200" className="-rotate-90">
                <defs>
                  <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="yellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                  <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <circle cx="100" cy="100" r="72" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" opacity="0.3" />
                <motion.circle
                  cx="100" cy="100" r="72" fill="none"
                  stroke={gaugeStroke}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  filter="url(#glow)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  className={`font-display text-5xl font-black ${gaugeColor}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {score}%
                </motion.span>
                <span className="text-xs text-muted-foreground mt-1">Authenticity Score</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mb-4">
              <Badge variant={riskBadgeVariant} className="font-display text-xs tracking-wider px-4 py-1.5 text-sm">
                {riskEmoji} {riskLabel}
              </Badge>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 max-w-md mx-auto">
              <div className="glass rounded-xl p-3">
                <p className="font-display text-lg font-bold text-foreground">{passCount}/{MODULE_META.length}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Modules Passed</p>
              </div>
              <div className="glass rounded-xl p-3">
                <p className="font-display text-lg font-bold text-foreground">{MODULE_META.length}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Checks Run</p>
              </div>
              <div className="glass rounded-xl p-3">
                <p className="font-display text-lg font-bold text-foreground">
                  {new Date(analysis.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Analyzed</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Module Breakdown */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold tracking-wider">Module Breakdown</h2>
            <span className="text-xs text-muted-foreground">{passCount} of {MODULE_META.length} passed</span>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {MODULE_META.map((mod, i) => {
              const scoreVal = analysis[`${mod.key}_score`] ?? 0;
              const pass = analysis[`${mod.key}_pass`];
              const detail = analysis[`${mod.key}_detail`] || "";

              return (
                <motion.div
                  key={mod.key}
                  className="glass rounded-xl p-5 group hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                >
                  {/* Subtle gradient accent */}
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${mod.color} opacity-60`} />

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${mod.color} bg-opacity-10`}>
                        <mod.icon className="h-4 w-4 text-foreground" />
                      </div>
                      <span className="font-display text-xs font-semibold tracking-wider">{mod.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-display text-lg font-black ${
                        scoreVal >= 80 ? "text-emerald-400" : scoreVal >= 50 ? "text-amber-400" : "text-red-400"
                      }`}>
                        {scoreVal}
                      </span>
                      {pass ? (
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                  </div>

                  <div className="w-full bg-muted/50 rounded-full h-1.5 mb-3 overflow-hidden">
                    <motion.div
                      className={`h-1.5 rounded-full bg-gradient-to-r ${mod.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${scoreVal}%` }}
                      transition={{ delay: 0.6 + i * 0.08, duration: 0.8, ease: "easeOut" }}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">{detail}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Button asChild variant="outline" size="sm" className="font-display text-xs tracking-wider">
            <Link to="/analyze">Analyze Another File</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Results;
