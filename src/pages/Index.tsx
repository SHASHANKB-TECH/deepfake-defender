import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Brain, AudioLines, BarChart3, Timer, Upload, Search, FileCheck, ArrowRight, ScanLine, Shield, Star, Quote, ChevronDown } from "lucide-react";
import { useRef } from "react";
import AtmosphericBackground from "@/components/AtmosphericBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CountUp from "@/components/CountUp";

const features = [
  { icon: Eye, title: "Eye Reflection", desc: "Detects mismatched or missing reflections — a hallmark of AI-generated faces." },
  { icon: AudioLines, title: "Audio-Visual Sync", desc: "Analyzes lip movement vs audio for dubbed or synthesized speech." },
  { icon: BarChart3, title: "GAN Fingerprint", desc: "Identifies GAN fingerprints hidden in the frequency spectrum." },
  { icon: Timer, title: "Temporal Consistency", desc: "Checks frame-to-frame coherence for unnatural transitions." },
  { icon: Brain, title: "Biological Signals", desc: "Examines micro-expressions, blinking, and pulse patterns." },
  { icon: ScanLine, title: "Facial Artifacts", desc: "Spots texture anomalies, blending edges, and warping." },
];

const steps = [
  { icon: Upload, num: "01", title: "Upload", desc: "Drag & drop your image or video file." },
  { icon: Search, num: "02", title: "Analyze", desc: "AI modules scan every pixel simultaneously." },
  { icon: FileCheck, num: "03", title: "Results", desc: "Detailed authenticity report with scores." },
];

const testimonials = [
  { name: "Dr. Sarah Chen", role: "Digital Forensics, Reuters", quote: "Crown Shield catches things single-model detectors miss entirely.", rating: 5 },
  { name: "Marcus Johnson", role: "Cybersecurity, MIT", quote: "The most comprehensive deepfake detection tool I've tested.", rating: 5 },
  { name: "Elena Rodriguez", role: "Investigative Journalist, AP", quote: "Critical for verifying sources on breaking stories.", rating: 5 },
  { name: "James Liu", role: "Trust & Safety, TechCorp", quote: "Reduced deepfake slip-throughs by 94% in the first month.", rating: 5 },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen font-body overflow-hidden relative bg-background">
      <AtmosphericBackground />
      <Navbar showAuth />

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full text-xs tracking-widest border border-primary/20 bg-primary/5 text-primary"
            >
              <Shield className="h-3 w-3" /> AI-POWERED DETECTION
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display font-black tracking-tight leading-[0.9] mb-8"
              style={{ fontSize: "clamp(48px, 9vw, 120px)" }}
            >
              <span className="text-foreground">SPOT THE </span>
              <span
                className="text-gradient-primary"
              >
                DEEPFAKE
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl mb-10 leading-relaxed max-w-xl text-muted-foreground"
            >
              Military-grade AI forensics to detect deepfakes & synthetic media.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex items-center gap-0 mb-10 rounded-2xl border border-primary/10 bg-card/40 backdrop-blur-sm overflow-hidden"
            >
              {[
                { value: 99.2, suffix: "%", label: "Accuracy", decimals: 1 },
                { value: 50, suffix: "ms", label: "Speed", decimals: 0 },
                { value: 12, suffix: "", label: "Layers", decimals: 0 },
              ].map((s, i) => (
                <div key={s.label} className={`px-7 py-4 ${i < 2 ? "border-r border-primary/10" : ""}`}>
                  <CountUp end={s.value} suffix={s.suffix} decimals={s.decimals} className="font-display text-2xl font-black text-foreground" />
                  <p className="font-mono text-[10px] tracking-[0.2em] mt-1 text-muted-foreground uppercase">{s.label}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button asChild size="lg" className="font-display text-sm tracking-wider px-10 h-13 btn-press bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl glow-primary">
                <Link to="/auth?mode=signup">
                  Start Analyzing <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-display text-sm tracking-wider h-13 px-8 btn-press border-primary/20 bg-transparent hover:bg-primary/5 rounded-xl">
                <a href="#features">Learn More</a>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="h-4 w-4 text-primary/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 md:py-32 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <p className="text-xs tracking-[0.3em] uppercase mb-3 text-primary font-mono">Detection Engine</p>
            <h2 className="font-display text-3xl md:text-5xl font-black text-foreground">
              Six Modules. <span className="text-gradient-primary">One Verdict.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="group relative rounded-2xl p-7 border border-primary/[0.06] bg-card/30 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-primary/15"
                {...fadeUp}
                transition={{ delay: i * 0.06 }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.05), transparent 70%)" }} />
                <div className="relative z-10">
                  <div className="h-11 w-11 rounded-xl flex items-center justify-center mb-4 bg-primary/10 group-hover:bg-primary/15 transition-all duration-300">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display text-sm font-bold tracking-wider mb-2 text-foreground">{f.title}</h3>
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
          <motion.div className="text-center mb-16" {...fadeUp}>
            <p className="text-xs tracking-[0.3em] uppercase mb-3 text-primary font-mono">Workflow</p>
            <h2 className="font-display text-3xl md:text-5xl font-black text-foreground">
              Three Steps to <span className="text-gradient-primary">Truth</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
            <div className="hidden md:block absolute top-14 left-[20%] right-[20%] h-[1px]" style={{ background: "linear-gradient(90deg, hsl(var(--primary) / 0.2), hsl(var(--secondary) / 0.2), hsl(var(--primary) / 0.2))" }} />
            {steps.map((s, i) => (
              <motion.div key={s.title} className="text-center relative" {...fadeUp} transition={{ delay: i * 0.12 }}>
                <div className="relative mx-auto mb-6">
                  <div className="h-20 w-20 mx-auto rounded-2xl border border-primary/10 bg-card/30 backdrop-blur-sm flex items-center justify-center group hover:glow-primary transition-shadow duration-500">
                    <s.icon className="h-8 w-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 font-display text-[10px] font-black rounded-full h-7 w-7 flex items-center justify-center tracking-wider bg-secondary text-secondary-foreground">
                    {s.num}
                  </span>
                </div>
                <h3 className="font-display text-sm font-bold tracking-wider mb-2 text-foreground">{s.title}</h3>
                <p className="text-sm leading-relaxed max-w-xs mx-auto text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 md:py-32 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <p className="text-xs tracking-[0.3em] uppercase mb-3 text-primary font-mono">Testimonials</p>
            <h2 className="font-display text-3xl md:text-5xl font-black text-foreground">
              Trusted by <span className="text-gradient-primary">Experts</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="rounded-2xl p-7 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 border border-primary/[0.06] bg-card/30 backdrop-blur-sm hover:border-primary/12"
                {...fadeUp}
                transition={{ delay: i * 0.08 }}
              >
                <Quote className="absolute top-5 right-5 h-8 w-8 text-primary opacity-[0.06] group-hover:opacity-[0.12] transition-opacity" />
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-3 w-3 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5 text-muted-foreground">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full flex items-center justify-center font-display text-xs font-bold bg-primary/10 text-primary">
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
            className="max-w-2xl mx-auto text-center rounded-3xl p-12 md:p-16 relative overflow-hidden border border-primary/10 bg-card/40 backdrop-blur-md"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[180px] rounded-full pointer-events-none" style={{ background: "hsl(var(--primary) / 0.06)", filter: "blur(80px)" }} />
            <div className="relative z-10">
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-primary/10">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-black mb-4 text-foreground">
                Ready to <span className="text-gradient-primary">Verify</span>?
              </h2>
              <p className="mb-8 max-w-md mx-auto text-sm leading-relaxed text-muted-foreground">
                Create your free account and start analyzing media with our AI detection engine.
              </p>
              <Button asChild size="lg" className="font-display text-sm tracking-wider px-10 h-13 glow-primary btn-press bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
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
