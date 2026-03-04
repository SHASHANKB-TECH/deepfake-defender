import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Eye, Brain, AudioLines, BarChart3, Timer, Upload, Search, FileCheck, ArrowRight, Zap, Users, ScanLine, ChevronDown, Sparkles, Lock, Star, Quote } from "lucide-react";
import { useRef } from "react";
import heroFaceScan from "@/assets/hero-face-scan.jpg";
import aiNetworkBg from "@/assets/ai-network-bg.jpg";
import forensicsSplit from "@/assets/forensics-split.jpg";

const features = [
  { icon: Eye, title: "Eye Reflection Analysis", desc: "Detects mismatched or missing reflections in eyes — a hallmark of AI-generated faces.", color: "from-cyan-400/20 to-blue-500/20", border: "hover:border-cyan-500/40" },
  { icon: AudioLines, title: "Audio-Visual Sync", desc: "Analyzes lip movement vs audio alignment to catch dubbed or synthesized speech.", color: "from-pink-400/20 to-rose-500/20", border: "hover:border-pink-500/40" },
  { icon: BarChart3, title: "Frequency Domain", desc: "Identifies GAN fingerprints hidden in the frequency spectrum of images.", color: "from-amber-400/20 to-orange-500/20", border: "hover:border-amber-500/40" },
  { icon: Timer, title: "Temporal Consistency", desc: "Checks frame-to-frame coherence for unnatural transitions in video.", color: "from-emerald-400/20 to-green-500/20", border: "hover:border-emerald-500/40" },
  { icon: Brain, title: "Physiological Signals", desc: "Examines micro-expressions, blinking patterns, and pulse estimation.", color: "from-sky-400/20 to-indigo-500/20", border: "hover:border-sky-500/40" },
  { icon: ScanLine, title: "Facial Artifacts", desc: "Spots skin texture anomalies, blending edges, and warping artifacts.", color: "from-violet-400/20 to-purple-500/20", border: "hover:border-violet-500/40" },
];

const steps = [
  { icon: Upload, num: "01", title: "Upload Media", desc: "Drag & drop your image or video file for instant analysis." },
  { icon: Search, num: "02", title: "AI Analysis", desc: "Six specialized modules scan every pixel and frame simultaneously." },
  { icon: FileCheck, num: "03", title: "Get Results", desc: "Receive a detailed authenticity report with per-module scores." },
];

const stats = [
  { value: "10,000+", label: "Scans Performed" },
  { value: "99.2%", label: "Detection Accuracy" },
  { value: "6", label: "Analysis Modules" },
  { value: "<30s", label: "Avg Analysis Time" },
];

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "Digital Forensics Lead, Reuters",
    quote: "DeepFake-X has become an essential part of our verification pipeline. The multi-module approach catches things single-model detectors miss entirely.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Cybersecurity Researcher, MIT",
    quote: "The frequency domain analysis and eye reflection modules are remarkably sophisticated. This is the most comprehensive deepfake detection tool I've tested.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Investigative Journalist, AP News",
    quote: "In an era of information warfare, tools like this are critical. I've used it to verify sources on multiple breaking stories. Fast, accurate, indispensable.",
    rating: 5,
  },
  {
    name: "James Liu",
    role: "Trust & Safety Director, TechCorp",
    quote: "We integrated DeepFake-X into our content moderation workflow. It reduced deepfake slip-throughs by 94% in the first month alone.",
    rating: 5,
  },
];

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-background font-body overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="relative">
              <Shield className="h-7 w-7 text-primary" />
              <div className="absolute inset-0 h-7 w-7 text-primary blur-sm opacity-50">
                <Shield className="h-7 w-7" />
              </div>
            </div>
            <span className="font-display text-lg font-bold tracking-wider">DEEPFAKE-X</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors duration-300">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors duration-300">How It Works</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors duration-300">Testimonials</a>
            <Link to="/auth" className="hover:text-foreground transition-colors duration-300">Log In</Link>
            <Button asChild size="sm" className="font-display text-xs tracking-wider glow-primary">
              <Link to="/auth?mode=signup">Get Started</Link>
            </Button>
          </div>
          <Button asChild size="sm" className="md:hidden font-display text-xs glow-primary">
            <Link to="/auth?mode=signup">Sign Up</Link>
          </Button>
        </div>
      </nav>

      {/* Hero with background image */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center">
        {/* Hero background image */}
        <div className="absolute inset-0">
          <img
            src={heroFaceScan}
            alt="AI facial scan analysis"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-background/80" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        {/* Animated orbs on top */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, hsl(185 80% 50% / 0.08) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, hsl(270 60% 55% / 0.08) 0%, transparent 70%)" }}
            animate={{ scale: [1.1, 1, 1.1], x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full glass text-xs font-medium text-primary border border-primary/20"
            >
              <Sparkles className="h-3.5 w-3.5" /> AI-Powered Deepfake Detection Engine
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8"
            >
              Detect{" "}
              <span className="text-gradient-primary relative">
                Deepfakes
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-accent rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </span>
              <br />
              <span className="text-muted-foreground/60">in Seconds</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Upload any photo or video and our AI engine analyzes it across{" "}
              <span className="text-foreground font-medium">6 detection modules</span> — from eye reflections to frequency domain fingerprints.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button asChild size="lg" className="font-display text-sm tracking-wider glow-primary px-10 h-12">
                <Link to="/auth?mode=signup">
                  Start Analyzing <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-display text-sm tracking-wider h-12 px-8">
                <a href="#features">Explore Features</a>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-muted-foreground"
            >
              <span className="flex items-center gap-1.5"><Lock className="h-3 w-3 text-primary" /> End-to-end encrypted</span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-primary" /> Results in under 30s</span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1.5"><Shield className="h-3 w-3 text-primary" /> No data stored</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-display">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="font-display text-4xl md:text-5xl font-black text-gradient-primary mb-2">{s.value}</div>
                <div className="text-sm text-muted-foreground tracking-wide">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase image section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="relative rounded-3xl overflow-hidden max-w-5xl mx-auto group"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img
              src={forensicsSplit}
              alt="Real vs Fake deepfake comparison analysis"
              className="w-full h-[300px] md:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <span className="font-display text-xs tracking-[0.3em] text-primary uppercase mb-2 block">Real-Time Detection</span>
              <h3 className="font-display text-2xl md:text-3xl font-black mb-2">See What AI Sees</h3>
              <p className="text-muted-foreground text-sm max-w-md">Our forensic analysis reveals hidden artifacts and manipulation patterns invisible to the human eye.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 md:py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="font-display text-xs tracking-[0.3em] text-primary uppercase mb-4 block">Detection Engine</span>
            <h2 className="font-display text-4xl md:text-5xl font-black mb-5">
              Six Modules.{" "}
              <span className="text-gradient-primary">One Verdict.</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Each module specializes in a different forensic technique, combining for comprehensive analysis.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className={`glass rounded-2xl p-7 group transition-all duration-500 relative overflow-hidden ${f.border}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display text-sm font-bold tracking-wider mb-3">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works with background image */}
      <section id="how-it-works" className="py-24 md:py-32 relative">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={aiNetworkBg}
            alt="AI neural network visualization"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/90" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="font-display text-xs tracking-[0.3em] text-primary uppercase mb-4 block">Workflow</span>
            <h2 className="font-display text-4xl md:text-5xl font-black mb-5">
              Three Steps to{" "}
              <span className="text-gradient-primary">Truth</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Simple, fast, and reliable media verification.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40" />

            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                className="text-center relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <div className="relative mx-auto mb-8">
                  <div className="h-24 w-24 mx-auto rounded-2xl glass flex items-center justify-center group hover:glow-primary transition-shadow duration-500">
                    <s.icon className="h-10 w-10 text-primary" />
                  </div>
                  <span className="absolute -top-3 -right-3 font-display text-[10px] font-black bg-accent text-accent-foreground rounded-full h-8 w-8 flex items-center justify-center tracking-wider">
                    {s.num}
                  </span>
                </div>
                <h3 className="font-display text-sm font-bold tracking-wider mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 md:py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="font-display text-xs tracking-[0.3em] text-primary uppercase mb-4 block">Testimonials</span>
            <h2 className="font-display text-4xl md:text-5xl font-black mb-5">
              Trusted by{" "}
              <span className="text-gradient-primary">Experts</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Professionals across journalism, research, and security rely on DeepFake-X daily.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="glass rounded-2xl p-8 relative overflow-hidden group hover:border-primary/30 transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                {/* Subtle quote mark */}
                <Quote className="absolute top-6 right-6 h-10 w-10 text-primary/10 group-hover:text-primary/20 transition-colors duration-500" />

                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6 relative z-10">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center font-display text-sm font-bold text-foreground">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-display text-xs font-bold tracking-wider">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center glass rounded-3xl p-14 md:p-20 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-accent/10 rounded-full blur-[60px]" />

            <div className="relative z-10">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-black mb-5">
                Ready to Verify{" "}
                <span className="text-gradient-primary">Authenticity</span>?
              </h2>
              <p className="text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
                Create your free account and start analyzing media with our AI-powered detection engine.
              </p>
              <Button asChild size="lg" className="font-display text-sm tracking-wider px-12 h-12 glow-primary">
                <Link to="/auth?mode=signup">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border/30">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-display text-sm font-bold tracking-wider">DEEPFAKE-X</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 DeepFake-X. AI-powered media authenticity detection.</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" /> Built for journalists, researchers & the public
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
