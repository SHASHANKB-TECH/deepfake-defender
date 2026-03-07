import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Upload, Eye, Brain, AudioLines, BarChart3, Timer, ScanLine, X, ArrowLeft,
  Zap, FileImage, Play, AlertTriangle, Layers, Microscope, Fingerprint, Focus
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import AtmosphericBackground from "@/components/AtmosphericBackground";
import Navbar from "@/components/Navbar";
import ResultsDialog from "@/components/ResultsDialog";

const MODULES = [
  { key: "facial_inconsistency", icon: ScanLine, label: "Facial Inconsistency Analysis", desc: "Scanning skin texture, lighting, hairlines, ear asymmetry..." },
  { key: "metadata_compression", icon: Layers, label: "Metadata & Compression Analysis", desc: "Checking EXIF data, compression artifacts, noise patterns..." },
  { key: "gan_fingerprint", icon: Fingerprint, label: "GAN Fingerprint Detection", desc: "Detecting frequency anomalies, checkerboard artifacts, spectral signatures..." },
  { key: "semantic_consistency", icon: Focus, label: "Semantic Consistency Check", desc: "Verifying teeth, hands, physics, perspective consistency..." },
  { key: "eye_reflection", icon: Eye, label: "Eye Reflection Analysis", desc: "Checking catchlight consistency and reflection matching..." },
  { key: "temporal_consistency", icon: Timer, label: "Temporal Consistency", desc: "Analyzing frame-to-frame coherence and blinking patterns..." },
  { key: "biological_signals", icon: Brain, label: "Biological Signal Detection", desc: "Examining rPPG signals, micro-expressions, skin color changes..." },
  { key: "boundary_blending", icon: Microscope, label: "Boundary & Blending Artifacts", desc: "Detecting face-swap edges, jawline bleeding, color mismatch..." },
];

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
const MAX_SIZE = 20 * 1024 * 1024;
const MAX_BATCH = 10;

const Analyze = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<(string | null)[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentModule, setCurrentModule] = useState(-1);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [deepScan, setDeepScan] = useState(false);
  const [resultAnalysis, setResultAnalysis] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

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

  const addFiles = useCallback((newFiles: File[]) => {
    const validFiles: File[] = [];
    for (const f of newFiles) {
      if (files.length + validFiles.length >= MAX_BATCH) { toast.error(`Maximum ${MAX_BATCH} files.`); break; }
      if (!ACCEPTED.includes(f.type)) { toast.error(`${f.name}: Unsupported format.`); continue; }
      if (f.size > MAX_SIZE) { toast.error(`${f.name}: Too large (max 20MB).`); continue; }
      validFiles.push(f);
      if (f.type.startsWith("image")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => {
            const updated = [...prev];
            updated[files.length + validFiles.indexOf(f)] = e.target?.result as string;
            return updated;
          });
        };
        reader.readAsDataURL(f);
      }
    }
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      setPreviews(prev => [...prev, ...validFiles.map(() => null)]);
    }
  }, [files.length]);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  }, [addFiles]);

  const analyzeFile = async (file: File, fileIndex: number) => {
    if (!user) return null;
    setCurrentFileIndex(fileIndex);
    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from("media-uploads").upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage.from("media-uploads").getPublicUrl(filePath);

    let imageBase64: string | null = null;
    if (file.type.startsWith("image") && file.size < 5 * 1024 * 1024) {
      imageBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.readAsDataURL(file);
      });
    }

    for (let i = 0; i < MODULES.length; i++) {
      setCurrentModule(i);
      await new Promise(r => setTimeout(r, deepScan ? 1200 : 600));
    }

    const { data: result, error: fnError } = await supabase.functions.invoke("analyze-media", {
      body: { imageBase64, fileName: file.name, fileType: file.type, scanMode: deepScan ? "deep" : "standard" },
    });
    if (fnError) throw fnError;
    if (result?.error) throw new Error(result.error);

    const m = result.modules;
    const { data: inserted, error: dbError } = await supabase.from("analyses").insert({
      user_id: user.id, file_name: file.name, file_type: file.type, file_url: publicUrl,
      overall_score: result.overall_score, risk_level: result.risk_level,
      scan_mode: deepScan ? "deep" : "standard", suspected_method: result.suspected_method,
      confidence_reasons: result.confidence_reasons,
      anomalies: Object.values(m).flatMap((mod: any) => mod.anomalies || []),
      detailed_report: result,
      eye_reflection_score: m.eye_reflection?.score, eye_reflection_pass: m.eye_reflection?.pass, eye_reflection_detail: m.eye_reflection?.detail,
      facial_artifact_score: m.facial_inconsistency?.score, facial_artifact_pass: m.facial_inconsistency?.pass, facial_artifact_detail: m.facial_inconsistency?.detail,
      audio_visual_score: m.metadata_compression?.score, audio_visual_pass: m.metadata_compression?.pass, audio_visual_detail: m.metadata_compression?.detail,
      frequency_domain_score: m.gan_fingerprint?.score, frequency_domain_pass: m.gan_fingerprint?.pass, frequency_domain_detail: m.gan_fingerprint?.detail,
      temporal_consistency_score: m.temporal_consistency?.score, temporal_consistency_pass: m.temporal_consistency?.pass, temporal_consistency_detail: m.temporal_consistency?.detail,
      physiological_score: m.biological_signals?.score, physiological_pass: m.biological_signals?.pass, physiological_detail: m.biological_signals?.detail,
    }).select("*").single();
    if (dbError) throw dbError;
    return inserted;
  };

  const startAnalysis = async () => {
    if (files.length === 0 || !user) return;
    setAnalyzing(true);
    setCurrentModule(0);
    try {
      if (files.length === 1) {
        const result = await analyzeFile(files[0], 0);
        if (result) {
          setResultAnalysis(result);
          setShowResults(true);
          setAnalyzing(false);
          setCurrentModule(-1);
          setFiles([]);
          setPreviews([]);
        }
      } else {
        for (let i = 0; i < files.length; i++) await analyzeFile(files[i], i);
        toast.success(`${files.length} files analyzed!`);
        navigate("/history");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Analysis failed.");
      setAnalyzing(false);
      setCurrentModule(-1);
    }
  };

  const isLowRes = files.some(f => f.size < 50 * 1024 && f.type.startsWith("image"));

  return (
    <div className="min-h-screen font-body relative" style={{ background: "#050508" }}>
      <AtmosphericBackground />
      <Navbar showDashboard />

      <div className="container mx-auto px-4 py-8 pt-24 max-w-3xl relative z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="font-display text-2xl font-bold mb-1" style={{ color: "#F0F0F0" }}>Forensic Media Analysis</h1>
          <p className="text-sm font-mono tracking-wider mb-6" style={{ color: "#888899" }}>Upload up to {MAX_BATCH} files for deepfake detection.</p>
        </motion.div>

        {!analyzing ? (
          <>
            {/* Deep Scan Toggle */}
            <motion.div className="glass rounded-xl p-4 mb-6 flex items-center justify-between" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,0,60,0.1)" }}>
                  <Zap className="h-4 w-4" style={{ color: "#FF003C" }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-display font-semibold tracking-wider" style={{ color: "#F0F0F0" }}>Deep Scan Mode</span>
                    {deepScan && <Badge className="text-[10px] border-none" style={{ background: "rgba(255,0,60,0.15)", color: "#FF003C" }}>PRO</Badge>}
                  </div>
                  <p className="text-xs font-mono" style={{ color: "#888899" }}>Slower but more thorough analysis</p>
                </div>
              </div>
              <Switch checked={deepScan} onCheckedChange={setDeepScan} />
            </motion.div>

            {isLowRes && (
              <motion.div className="glass rounded-xl p-4 mb-6 flex items-center gap-3" style={{ borderColor: "rgba(251,191,36,0.3)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <AlertTriangle className="h-5 w-5 flex-shrink-0" style={{ color: "#FBBF24" }} />
                <div>
                  <p className="text-sm font-display font-semibold" style={{ color: "#FBBF24" }}>Low Resolution Detected</p>
                  <p className="text-xs font-mono" style={{ color: "#888899" }}>Upload a higher resolution file for better accuracy.</p>
                </div>
              </motion.div>
            )}

            {/* Upload zone */}
            <motion.div
              className={`rounded-2xl p-8 text-center transition-all ${
                dragOver ? "border-solid" : "border-dashed"
              }`}
              style={{
                background: dragOver ? "rgba(0,255,136,0.03)" : "rgba(255,255,255,0.03)",
                border: `2px ${dragOver ? "solid" : "dashed"} ${dragOver ? "#00FF88" : files.length > 0 ? "rgba(0,245,255,0.3)" : "rgba(0,245,255,0.15)"}`,
                backdropFilter: "blur(12px)",
                cursor: "pointer",
              }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => files.length === 0 && document.getElementById("file-input")?.click()}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            >
              <input id="file-input" type="file" accept={ACCEPTED.join(",")} multiple className="hidden" onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))} />

              {files.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {files.map((f, i) => (
                      <div key={i} className="glass rounded-lg p-3 relative group">
                        {previews[i] ? (
                          <img src={previews[i]!} alt={f.name} className="h-24 w-full object-cover rounded-md mb-2" />
                        ) : (
                          <div className="h-24 w-full rounded-md flex items-center justify-center mb-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                            {f.type.startsWith("video") ? <Play className="h-8 w-8" style={{ color: "#888899" }} /> : <FileImage className="h-8 w-8" style={{ color: "#888899" }} />}
                          </div>
                        )}
                        <p className="text-xs font-medium truncate" style={{ color: "#F0F0F0" }}>{f.name}</p>
                        <p className="text-[10px] font-mono" style={{ color: "#888899" }}>{(f.size / 1024 / 1024).toFixed(1)} MB</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                          className="absolute top-1 right-1 h-5 w-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: "rgba(5,5,8,0.8)" }}
                        >
                          <X className="h-3 w-3" style={{ color: "#F0F0F0" }} />
                        </button>
                      </div>
                    ))}
                    {files.length < MAX_BATCH && (
                      <button
                        onClick={(e) => { e.stopPropagation(); document.getElementById("file-input")?.click(); }}
                        className="glass rounded-lg p-3 h-[140px] flex flex-col items-center justify-center gap-2 border-2 border-dashed transition-colors"
                        style={{ borderColor: "rgba(0,245,255,0.15)" }}
                      >
                        <Upload className="h-6 w-6" style={{ color: "#888899" }} />
                        <span className="text-xs font-mono" style={{ color: "#888899" }}>Add More</span>
                      </button>
                    )}
                  </div>
                  <p className="text-xs font-mono" style={{ color: "#888899" }}>{files.length} file{files.length > 1 ? "s" : ""} selected</p>
                </div>
              ) : (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Eye className="h-16 w-16 mx-auto mb-5" style={{ color: "#00F5FF", filter: "drop-shadow(0 0 20px rgba(0,245,255,0.4))" }} />
                  </motion.div>
                  <p className="font-display text-sm font-semibold mb-1 tracking-wider" style={{ color: "#F0F0F0" }}>DROP IMAGE OR VIDEO HERE</p>
                  <p className="text-xs font-mono tracking-wider mb-4" style={{ color: "#888899" }}>JPG • PNG • WebP • MP4 • WebM • MOV • AVI — Max 20MB</p>
                  <Button variant="outline" size="sm" className="text-xs font-display tracking-[0.15em] btn-press border-primary/20 bg-transparent hover:bg-primary/5">
                    Browse Files
                  </Button>
                </>
              )}
            </motion.div>

            {files.length > 0 && (
              <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button onClick={startAnalysis} className="w-full font-display text-sm tracking-[0.15em] glow-primary btn-press bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                  <ScanLine className="h-4 w-4 mr-2" />
                  {deepScan ? "Start Deep Analysis" : "Start Analysis"}
                  {files.length > 1 && ` (${files.length} files)`}
                </Button>
              </motion.div>
            )}

            {/* Module preview */}
            <motion.div className="mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <h3 className="font-mono text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "#888899" }}>Detection Modules</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MODULES.map((mod) => (
                  <Tooltip key={mod.key}>
                    <TooltipTrigger asChild>
                      <div className="glass rounded-lg p-3 text-center cursor-help transition-colors hover:border-primary/30">
                        <mod.icon className="h-4 w-4 mx-auto mb-1.5" style={{ color: "#00F5FF" }} />
                        <p className="text-[10px] font-display tracking-wider" style={{ color: "#F0F0F0" }}>{mod.label.split(" ").slice(0, 2).join(" ")}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="font-display text-xs font-semibold mb-1">{mod.label}</p>
                      <p className="text-xs" style={{ color: "#888899" }}>{mod.desc}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div className="glass rounded-2xl p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center mb-8">
              <div className="relative h-16 w-16 mx-auto mb-4">
                <div className="absolute inset-0 border-2 rounded-full" style={{ borderColor: "rgba(0,245,255,0.2)" }} />
                <div className="absolute inset-0 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#00F5FF", borderTopColor: "transparent" }} />
                <div className="absolute inset-2 border-2 rounded-full" style={{ borderColor: "rgba(255,0,60,0.2)" }} />
                <div className="absolute inset-2 border-2 border-b-transparent rounded-full animate-spin" style={{ borderColor: "#FF003C", borderBottomColor: "transparent", animationDirection: "reverse", animationDuration: "1.5s" }} />
              </div>
              <p className="font-display text-sm font-semibold" style={{ color: "#F0F0F0" }}>
                {deepScan ? "Deep Scanning" : "Analyzing"} {files[currentFileIndex]?.name}...
              </p>
              {files.length > 1 && <p className="text-xs font-mono mt-1" style={{ color: "#888899" }}>File {currentFileIndex + 1} of {files.length}</p>}
            </div>

            <div className="space-y-3">
              {MODULES.map((mod, i) => {
                const status = i < currentModule ? "done" : i === currentModule ? "active" : "pending";
                return (
                  <motion.div
                    key={mod.key}
                    className={`flex items-center gap-4 p-3 rounded-lg transition-all`}
                    style={{
                      background: status === "active" ? "rgba(0,245,255,0.08)" : "transparent",
                      border: status === "active" ? "1px solid rgba(0,245,255,0.2)" : "1px solid transparent",
                      opacity: status === "pending" ? 0.3 : status === "done" ? 0.6 : 1,
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: status === "pending" ? 0.3 : 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <mod.icon className="h-4 w-4 flex-shrink-0" style={{ color: status === "active" ? "#00F5FF" : "#888899" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-display font-semibold tracking-wider" style={{ color: "#F0F0F0" }}>{mod.label}</p>
                      {status === "active" && (
                        <div className="mt-1.5">
                          <p className="text-[10px] font-mono mb-1" style={{ color: "#888899" }}>{mod.desc}</p>
                          <Progress value={65} className="h-1" />
                        </div>
                      )}
                    </div>
                    {status === "done" && <span className="text-[10px] font-mono" style={{ color: "#00FF88" }}>✓</span>}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Analyze;
