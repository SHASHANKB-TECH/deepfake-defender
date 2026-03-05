import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Shield, ArrowLeft, Eye, ScanLine, BarChart3, Timer, Brain, CheckCircle, XCircle,
  Download, Share2, Info, AlertTriangle, Fingerprint, Focus, Layers, Microscope,
  ChevronDown, ChevronUp, FileWarning, Lightbulb, Copy, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const MODULE_META = [
  { key: "facial_inconsistency", dbKey: "facial_artifact", icon: ScanLine, label: "Facial Inconsistency", color: "from-violet-400 to-purple-500", education: "AI-generated faces often show unnatural skin texture, inconsistent lighting, or subtle warping around hairlines and ears." },
  { key: "metadata_compression", dbKey: "audio_visual", icon: Layers, label: "Metadata & Compression", color: "from-pink-400 to-rose-500", education: "Real photos contain EXIF data from cameras. Deepfakes often have missing metadata or show signs of double-compression." },
  { key: "gan_fingerprint", dbKey: "frequency_domain", icon: Fingerprint, label: "GAN Fingerprint", color: "from-amber-400 to-orange-500", education: "GANs (Generative Adversarial Networks) leave invisible fingerprints in the frequency domain — patterns like checkerboard artifacts from upsampling layers." },
  { key: "semantic_consistency", dbKey: null, icon: Focus, label: "Semantic Consistency", color: "from-teal-400 to-cyan-500", education: "AI struggles with details like correct tooth count, proper hand anatomy (5 fingers), and physically plausible background objects." },
  { key: "eye_reflection", dbKey: "eye_reflection", icon: Eye, label: "Eye Reflection", color: "from-cyan-400 to-blue-500", education: "Real eyes reflect the same light sources. AI-generated faces often have mismatched, missing, or impossible eye reflections (catchlights)." },
  { key: "temporal_consistency", dbKey: "temporal_consistency", icon: Timer, label: "Temporal Consistency", color: "from-emerald-400 to-green-500", education: "In deepfake videos, facial regions may flicker between frames, and blinking patterns are often unnatural — too frequent or completely absent." },
  { key: "biological_signals", dbKey: "physiological", icon: Brain, label: "Biological Signals", color: "from-sky-400 to-indigo-500", education: "Real faces show subtle color changes from blood flow (rPPG). Deepfakes lack these micro-signals and often miss realistic micro-expressions." },
  { key: "boundary_blending", dbKey: null, icon: Microscope, label: "Boundary & Blending", color: "from-rose-400 to-red-500", education: "Face-swap deepfakes show edge bleeding around the jawline and neck, with color temperature mismatches between the swapped face and the original body." },
];

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [showEducation, setShowEducation] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

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
    supabase.from("analyses").select("*").eq("id", id).single().then(({ data }) => {
      setAnalysis(data);
      setLoading(false);
    });
  }, [id]);

  const toggleModule = (key: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleExportPDF = () => {
    if (!reportRef.current || !analysis) return;
    // Simple text-based PDF export using print
    const w = window.open("", "_blank");
    if (!w) { toast.error("Please allow popups"); return; }

    const report = analysis.detailed_report;
    const modules = report?.modules || {};

    w.document.write(`
      <html><head><title>DeepFake-X Report - ${analysis.file_name}</title>
      <style>
        body { font-family: 'Segoe UI', system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #1a1a2e; }
        h1 { font-size: 24px; border-bottom: 3px solid #06b6d4; padding-bottom: 10px; }
        h2 { font-size: 18px; margin-top: 30px; color: #333; }
        .score-box { background: #f8f9fa; border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0; }
        .score { font-size: 48px; font-weight: 900; }
        .score.authentic { color: #10b981; }
        .score.suspicious { color: #f59e0b; }
        .score.deepfake { color: #ef4444; }
        .score.inconclusive { color: #8b5cf6; }
        .module { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 12px 0; }
        .module-header { display: flex; justify-content: space-between; align-items: center; }
        .pass { color: #10b981; font-weight: 600; }
        .fail { color: #ef4444; font-weight: 600; }
        .anomaly { background: #fef3c7; border-left: 3px solid #f59e0b; padding: 8px 12px; margin: 8px 0; font-size: 14px; }
        .reason { padding: 4px 0; font-size: 14px; }
        .meta { color: #6b7280; font-size: 13px; }
        @media print { body { margin: 20px; } }
      </style></head><body>
      <h1>🛡️ DeepFake-X Forensic Report</h1>
      <p class="meta">File: ${analysis.file_name} | Type: ${analysis.file_type} | Date: ${new Date(analysis.created_at).toLocaleString()}</p>
      <p class="meta">Scan Mode: ${analysis.scan_mode === 'deep' ? 'Deep Scan' : 'Standard'} | Suspected Method: ${analysis.suspected_method || 'N/A'}</p>
      
      <div class="score-box">
        <div class="score ${analysis.risk_level === 'authentic' ? 'authentic' : analysis.risk_level === 'suspicious' ? 'suspicious' : analysis.risk_level === 'inconclusive' ? 'inconclusive' : 'deepfake'}">${analysis.overall_score}%</div>
        <div style="font-size:18px;font-weight:600;margin-top:8px;">${analysis.risk_level === 'authentic' ? '✓ Authentic' : analysis.risk_level === 'suspicious' ? '⚠ Suspicious' : analysis.risk_level === 'inconclusive' ? '? Inconclusive' : '✕ Likely Deepfake'}</div>
      </div>

      <h2>Confidence Reasoning</h2>
      ${(analysis.confidence_reasons || []).map((r: string, i: number) => `<div class="reason">${i + 1}. ${r}</div>`).join('')}

      <h2>Module Breakdown</h2>
      ${MODULE_META.map(mod => {
        const m = modules[mod.key] || {};
        return `<div class="module">
          <div class="module-header">
            <strong>${mod.label}</strong>
            <span class="${m.pass ? 'pass' : 'fail'}">${m.score ?? '—'}/100 ${m.pass ? '✓ PASS' : '✕ FAIL'}</span>
          </div>
          <p style="margin:8px 0;font-size:14px;">${m.detail || '—'}</p>
          ${(m.anomalies || []).map((a: any) => `<div class="anomaly"><strong>[${a.severity?.toUpperCase()}]</strong> ${a.finding} — ${a.explanation}</div>`).join('')}
        </div>`;
      }).join('')}

      <p class="meta" style="margin-top:40px;text-align:center;">Generated by DeepFake-X — AI-Powered Media Forensics</p>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

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
  const isInconclusive = riskLevel === "inconclusive";

  const report = analysis.detailed_report || {};
  const modules = report.modules || {};
  const confidenceReasons = analysis.confidence_reasons || report.confidence_reasons || [];
  const suspectedMethod = analysis.suspected_method || report.suspected_method || "Unknown";
  const allAnomalies = analysis.anomalies || [];

  const scoreColor = isAuthentic ? "text-emerald-400" : isSuspicious ? "text-amber-400" : isInconclusive ? "text-violet-400" : "text-red-400";
  const gaugeStroke = isAuthentic ? "url(#greenGrad)" : isSuspicious ? "url(#yellowGrad)" : isInconclusive ? "url(#purpleGrad)" : "url(#redGrad)";
  const glowClass = isAuthentic ? "shadow-[0_0_40px_hsl(150_60%_50%/0.15)]" : isSuspicious ? "shadow-[0_0_40px_hsl(45_90%_55%/0.15)]" : isInconclusive ? "shadow-[0_0_40px_hsl(270_60%_55%/0.15)]" : "shadow-[0_0_40px_hsl(0_70%_55%/0.15)]";
  const riskLabel = isAuthentic ? "Authentic" : isSuspicious ? "Suspicious" : isInconclusive ? "Inconclusive — Manual Review Recommended" : "Likely Deepfake / AI Generated";

  const circumference = 2 * Math.PI * 72;
  const offset = circumference - (score / 100) * circumference;

  const passCount = MODULE_META.filter(m => {
    const mod = modules[m.key];
    return mod?.pass;
  }).length;

  const severityCount = {
    high: allAnomalies.filter((a: any) => a.severity === "high").length,
    medium: allAnomalies.filter((a: any) => a.severity === "medium").length,
    low: allAnomalies.filter((a: any) => a.severity === "low").length,
  };

  return (
    <div className="min-h-screen bg-background font-body relative overflow-hidden" ref={reportRef}>
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

      <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold mb-1 text-gradient-primary">Forensic Analysis Report</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{analysis.file_name}</span>
                {analysis.scan_mode === "deep" && <Badge variant="secondary" className="text-[10px]">DEEP SCAN</Badge>}
              </div>
            </div>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => setShowEducation(!showEducation)}>
                    <Lightbulb className="h-3.5 w-3.5" /> {showEducation ? "Hide" : "Learn"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle educational explanations for each module</TooltipContent>
              </Tooltip>
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={handleShare}>
                <Share2 className="h-3.5 w-3.5" /> Share
              </Button>
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={handleExportPDF}>
                <Download className="h-3.5 w-3.5" /> PDF Report
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Inconclusive banner */}
        {isInconclusive && (
          <motion.div
            className="glass rounded-xl p-4 mb-6 flex items-center gap-3 border-violet-500/30"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <FileWarning className="h-5 w-5 text-violet-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-display font-semibold text-violet-400">Inconclusive Results</p>
              <p className="text-xs text-muted-foreground">Confidence is between 40-60%. Manual review by a forensics expert is recommended. Try uploading a higher resolution version.</p>
            </div>
          </motion.div>
        )}

        {/* Score + Summary Row */}
        <div className="grid md:grid-cols-[300px_1fr] gap-6 mb-8">
          {/* Score Card */}
          <motion.div
            className={`glass rounded-2xl p-8 text-center ${glowClass} relative overflow-hidden`}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }} />

            <div className="relative z-10">
              <div className="relative inline-block mb-4">
                <svg width="180" height="180" className="-rotate-90">
                  <defs>
                    <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="yellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f87171" /><stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a78bfa" /><stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                    <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                  </defs>
                  <circle cx="90" cy="90" r="72" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" opacity="0.3" />
                  <motion.circle
                    cx="90" cy="90" r="72" fill="none"
                    stroke={gaugeStroke} strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    filter="url(#glow)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    className={`font-display text-4xl font-black ${scoreColor}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {score}%
                  </motion.span>
                  <span className="text-[10px] text-muted-foreground mt-1">Authenticity</span>
                </div>
              </div>

              <Badge
                variant={isAuthentic ? "default" : isInconclusive ? "secondary" : isSuspicious ? "secondary" : "destructive"}
                className="font-display text-xs tracking-wider px-3 py-1"
              >
                {riskLabel}
              </Badge>

              {suspectedMethod && suspectedMethod !== "None detected" && (
                <div className="mt-4 glass rounded-lg p-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Suspected Method</p>
                  <p className="text-xs font-display font-bold text-foreground">{suspectedMethod}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Summary Panel */}
          <motion.div className="space-y-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            {/* Confidence Reasons */}
            <div className="glass rounded-xl p-5">
              <h3 className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase mb-3">Why We Think This</h3>
              <div className="space-y-2">
                {confidenceReasons.map((reason: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs font-display font-bold text-primary mt-0.5">{i + 1}.</span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-4 gap-2">
              <div className="glass rounded-lg p-3 text-center">
                <p className="font-display text-lg font-bold">{passCount}/{MODULE_META.length}</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Passed</p>
              </div>
              <div className="glass rounded-lg p-3 text-center">
                <p className="font-display text-lg font-bold text-red-400">{severityCount.high}</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">High Sev</p>
              </div>
              <div className="glass rounded-lg p-3 text-center">
                <p className="font-display text-lg font-bold text-amber-400">{severityCount.medium}</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Med Sev</p>
              </div>
              <div className="glass rounded-lg p-3 text-center">
                <p className="font-display text-lg font-bold text-emerald-400">{severityCount.low}</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Low Sev</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Module Breakdown */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold tracking-wider">Detection Module Breakdown</h2>
            <span className="text-xs text-muted-foreground">{MODULE_META.length} modules analyzed</span>
          </div>

          <div className="space-y-3">
            {MODULE_META.map((mod, i) => {
              const modData = modules[mod.key] || {};
              const scoreVal = modData.score ?? (mod.dbKey ? analysis[`${mod.dbKey}_score`] : null) ?? 0;
              const pass = modData.pass ?? (mod.dbKey ? analysis[`${mod.dbKey}_pass`] : null);
              const detail = modData.detail || (mod.dbKey ? analysis[`${mod.dbKey}_detail`] : "") || "";
              const severity = modData.severity || "low";
              const anomalies = modData.anomalies || [];
              const isExpanded = expandedModules.has(mod.key);

              return (
                <motion.div
                  key={mod.key}
                  className="glass rounded-xl overflow-hidden hover:border-primary/20 transition-all"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                >
                  <div className={`h-[2px] bg-gradient-to-r ${mod.color}`} />

                  <div
                    className="p-4 cursor-pointer flex items-center gap-4"
                    onClick={() => toggleModule(mod.key)}
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${mod.color} bg-opacity-10 flex-shrink-0`}>
                      <mod.icon className="h-4 w-4 text-foreground" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-xs font-semibold tracking-wider">{mod.label}</span>
                        <Badge
                          variant={severity === "high" ? "destructive" : severity === "medium" ? "secondary" : "default"}
                          className="text-[9px] px-1.5 py-0"
                        >
                          {severity.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="w-full bg-muted/50 rounded-full h-1 mt-2 overflow-hidden">
                        <motion.div
                          className={`h-1 rounded-full bg-gradient-to-r ${mod.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${scoreVal}%` }}
                          transition={{ delay: 0.6 + i * 0.05, duration: 0.8 }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`font-display text-xl font-black ${
                        scoreVal >= 80 ? "text-emerald-400" : scoreVal >= 50 ? "text-amber-400" : "text-red-400"
                      }`}>
                        {scoreVal}
                      </span>
                      {pass ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <XCircle className="h-4 w-4 text-red-400" />}
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-3 border-t border-border/30 pt-3">
                          <p className="text-sm text-muted-foreground leading-relaxed">{detail}</p>

                          {showEducation && (
                            <div className="glass rounded-lg p-3 flex items-start gap-2">
                              <Lightbulb className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-muted-foreground leading-relaxed">{mod.education}</p>
                            </div>
                          )}

                          {anomalies.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-display tracking-wider text-muted-foreground uppercase">Anomalies Found</p>
                              {anomalies.map((anomaly: any, j: number) => (
                                <div key={j} className="glass rounded-lg p-3 border-l-2 border-amber-500/50">
                                  <div className="flex items-center gap-2 mb-1">
                                    <AlertTriangle className={`h-3 w-3 ${
                                      anomaly.severity === "high" ? "text-red-400" : anomaly.severity === "medium" ? "text-amber-400" : "text-emerald-400"
                                    }`} />
                                    <span className="text-xs font-display font-semibold">{anomaly.finding}</span>
                                    <Badge
                                      variant={anomaly.severity === "high" ? "destructive" : "secondary"}
                                      className="text-[9px] px-1.5 py-0 ml-auto"
                                    >
                                      {anomaly.severity?.toUpperCase()}
                                    </Badge>
                                  </div>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <p className="text-xs text-muted-foreground cursor-help flex items-center gap-1">
                                        {anomaly.explanation}
                                        <Info className="h-3 w-3 inline flex-shrink-0" />
                                      </p>
                                    </TooltipTrigger>
                                    <TooltipContent>Why we flagged this</TooltipContent>
                                  </Tooltip>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Footer Actions */}
        <motion.div
          className="mt-10 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        >
          <Button asChild variant="outline" size="sm" className="font-display text-xs tracking-wider">
            <Link to="/analyze">Analyze Another File</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="font-display text-xs tracking-wider">
            <Link to="/history">View History</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Results;
