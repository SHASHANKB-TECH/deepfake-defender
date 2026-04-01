import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Brain, AudioLines, BarChart3, Timer, Upload, Search, FileCheck, ArrowRight, ScanLine, Sparkles, Lock, Shield, Star, Quote, Zap, ChevronDown } from "lucide-react";
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
  { name: "Dr. Sarah Chen", role: "Digital Forensics Lead, Reuters", quote: "Crown Shield has become an essential part of our verification pipeline. The multi-module approach catches things single-model detectors miss entirely.", rating: 5 },
  { name: "Marcus Johnson", role: "Cybersecurity Researcher, MIT", quote: "The frequency domain analysis and eye reflection modules are remarkably sophisticated. This is the most comprehensive deepfake detection tool I've tested.", rating: 5 },
  { name: "Elena Rodriguez", role: "Investigative Journalist, AP News", quote: "In an era of information warfare, tools like this are critical. I've used it to verify sources on multiple breaking stories.", rating: 5 },
  { name: "James Liu", role: "Trust & Safety Director, TechCorp", quote: "We integrated Crown Shield into our content moderation workflow. It reduced deepfake slip-throughs by 94% in the first month.", rating: 5 },
];

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen font-body overflow-hidden relative bg-background">
      <AtmosphericBackground />
      <Navbar showAuth />

      {/* Hero — full-screen centered */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2 mb-10 rounded-full text-xs font-mono tracking-[0.2em] border border-primary/20 bg-primary/5 text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" /> AI-POWERED DETECTION ENGINE
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-black tracking-tight leading-[0.9] mb-6"
              style={{ fontSize: "clamp(56px, 10vw, 140px)" }}
            >
              <span className="text-foreground">IS IT </span>
              <span className="text-primary" style={{ textShadow: "0 0 60px hsl(var(--primary) / 0.4), 0 0 120px hsl(var(--primary) / 0.15)" }}>
                REAL?
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl mb-12 leading-relaxed max-w-2xl text-muted-foreground"
            >
              Detect deepfakes & synthetic media with military-grade AI forensics.{" "}
              <span className="text-foreground font-medium">12 detection layers. One verdict.</span>
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex items-center gap-0 mb-12 rounded-2xl border border-primary/10 bg-card/50 backdrop-blur-sm overflow-hidden"
            >
              {[
                { value: 99.2, suffix: "%", label: "Accuracy", decimals: 1 },
                { value: 50, suffix: "ms", label: "Analysis", decimals: 0 },
                { value: 12, suffix: "", label: "Detection Layers", decimals: 0 },
              ].map((s, i) => (
                <div key={s.label} className={`px-8 py-5 ${i < 2 ? "border-r border-primary/10" : ""}`}>
                  <CountUp end={s.value} suffix={s.suffix} decimals={s.decimals} className="font-display text-2xl md:text-3xl font-black text-foreground" />
                  <p className="font-mono text-[10px] tracking-[0.2em] mt-1 text-muted-foreground uppercase">{s.label}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <Button asChild size="lg" className="font-display text-sm tracking-[0.15em] glow-primary px-12 h-14 btn-press bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
                <Link to="/auth?mode=signup">
                  Start Analyzing <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-display text-sm tracking-[0.15em] h-14 px-10 btn-press border-primary/20 bg-transparent hover:bg-primary/5 rounded-xl">
                <a href="#features">Explore Features</a>
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-6 text-xs font-mono tracking-[0.15em] text-muted-foreground"
            >
              <span className="flex items-center gap-1.5"><Lock className="h-3 w-3 text-primary" /> ENCRYPTED</span>
              <span className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-primary" /> REAL-TIME</span>
              <span className="flex items-center gap-1.5"><Shield className="h-3 w-3 text-primary" /> ZERO DATA STORED</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">SCROLL</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="h-4 w-4 text-primary/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features — bento-style grid */}
      <section id="features" className="py-24 md:py-32 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="font-mono text-xs tracking-[0.3em] uppercase mb-4 block text-primary">Detection Engine</span>
            <h2 className="font-display text-4xl md:text-5xl font-black mb-5">
              <span className="text-foreground">Eight Modules.</span>{" "}
              <span className="text-primary" style={{ textShadow: "0 0 20px hsl(var(--primary) / 0.3)" }}>One Verdict.</span>
            </h2>
            <p className="max-w-lg mx-auto leading-relaxed text-muted-foreground">
              Each module specializes in a different forensic technique, combining for comprehensive analysis.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="group relative rounded-2xl p-8 border border-primary/[0.08] bg-card/30 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-primary/20"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.06), transparent 70%)" }} />
                <div className="relative z-10">
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5 bg-primary/10 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display text-sm font-bold tracking-wider mb-3 text-foreground">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
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
            <span className="font-mono text-xs tracking-[0.3em] uppercase mb-4 block text-primary">Workflow</span>
            <h2 className="font-display text-4xl md:text-5xl font-black mb-5 text-foreground">
              Three Steps to{" "}
              <span className="text-primary" style={{ textShadow: "0 0 20px hsl(var(--primary) / 0.3)" }}>Truth</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-[1px]" style={{ background: "linear-gradient(90deg, hsl(var(--primary) / 0.3), hsl(var(--accent) / 0.3), hsl(var(--primary) / 0.3))" }} />
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
                  <div className="h-24 w-24 mx-auto rounded-2xl border border-primary/10 bg-card/30 backdrop-blur-sm flex items-center justify-center group hover:glow-primary transition-shadow duration-500">
                    <s.icon className="h-10 w-10 text-primary" />
                  </div>
                  <span className="absolute -top-3 -right-3 font-display text-[10px] font-black rounded-full h-8 w-8 flex items-center justify-center tracking-wider bg-secondary text-secondary-foreground">
                    {s.num}
                  </span>
                </div>
                <h3 className="font-display text-sm font-bold tracking-wider mb-3 text-foreground">{s.title}</h3>
                <p className="text-sm leading-relaxed max-w-xs mx-auto text-muted-foreground">{s.desc}</p>
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
            <span className="font-mono text-xs tracking-[0.3em] uppercase mb-4 block text-primary">Testimonials</span>
            <h2 className="font-display text-4xl md:text-5xl font-black mb-5 text-foreground">
              Trusted by <span className="text-primary">Experts</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="rounded-2xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 border border-primary/[0.08] bg-card/30 backdrop-blur-sm hover:border-primary/15"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Quote className="absolute top-6 right-6 h-10 w-10 text-primary opacity-[0.07] group-hover:opacity-[0.15] transition-opacity" />
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-6 text-muted-foreground">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center font-display text-sm font-bold bg-primary/15 text-primary">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-display text-xs font-bold tracking-wider text-foreground">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground">{t.role}</p>
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
            className="max-w-3xl mx-auto text-center rounded-3xl p-14 md:p-20 relative overflow-hidden border border-primary/10 bg-card/40 backdrop-blur-md"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full pointer-events-none" style={{ background: "hsl(var(--primary) / 0.06)", filter: "blur(80px)" }} />
            <div className="relative z-10">
              <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-8 bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-black mb-5 text-foreground">
                Ready to Verify <span className="text-primary">Authenticity</span>?
              </h2>
              <p className="mb-10 max-w-md mx-auto leading-relaxed text-muted-foreground">
                Create your free account and start analyzing media with our AI-powered detection engine.
              </p>
              <Button asChild size="lg" className="font-display text-sm tracking-[0.15em] px-12 h-14 glow-primary btn-press bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
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
