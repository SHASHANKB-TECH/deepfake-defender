import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye, ScanLine, BarChart3, Timer, Brain, CheckCircle, XCircle,
  Download, Share2, AlertTriangle, Fingerprint, Focus, Layers, Microscope,
  ChevronDown, ChevronUp, Lightbulb, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import CountUp from "@/components/CountUp";

const MODULE_META = [
  { key: "facial_inconsistency", dbKey: "facial_artifact", icon: ScanLine, label: "Facial Inconsistency", education: "AI-generated faces often show unnatural skin texture, inconsistent lighting, or subtle warping around hairlines and ears." },
  { key: "metadata_compression", dbKey: "audio_visual", icon: Layers, label: "Metadata & Compression", education: "Real photos contain EXIF data from cameras. Deepfakes often have missing metadata or show signs of double-compression." },
  { key: "gan_fingerprint", dbKey: "frequency_domain", icon: Fingerprint, label: "GAN Fingerprint", education: "GANs leave invisible fingerprints in the frequency domain — patterns like checkerboard artifacts from upsampling layers." },
  { key: "semantic_consistency", dbKey: null, icon: Focus, label: "Semantic Consistency", education: "AI struggles with details like correct tooth count, proper hand anatomy, and physically plausible backgrounds." },
  { key: "eye_reflection", dbKey: "eye_reflection", icon: Eye, label: "Eye Reflection", education: "Real eyes reflect the same light sources. AI-generated faces often have mismatched or impossible eye reflections." },
  { key: "temporal_consistency", dbKey: "temporal_consistency", icon: Timer, label: "Temporal Consistency", education: "In deepfake videos, facial regions may flicker between frames, and blinking patterns are often unnatural." },
  { key: "biological_signals", dbKey: "physiological", icon: Brain, label: "Biological Signals", education: "Real faces show subtle color changes from blood flow (rPPG). Deepfakes lack these micro-signals." },
  { key: "boundary_blending", dbKey: null, icon: Microscope, label: "Boundary & Blending", education: "Face-swap deepfakes show edge bleeding around the jawline and neck, with color temperature mismatches." },
];

interface ResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysis: any;
}

const ResultsDialog = ({ open, onOpenChange, analysis }: ResultsDialogProps) => {
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [showEducation, setShowEducation] = useState(false);

  if (!analysis) return null;

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

  const scoreColor = isAuthentic ? "#00FF88" : isSuspicious ? "#FBBF24" : isInconclusive ? "#A78BFA" : "#FF003C";
  const riskLabel = isAuthentic ? "Authentic" : isSuspicious ? "Suspicious" : isInconclusive ? "Inconclusive" : "Likely Deepfake";

  const circumference = 2 * Math.PI * 60;
  const offset = circumference - (score / 100) * circumference;
  const passCount = MODULE_META.filter(m => modules[m.key]?.pass).length;

  const severityCount = {
    high: allAnomalies.filter((a: any) => a.severity === "high").length,
    medium: allAnomalies.filter((a: any) => a.severity === "medium").length,
    low: allAnomalies.filter((a: any) => a.severity === "low").length,
  };

  const toggleModule = (key: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/results/${analysis.id}`);
      toast.success("Link copied!");
    } catch { toast.error("Failed to copy"); }
  };

  const handleExportPDF = () => {
    try {
      generatePdfReport(analysis);
      toast.success("PDF report downloaded");
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-0"
        style={{
          background: "rgba(5,5,8,0.95)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(0,245,255,0.15)",
        }}
      >
        {/* Top accent line */}
        <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg, transparent, #00F5FF, transparent)" }} />

        <div className="p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="font-display text-xl md:text-2xl font-bold text-gradient-primary">Forensic Analysis Report</h2>
              <div className="flex items-center gap-3 text-sm font-mono mt-1" style={{ color: "#888899" }}>
                <span>{analysis.file_name}</span>
                {analysis.scan_mode === "deep" && (
                  <Badge className="text-[10px] border-none" style={{ background: "rgba(255,0,60,0.15)", color: "#FF003C" }}>DEEP SCAN</Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs gap-1.5 btn-press border-primary/20 bg-transparent" onClick={() => setShowEducation(!showEducation)}>
                <Lightbulb className="h-3.5 w-3.5" /> {showEducation ? "Hide" : "Learn"}
              </Button>
              <Button variant="outline" size="sm" className="text-xs gap-1.5 btn-press border-primary/20 bg-transparent" onClick={handleShare}>
                <Share2 className="h-3.5 w-3.5" /> Share
              </Button>
              <Button variant="outline" size="sm" className="text-xs gap-1.5 btn-press border-primary/20 bg-transparent glow-primary" onClick={handleExportPDF}>
                <Download className="h-3.5 w-3.5" /> PDF
              </Button>
            </div>
          </div>

          {isInconclusive && (
            <div className="glass rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" style={{ color: "#A78BFA" }} />
              <div>
                <p className="text-sm font-display font-semibold" style={{ color: "#A78BFA" }}>Inconclusive Results</p>
                <p className="text-xs font-mono" style={{ color: "#888899" }}>Confidence is between 40-60%. Manual review recommended.</p>
              </div>
            </div>
          )}

          {/* Score + Summary */}
          <div className="grid md:grid-cols-[240px_1fr] gap-6">
            {/* Score gauge */}
            <motion.div
              className="glass rounded-2xl p-6 text-center"
              style={{ boxShadow: `0 0 40px ${scoreColor}15` }}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            >
              <div className="relative inline-block mb-3">
                <svg width="140" height="140" className="-rotate-90">
                  <defs>
                    <filter id="glow-dialog"><feGaussianBlur stdDeviation="3" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                  </defs>
                  <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <motion.circle
                    cx="70" cy="70" r="60" fill="none"
                    stroke={scoreColor} strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    filter="url(#glow-dialog)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-3xl font-black" style={{ color: scoreColor }}>
                    <CountUp end={score} suffix="%" />
                  </span>
                  <span className="text-[10px] font-mono mt-1" style={{ color: "#888899" }}>Authenticity</span>
                </div>
              </div>

              <Badge className="font-display text-xs tracking-wider px-3 py-1 border-none" style={{ background: `${scoreColor}20`, color: scoreColor }}>
                {riskLabel}
              </Badge>

              {suspectedMethod && suspectedMethod !== "None detected" && (
                <div className="mt-3 glass rounded-lg p-2">
                  <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "#888899" }}>Suspected Method</p>
                  <p className="text-xs font-display font-bold" style={{ color: "#F0F0F0" }}>{suspectedMethod}</p>
                </div>
              )}
            </motion.div>

            {/* Reasoning + stats */}
            <div className="space-y-4">
              <div className="glass rounded-xl p-4">
                <h3 className="font-mono text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "#888899" }}>Why We Think This</h3>
                <div className="space-y-1.5">
                  {confidenceReasons.map((reason: string, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-xs font-display font-bold mt-0.5" style={{ color: "#00F5FF" }}>{i + 1}.</span>
                      <p className="text-sm leading-relaxed" style={{ color: "#888899" }}>{reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Passed", value: `${passCount}/${MODULE_META.length}`, color: "#F0F0F0" },
                  { label: "High", value: severityCount.high, color: "#FF003C" },
                  { label: "Medium", value: severityCount.medium, color: "#FBBF24" },
                  { label: "Low", value: severityCount.low, color: "#00FF88" },
                ].map(s => (
                  <div key={s.label} className="glass rounded-lg p-2.5 text-center">
                    <p className="font-display text-base font-bold" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "#888899" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Module Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-sm font-semibold" style={{ color: "#F0F0F0" }}>Detection Module Breakdown</h3>
              <span className="text-xs font-mono" style={{ color: "#888899" }}>{MODULE_META.length} modules</span>
            </div>

            <div className="space-y-2">
              {MODULE_META.map((mod, i) => {
                const modData = modules[mod.key] || {};
                const scoreVal = modData.score ?? (mod.dbKey ? analysis[`${mod.dbKey}_score`] : null) ?? 0;
                const pass = modData.pass ?? (mod.dbKey ? analysis[`${mod.dbKey}_pass`] : null);
                const detail = modData.detail || (mod.dbKey ? analysis[`${mod.dbKey}_detail`] : "") || "";
                const severity = modData.severity || "low";
                const anomalies = modData.anomalies || [];
                const isExpanded = expandedModules.has(mod.key);
                const barColor = scoreVal >= 80 ? "#00FF88" : scoreVal >= 50 ? "#FBBF24" : "#FF003C";

                return (
                  <div key={mod.key} className="glass rounded-xl overflow-hidden transition-all hover:border-primary/20">
                    <div className="h-[1px]" style={{ background: "linear-gradient(90deg, transparent, #00F5FF, transparent)" }} />
                    <div className="p-3 cursor-pointer flex items-center gap-3" onClick={() => toggleModule(mod.key)}>
                      <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: "rgba(0,245,255,0.08)" }}>
                        <mod.icon className="h-3.5 w-3.5" style={{ color: "#00F5FF" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-xs font-semibold tracking-wider" style={{ color: "#F0F0F0" }}>{mod.label}</span>
                          <Badge className="text-[9px] px-1.5 py-0 border-none" style={{
                            background: severity === "high" ? "rgba(255,0,60,0.15)" : severity === "medium" ? "rgba(251,191,36,0.15)" : "rgba(0,255,136,0.15)",
                            color: severity === "high" ? "#FF003C" : severity === "medium" ? "#FBBF24" : "#00FF88",
                          }}>
                            {severity.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="w-full rounded-full h-1 mt-1.5 overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                          <motion.div
                            className="h-1 rounded-full"
                            style={{ background: barColor }}
                            initial={{ width: 0 }}
                            animate={{ width: `${scoreVal}%` }}
                            transition={{ delay: 0.3 + i * 0.05, duration: 0.8 }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="font-display text-lg font-black" style={{ color: barColor }}>{scoreVal}</span>
                        {pass ? <CheckCircle className="h-3.5 w-3.5" style={{ color: "#00FF88" }} /> : <XCircle className="h-3.5 w-3.5" style={{ color: "#FF003C" }} />}
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" style={{ color: "#888899" }} /> : <ChevronDown className="h-3.5 w-3.5" style={{ color: "#888899" }} />}
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
                          <div className="px-3 pb-3 space-y-2 pt-2" style={{ borderTop: "1px solid rgba(0,245,255,0.05)" }}>
                            <p className="text-sm leading-relaxed" style={{ color: "#888899" }}>{detail}</p>
                            {showEducation && (
                              <div className="glass rounded-lg p-2.5 flex items-start gap-2">
                                <Lightbulb className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: "#FBBF24" }} />
                                <p className="text-xs leading-relaxed" style={{ color: "#888899" }}>{mod.education}</p>
                              </div>
                            )}
                            {anomalies.length > 0 && (
                              <div className="space-y-1.5">
                                <p className="text-xs font-mono tracking-wider uppercase" style={{ color: "#888899" }}>Anomalies</p>
                                {anomalies.map((anomaly: any, j: number) => (
                                  <div key={j} className="glass rounded-lg p-2.5" style={{ borderLeft: `2px solid ${anomaly.severity === "high" ? "#FF003C" : anomaly.severity === "medium" ? "#FBBF24" : "#00FF88"}` }}>
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <AlertTriangle className="h-3 w-3" style={{ color: anomaly.severity === "high" ? "#FF003C" : anomaly.severity === "medium" ? "#FBBF24" : "#00FF88" }} />
                                      <span className="text-xs font-display font-semibold" style={{ color: "#F0F0F0" }}>{anomaly.finding}</span>
                                    </div>
                                    <p className="text-xs" style={{ color: "#888899" }}>{anomaly.explanation}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid rgba(0,245,255,0.08)" }}>
            <Button
              variant="outline" size="sm"
              className="text-xs gap-1.5 font-display tracking-[0.1em] btn-press border-primary/20 bg-transparent"
              onClick={() => navigate(`/results/${analysis.id}`)}
            >
              <ExternalLink className="h-3.5 w-3.5" /> Full Report
            </Button>
            <Button
              size="sm"
              className="text-xs font-display tracking-[0.1em] btn-press glow-primary bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => onOpenChange(false)}
            >
              Analyze Another
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsDialog;
