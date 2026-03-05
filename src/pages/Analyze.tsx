import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Shield, Upload, Eye, Brain, AudioLines, BarChart3, Timer, ScanLine, X, ArrowLeft,
  Zap, Info, FileImage, Play, AlertTriangle, Layers, Microscope, Fingerprint, Focus
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

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

const SAMPLE_FILES = [
  { name: "sample_ai_portrait.jpg", label: "AI Portrait", desc: "StyleGAN2-generated face" },
  { name: "sample_faceswap.jpg", label: "Face Swap", desc: "Manipulated celebrity image" },
  { name: "sample_real_photo.jpg", label: "Real Photo", desc: "Authentic photograph" },
];

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
    const newPreviews: (string | null)[] = [];

    for (const f of newFiles) {
      if (files.length + validFiles.length >= MAX_BATCH) {
        toast.error(`Maximum ${MAX_BATCH} files allowed.`);
        break;
      }
      if (!ACCEPTED.includes(f.type)) {
        toast.error(`${f.name}: Unsupported file type.`);
        continue;
      }
      if (f.size > MAX_SIZE) {
        toast.error(`${f.name}: File too large (max 20MB).`);
        continue;
      }
      validFiles.push(f);
      if (f.type.startsWith("image")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => {
            const updated = [...prev];
            const idx = files.length + validFiles.indexOf(f);
            updated[idx] = e.target?.result as string;
            return updated;
          });
        };
        reader.readAsDataURL(f);
        newPreviews.push(null);
      } else {
        newPreviews.push(null);
      }
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      setPreviews(prev => [...prev, ...newPreviews]);
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

    // Upload file to storage
    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from("media-uploads").upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from("media-uploads").getPublicUrl(filePath);

    // Convert to base64 for AI analysis (images only, with size limit)
    let imageBase64: string | null = null;
    if (file.type.startsWith("image") && file.size < 5 * 1024 * 1024) {
      imageBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.readAsDataURL(file);
      });
    }

    // Animate through modules
    for (let i = 0; i < MODULES.length; i++) {
      setCurrentModule(i);
      await new Promise((r) => setTimeout(r, deepScan ? 1200 : 600));
    }

    // Call AI analysis
    const { data: result, error: fnError } = await supabase.functions.invoke("analyze-media", {
      body: { imageBase64, fileName: file.name, fileType: file.type, scanMode: deepScan ? "deep" : "standard" },
    });

    if (fnError) throw fnError;
    if (result?.error) throw new Error(result.error);

    const m = result.modules;

    // Map new modules to legacy columns + store detailed report
    const { data: inserted, error: dbError } = await supabase
      .from("analyses")
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_type: file.type,
        file_url: publicUrl,
        overall_score: result.overall_score,
        risk_level: result.risk_level,
        scan_mode: deepScan ? "deep" : "standard",
        suspected_method: result.suspected_method,
        confidence_reasons: result.confidence_reasons,
        anomalies: Object.values(m).flatMap((mod: any) => mod.anomalies || []),
        detailed_report: result,
        // Legacy module columns mapped from new modules
        eye_reflection_score: m.eye_reflection?.score,
        eye_reflection_pass: m.eye_reflection?.pass,
        eye_reflection_detail: m.eye_reflection?.detail,
        facial_artifact_score: m.facial_inconsistency?.score,
        facial_artifact_pass: m.facial_inconsistency?.pass,
        facial_artifact_detail: m.facial_inconsistency?.detail,
        audio_visual_score: m.metadata_compression?.score,
        audio_visual_pass: m.metadata_compression?.pass,
        audio_visual_detail: m.metadata_compression?.detail,
        frequency_domain_score: m.gan_fingerprint?.score,
        frequency_domain_pass: m.gan_fingerprint?.pass,
        frequency_domain_detail: m.gan_fingerprint?.detail,
        temporal_consistency_score: m.temporal_consistency?.score,
        temporal_consistency_pass: m.temporal_consistency?.pass,
        temporal_consistency_detail: m.temporal_consistency?.detail,
        physiological_score: m.biological_signals?.score,
        physiological_pass: m.biological_signals?.pass,
        physiological_detail: m.biological_signals?.detail,
      })
      .select("id")
      .single();

    if (dbError) throw dbError;
    return inserted.id;
  };

  const startAnalysis = async () => {
    if (files.length === 0 || !user) return;
    setAnalyzing(true);
    setCurrentModule(0);

    try {
      if (files.length === 1) {
        const id = await analyzeFile(files[0], 0);
        if (id) navigate(`/results/${id}`);
      } else {
        // Batch: analyze sequentially, then go to history
        for (let i = 0; i < files.length; i++) {
          await analyzeFile(files[i], i);
        }
        toast.success(`${files.length} files analyzed successfully!`);
        navigate("/history");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Analysis failed. Please try again.");
      setAnalyzing(false);
      setCurrentModule(-1);
    }
  };

  const isLowRes = files.some(f => f.size < 50 * 1024 && f.type.startsWith("image"));

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
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

      <div className="container mx-auto px-4 py-8 max-w-3xl relative z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="font-display text-2xl font-bold mb-1">Forensic Media Analysis</h1>
          <p className="text-sm text-muted-foreground mb-6">Upload up to {MAX_BATCH} files for deepfake detection across 8 forensic modules.</p>
        </motion.div>

        {!analyzing ? (
          <>
            {/* Deep Scan Toggle */}
            <motion.div
              className="glass rounded-xl p-4 mb-6 flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-display font-semibold tracking-wider">Deep Scan Mode</span>
                    {deepScan && <Badge variant="secondary" className="text-[10px]">PRO</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">Slower but more thorough analysis using advanced AI model</p>
                </div>
              </div>
              <Switch checked={deepScan} onCheckedChange={setDeepScan} />
            </motion.div>

            {/* Low-res warning */}
            {isLowRes && (
              <motion.div
                className="glass rounded-xl p-4 mb-6 flex items-center gap-3 border-amber-500/30"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              >
                <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-display font-semibold text-amber-400">Low Resolution Detected</p>
                  <p className="text-xs text-muted-foreground">Results may be less reliable. Upload a higher resolution file for better accuracy.</p>
                </div>
              </motion.div>
            )}

            {/* Upload zone */}
            <motion.div
              className={`glass rounded-2xl p-8 text-center cursor-pointer transition-all border-2 border-dashed ${
                dragOver ? "border-primary bg-primary/5" : files.length > 0 ? "border-primary/30" : "border-border/50 hover:border-primary/30"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => files.length === 0 && document.getElementById("file-input")?.click()}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            >
              <input
                id="file-input"
                type="file"
                accept={ACCEPTED.join(",")}
                multiple
                className="hidden"
                onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))}
              />

              {files.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {files.map((f, i) => (
                      <div key={i} className="glass rounded-lg p-3 relative group">
                        {previews[i] ? (
                          <img src={previews[i]!} alt={f.name} className="h-24 w-full object-cover rounded-md mb-2" />
                        ) : (
                          <div className="h-24 w-full rounded-md bg-muted/30 flex items-center justify-center mb-2">
                            {f.type.startsWith("video") ? <Play className="h-8 w-8 text-muted-foreground" /> : <FileImage className="h-8 w-8 text-muted-foreground" />}
                          </div>
                        )}
                        <p className="text-xs font-medium truncate">{f.name}</p>
                        <p className="text-[10px] text-muted-foreground">{(f.size / 1024 / 1024).toFixed(1)} MB</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                          className="absolute top-1 right-1 h-5 w-5 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {files.length < MAX_BATCH && (
                      <button
                        onClick={(e) => { e.stopPropagation(); document.getElementById("file-input")?.click(); }}
                        className="glass rounded-lg p-3 h-[140px] flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border/50 hover:border-primary/30 transition-colors"
                      >
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Add More</span>
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{files.length} file{files.length > 1 ? "s" : ""} selected</p>
                </div>
              ) : (
                <>
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-display text-sm font-semibold mb-1">Drag & drop files here</p>
                  <p className="text-xs text-muted-foreground mb-4">JPG, PNG, WebP, MP4, WebM, MOV, AVI — Max 20MB each — Up to {MAX_BATCH} files</p>
                  <Button variant="outline" size="sm" className="text-xs font-display tracking-wider">
                    Browse Files
                  </Button>
                </>
              )}
            </motion.div>

            {/* Actions */}
            {files.length > 0 && (
              <motion.div className="mt-6 space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button onClick={startAnalysis} className="w-full font-display text-sm tracking-wider glow-primary" size="lg">
                  <ScanLine className="h-4 w-4 mr-2" />
                  {deepScan ? "Start Deep Analysis" : "Start Analysis"}
                  {files.length > 1 && ` (${files.length} files)`}
                </Button>
              </motion.div>
            )}

            {/* Module Preview */}
            <motion.div
              className="mt-10"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            >
              <h3 className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase mb-4">Detection Modules</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MODULES.map((mod) => (
                  <Tooltip key={mod.key}>
                    <TooltipTrigger asChild>
                      <div className="glass rounded-lg p-3 text-center cursor-help hover:border-primary/30 transition-colors">
                        <mod.icon className="h-4 w-4 text-primary mx-auto mb-1.5" />
                        <p className="text-[10px] font-display tracking-wider">{mod.label.split(" ").slice(0, 2).join(" ")}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="font-display text-xs font-semibold mb-1">{mod.label}</p>
                      <p className="text-xs text-muted-foreground">{mod.desc}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          /* Analysis animation */
          <motion.div className="glass rounded-2xl p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center mb-8">
              <div className="relative h-16 w-16 mx-auto mb-4">
                <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
                <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-2 border-2 border-accent/20 rounded-full" />
                <div className="absolute inset-2 border-2 border-accent border-b-transparent rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
              </div>
              <p className="font-display text-sm font-semibold">
                {deepScan ? "Deep Scanning" : "Analyzing"} {files[currentFileIndex]?.name}...
              </p>
              {files.length > 1 && (
                <p className="text-xs text-muted-foreground mt-1">File {currentFileIndex + 1} of {files.length}</p>
              )}
            </div>

            <div className="space-y-3">
              {MODULES.map((mod, i) => {
                const status = i < currentModule ? "done" : i === currentModule ? "active" : "pending";
                return (
                  <motion.div
                    key={mod.key}
                    className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                      status === "active" ? "bg-primary/10 border border-primary/30" : status === "done" ? "opacity-60" : "opacity-30"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: status === "pending" ? 0.3 : 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <mod.icon className={`h-4 w-4 flex-shrink-0 ${status === "active" ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-display font-semibold tracking-wider">{mod.label}</p>
                      {status === "active" && (
                        <div className="mt-1.5">
                          <p className="text-[10px] text-muted-foreground mb-1">{mod.desc}</p>
                          <Progress value={65} className="h-1" />
                        </div>
                      )}
                    </div>
                    {status === "done" && <span className="text-[10px] text-emerald-400 font-display">✓</span>}
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
