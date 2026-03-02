import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shield, Upload, Eye, Brain, AudioLines, BarChart3, Timer, ScanLine, X, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

const MODULES = [
  { key: "eye_reflection", icon: Eye, label: "Eye Reflection Consistency", desc: "Checking for mismatched or missing reflections..." },
  { key: "facial_artifact", icon: ScanLine, label: "Facial Artifact Detection", desc: "Scanning skin texture, blending edges, warping..." },
  { key: "audio_visual", icon: AudioLines, label: "Audio-Visual Sync", desc: "Analyzing lip movement vs audio alignment..." },
  { key: "frequency_domain", icon: BarChart3, label: "Frequency Domain Analysis", desc: "Detecting GAN fingerprints in frequency spectrum..." },
  { key: "temporal_consistency", icon: Timer, label: "Temporal Consistency", desc: "Checking frame-to-frame coherence..." },
  { key: "physiological", icon: Brain, label: "Physiological Signals", desc: "Examining micro-expressions and blinking patterns..." },
];

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"];
const MAX_SIZE = 20 * 1024 * 1024;

const Analyze = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentModule, setCurrentModule] = useState(-1);
  const [dragOver, setDragOver] = useState(false);

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

  const handleFile = useCallback((f: File) => {
    if (!ACCEPTED.includes(f.type)) {
      toast.error("Unsupported file type. Use JPEG, PNG, WebP, MP4, or WebM.");
      return;
    }
    if (f.size > MAX_SIZE) {
      toast.error("File too large. Maximum size is 20MB.");
      return;
    }
    setFile(f);
    if (f.type.startsWith("image")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const startAnalysis = async () => {
    if (!file || !user) return;
    setAnalyzing(true);
    setCurrentModule(0);

    try {
      // Upload file to storage
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("media-uploads")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("media-uploads")
        .getPublicUrl(filePath);

      // Convert to base64 for AI analysis (images only, with size limit)
      let imageBase64: string | null = null;
      if (file.type.startsWith("image") && file.size < 5 * 1024 * 1024) {
        imageBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]);
          };
          reader.readAsDataURL(file);
        });
      }

      // Animate through modules
      for (let i = 0; i < MODULES.length; i++) {
        setCurrentModule(i);
        await new Promise((r) => setTimeout(r, 800));
      }

      // Call AI analysis
      const { data: analysisResult, error: fnError } = await supabase.functions.invoke("analyze-media", {
        body: { imageBase64, fileName: file.name, fileType: file.type },
      });

      if (fnError) throw fnError;
      if (analysisResult?.error) throw new Error(analysisResult.error);

      const m = analysisResult.modules;

      // Save to database
      const { data: inserted, error: dbError } = await supabase
        .from("analyses")
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_type: file.type,
          file_url: publicUrl,
          overall_score: analysisResult.overall_score,
          risk_level: analysisResult.risk_level,
          eye_reflection_score: m.eye_reflection.score,
          eye_reflection_pass: m.eye_reflection.pass,
          eye_reflection_detail: m.eye_reflection.detail,
          facial_artifact_score: m.facial_artifact.score,
          facial_artifact_pass: m.facial_artifact.pass,
          facial_artifact_detail: m.facial_artifact.detail,
          audio_visual_score: m.audio_visual.score,
          audio_visual_pass: m.audio_visual.pass,
          audio_visual_detail: m.audio_visual.detail,
          frequency_domain_score: m.frequency_domain.score,
          frequency_domain_pass: m.frequency_domain.pass,
          frequency_domain_detail: m.frequency_domain.detail,
          temporal_consistency_score: m.temporal_consistency.score,
          temporal_consistency_pass: m.temporal_consistency.pass,
          temporal_consistency_detail: m.temporal_consistency.detail,
          physiological_score: m.physiological.score,
          physiological_pass: m.physiological.pass,
          physiological_detail: m.physiological.detail,
        })
        .select("id")
        .single();

      if (dbError) throw dbError;

      navigate(`/results/${inserted.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Analysis failed. Please try again.");
      setAnalyzing(false);
      setCurrentModule(-1);
    }
  };

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

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.h1 className="font-display text-2xl font-bold mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Analyze Media
        </motion.h1>
        <p className="text-sm text-muted-foreground mb-8">Upload an image or video to check for deepfake indicators.</p>

        {!analyzing ? (
          <>
            {/* Upload zone */}
            <motion.div
              className={`glass rounded-2xl p-8 text-center cursor-pointer transition-all border-2 border-dashed ${
                dragOver ? "border-primary bg-primary/5" : file ? "border-primary/30" : "border-border/50 hover:border-primary/30"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !file && document.getElementById("file-input")?.click()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <input
                id="file-input"
                type="file"
                accept={ACCEPTED.join(",")}
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />

              {file ? (
                <div className="space-y-4">
                  {preview && (
                    <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg object-contain" />
                  )}
                  <div className="flex items-center justify-center gap-3">
                    <ScanLine className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                    <button onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-display text-sm font-semibold mb-1">Drag & drop your file here</p>
                  <p className="text-xs text-muted-foreground">JPEG, PNG, WebP, MP4, WebM — Max 20MB</p>
                </>
              )}
            </motion.div>

            {file && (
              <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button onClick={startAnalysis} className="w-full font-display text-sm tracking-wider glow-primary" size="lg">
                  <ScanLine className="h-4 w-4 mr-2" /> Start Analysis
                </Button>
              </motion.div>
            )}
          </>
        ) : (
          /* Analysis animation */
          <motion.div className="glass rounded-2xl p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center mb-8">
              <div className="h-12 w-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="font-display text-sm font-semibold">Analyzing {file?.name}...</p>
            </div>

            <div className="space-y-4">
              {MODULES.map((mod, i) => {
                const status = i < currentModule ? "done" : i === currentModule ? "active" : "pending";
                return (
                  <motion.div
                    key={mod.key}
                    className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                      status === "active" ? "bg-primary/10 border border-primary/30" : status === "done" ? "opacity-60" : "opacity-30"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: status === "pending" ? 0.3 : 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <mod.icon className={`h-5 w-5 flex-shrink-0 ${status === "active" ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-display font-semibold tracking-wider">{mod.label}</p>
                      {status === "active" && (
                        <div className="mt-1.5">
                          <p className="text-xs text-muted-foreground mb-1.5">{mod.desc}</p>
                          <Progress value={65} className="h-1.5" />
                        </div>
                      )}
                    </div>
                    {status === "done" && <span className="text-xs text-green-400 font-display">✓ DONE</span>}
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
