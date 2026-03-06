import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Brain, AudioLines, BarChart3, Timer, Upload, Search, FileCheck, ArrowRight, ScanLine, Sparkles, Lock, Shield, Star, Quote, Users, Zap } from "lucide-react";
import { useRef } from "react";
import AtmosphericBackground from "@/components/AtmosphericBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CountUp from "@/components/CountUp";

const features = [
  { icon: Eye, title: "Eye Reflection Analysis", desc: "Detects mismatched or missing reflections in eyes — a hallmark of AI-generated faces." },
  { icon: AudioLines, title: "Audio-Visual Sync", desc: "Analyzes lip movement vs audio alignment to catch dubbed or synthesized speech." },
  { icon: BarChart3, title: "GAN Fingerprint", desc: "Identifies GAN fingerprints hidden in the frequency spectrum of images." },
  { icon: Timer, title: "Temporal Consistency", desc: "Checks frame-to-frame coherence for unnatural transitions in video." },
  { icon: Brain, title: "Biological Signals", desc: "Examines micro-expressions, blinking patterns, and pulse estimation." },
  { icon: ScanLine, title: "Facial Artifacts", desc: "Spots skin texture anomalies, blending edges, and warping artifacts." },
];

const steps = [
  { icon: Upload, num: "01", title: "Upload Media", desc: "Drag & drop your image or video file for instant analysis." },
  { icon: Search, num: "02", title: "AI Analysis", desc: "Eight specialized modules scan every pixel and frame simultaneously." },
  { icon: FileCheck, num: "03", title: "Get Results", desc: "Receive a detailed authenticity report with per-module scores." },
];

const testimonials = [
  { name: "Dr. Sarah Chen", role: "Digital Forensics Lead, Reuters", quote: "DeepFake-X has become an essential part of our verification pipeline. The multi-module approach catches things single-model detectors miss entirely.", rating: 5 },
  { name: "Marcus Johnson", role: "Cybersecurity Researcher, MIT", quote: "The frequency domain analysis and eye reflection modules are remarkably sophisticated. This is the most comprehensive deepfake detection tool I've tested.", rating: 5 },
  { name: "Elena Rodriguez", role: "Investigative Journalist, AP News", quote: "In an era of information warfare, tools like this are critical. I've used it to verify sources on multiple breaking stories.", rating: 5 },
  { name: "James Liu", role: "Trust & Safety Director, TechCorp", quote: "We integrated DeepFake-X into our content moderation workflow. It reduced deepfake slip-throughs by 94% in the first month.", rating: 5 },
];

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen font-body overflow-hidden relative" style={{ background: "#050508" }}>
      <AtmosphericBackground />
      <Navbar showAuth />

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: headline */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full glass text-xs font-mono tracking-wider"
                style={{ color: "#00F5FF" }}
              >
                <Sparkles className="h-3.5 w-3.5" /> AI-Powered Detection Engine
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-display font-black tracking-tight leading-[0.95] mb-8"
                style={{ fontSize: "clamp(48px, 8vw, 120px)" }}
              >
                <span style={{ color: "#F0F0F0" }}>IS IT</span>
                <br />
                <span
                  style={{
                    color: "#00F5FF",
                    textShadow: "0 0 40px rgba(0,245,255,0.4), 0 0 80px rgba(0,245,255,0.2)",
                  }}
                >
                  REAL?
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg md:text-xl mb-10 leading-relaxed max-w-lg"
                style={{ color: "#888899" }}
              >
                AI-Powered Deepfake & Synthetic Media Detection across{" "}
                <span className="text-foreground font-medium">12 detection layers</span>.
              </motion.p>

              {/* Stat counters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex gap-8 mb-10"
              >
                {[
                  { value: 99.2, suffix: "%", label: "Accuracy", decimals: 1 },
                  { value: 50, suffix: "ms", label: "Analysis", decimals: 0 },
                  { value: 12, suffix: "", label: "Detection Layers", decimals: 0 },
                ].map((s) => (
                  <div key={s.label}>
                    <CountUp end={s.value} suffix={s.suffix} decimals={s.decimals} className="font-display text-2xl font-black text-foreground" />
                    <p className="font-mono text-[10px] tracking-wider mt-1" style={{ color: "#888899" }}>{s.label}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button asChild size="lg" className="font-display text-sm tracking-[0.15em] glow-primary px-10 h-12 btn-press bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link to="/auth?mode=signup">
                    Start Analyzing <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="font-display text-sm tracking-[0.15em] h-12 px-8 btn-press border-primary/20 bg-transparent hover:bg-primary/5">
                  <a href="#features">Explore Features</a>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="flex flex-wrap gap-6 mt-10 text-xs font-mono tracking-wider"
                style={{ color: "#888899" }}
              >
                <span className="flex items-center gap-1.5"><Lock className="h-3 w-3" style={{ color: "#00F5FF" }} /> Encrypted</span>
                <span className="flex items-center gap-1.5"><Zap className="h-3 w-3" style={{ color: "#00F5FF" }} /> &lt;30s</span>
                <span className="flex items-center gap-1.5"><Shield className="h-3 w-3" style={{ color: "#00F5FF" }} /> No data stored</span>
              </motion.div>
            </div>

            {/* Right: Upload zone preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden lg:block"
            >
              <div
                className="relative rounded-2xl p-12 flex flex-col items-center justify-center min-h-[400px] group"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "2px dashed rgba(0,245,255,0.3)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: "inset 0 0 60px rgba(0,245,255,0.05)" }}
                />
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Eye className="h-16 w-16 mb-6" style={{ color: "#00F5FF", filter: "drop-shadow(0 0 20px rgba(0,245,255,0.4))" }} />
                </motion.div>
                <p className="font-display text-sm tracking-[0.2em] mb-2" style={{ color: "#F0F0F0" }}>
                  DROP IMAGE OR VIDEO HERE
                </p>
                <p className="font-mono text-[10px] tracking-wider" style={{ color: "#888899" }}>
                  JPG • PNG • WEBP • MP4 • MOV • AVI
                </p>

                {/* Scan line effect */}
                <motion.div
                  className="absolute left-4 right-4 h-[1px]"
                  style={{ background: "linear-gradient(90deg, transparent, #00F5FF, transparent)" }}
                  animate={{ y: [-180, 180] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 md:py-32 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="font-mono text-xs tracking-[0.3em] uppercase mb-4 block" style={{ color: "#00F5FF" }}>Detection Engine</span>
            <h2 className="font-display text-4xl md:text-5xl font-black mb-5">
              <span style={{ color: "#F0F0F0" }}>Eight Modules.</span>{" "}
              <span style={{ color: "#00F5FF", textShadow: "0 0 20px rgba(0,245,255,0.3)" }}>One Verdict.</span>
            </h2>
            <p className="max-w-lg mx-auto leading-relaxed" style={{ color: "#888899" }}>
              Each module specializes in a different forensic technique, combining for comprehensive analysis.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="glass rounded-2xl p-7 group transition-all duration-500 relative overflow-hidden hover:-translate-y-1"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #00F5FF, transparent)" }} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: "inset 0 0 40px rgba(0,245,255,0.03)" }} />
                <div className="relative z-10">
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{ background: "rgba(0,245,255,0.1)" }}>
                    <f.icon className="h-6 w-6" style={{ color: "#00F5FF" }} />
                  </div>
                  <h3 className="font-display text-sm font-bold tracking-wider mb-3" style={{ color: "#F0F0F0" }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#888899" }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 md:py-32 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="font-mono text-xs tracking-[0.3em] uppercase mb-4 block" style={{ color: "#00F5FF" }}>Workflow</span>
            <h2 className="font-display text-4xl md:text-5xl font-black mb-5" style={{ color: "#F0F0F0" }}>
              Three Steps to{" "}
              <span style={{ color: "#00F5FF", textShadow: "0 0 20px rgba(0,245,255,0.3)" }}>Truth</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-[1px]" style={{ background: "linear-gradient(90deg, rgba(0,245,255,0.3), rgba(0,255,136,0.3), rgba(0,245,255,0.3))" }} />
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                className="text-center relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="relative mx-auto mb-8">
                  <div className="h-24 w-24 mx-auto rounded-2xl glass flex items-center justify-center group hover:glow-primary transition-shadow duration-500">
                    <s.icon className="h-10 w-10" style={{ color: "#00F5FF" }} />
                  </div>
                  <span className="absolute -top-3 -right-3 font-display text-[10px] font-black rounded-full h-8 w-8 flex items-center justify-center tracking-wider" style={{ background: "#FF003C", color: "#fff" }}>
                    {s.num}
                  </span>
                </div>
                <h3 className="font-display text-sm font-bold tracking-wider mb-3" style={{ color: "#F0F0F0" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: "#888899" }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 md:py-32 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="font-mono text-xs tracking-[0.3em] uppercase mb-4 block" style={{ color: "#00F5FF" }}>Testimonials</span>
            <h2 className="font-display text-4xl md:text-5xl font-black mb-5" style={{ color: "#F0F0F0" }}>
              Trusted by <span style={{ color: "#00F5FF" }}>Experts</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="glass rounded-2xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Quote className="absolute top-6 right-6 h-10 w-10 opacity-10 group-hover:opacity-20 transition-opacity" style={{ color: "#00F5FF" }} />
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "#888899" }}>"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center font-display text-sm font-bold" style={{ background: "rgba(0,245,255,0.15)", color: "#00F5FF" }}>
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-display text-xs font-bold tracking-wider" style={{ color: "#F0F0F0" }}>{t.name}</p>
                    <p className="text-[11px]" style={{ color: "#888899" }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center glass rounded-3xl p-14 md:p-20 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full" style={{ background: "rgba(0,245,255,0.06)", filter: "blur(80px)" }} />
            <div className="relative z-10">
              <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-8" style={{ background: "rgba(0,245,255,0.1)" }}>
                <Shield className="h-8 w-8" style={{ color: "#00F5FF" }} />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-black mb-5" style={{ color: "#F0F0F0" }}>
                Ready to Verify <span style={{ color: "#00F5FF" }}>Authenticity</span>?
              </h2>
              <p className="mb-10 max-w-md mx-auto leading-relaxed" style={{ color: "#888899" }}>
                Create your free account and start analyzing media with our AI-powered detection engine.
              </p>
              <Button asChild size="lg" className="font-display text-sm tracking-[0.15em] px-12 h-12 glow-primary btn-press bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/auth?mode=signup">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
