import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Eye, Brain, AudioLines, BarChart3, Timer, Upload, Search, FileCheck, ArrowRight, Zap, Users, ScanLine } from "lucide-react";

const features = [
  { icon: Eye, title: "Eye Reflection Analysis", desc: "Detects mismatched or missing reflections in eyes — a hallmark of AI-generated faces." },
  { icon: AudioLines, title: "Audio-Visual Sync", desc: "Analyzes lip movement vs audio alignment to catch dubbed or synthesized speech." },
  { icon: BarChart3, title: "Frequency Domain Analysis", desc: "Identifies GAN fingerprints hidden in the frequency spectrum of images." },
  { icon: Timer, title: "Temporal Consistency", desc: "Checks frame-to-frame coherence for unnatural transitions in video." },
  { icon: Brain, title: "Physiological Signals", desc: "Examines micro-expressions, blinking patterns, and pulse estimation." },
  { icon: ScanLine, title: "Facial Artifact Detection", desc: "Spots skin texture anomalies, blending edges, and warping artifacts." },
];

const steps = [
  { icon: Upload, num: "01", title: "Upload Media", desc: "Drag & drop your image or video for analysis." },
  { icon: Search, num: "02", title: "AI Analysis", desc: "Our multi-module AI engine scans every pixel and frame." },
  { icon: FileCheck, num: "03", title: "Get Results", desc: "Receive a detailed authenticity report with confidence scores." },
];

const stats = [
  { value: "10,000+", label: "Scans Performed" },
  { value: "99.2%", label: "Detection Accuracy" },
  { value: "6", label: "Analysis Modules" },
  { value: "<30s", label: "Avg Analysis Time" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-body overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="font-display text-lg font-bold tracking-wider">DEEPFAKE-X</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <Link to="/auth" className="hover:text-foreground transition-colors">Log In</Link>
            <Button asChild size="sm" className="font-display text-xs tracking-wider glow-primary">
              <Link to="/auth?mode=signup">Get Started</Link>
            </Button>
          </div>
          <Button asChild size="sm" className="md:hidden font-display text-xs">
            <Link to="/auth?mode=signup">Sign Up</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(hsl(185 80% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(185 80% 50%) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div className="max-w-4xl mx-auto text-center" initial="hidden" animate="visible">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full glass text-xs font-medium text-primary">
              <Zap className="h-3 w-3" /> Powered by Advanced AI Analysis
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-6">
              Detect Deepfakes{" "}
              <span className="text-gradient-primary">in Seconds</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Upload any photo or video and our AI engine will analyze it across 6 detection modules — from eye reflections to frequency domain fingerprints.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="font-display text-sm tracking-wider glow-primary px-8">
                <Link to="/auth?mode=signup">Start Analyzing <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-display text-sm tracking-wider">
                <a href="#features">Explore Features</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Detection <span className="text-gradient-primary">Modules</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Six specialized AI modules work together to provide comprehensive authenticity analysis.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} className="glass rounded-xl p-6 hover:border-primary/30 transition-colors group" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:glow-primary transition-shadow">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-sm font-semibold tracking-wider mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">How It <span className="text-gradient-primary">Works</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Three simple steps to verify media authenticity.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <motion.div key={s.title} className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="relative mx-auto mb-6 h-20 w-20 rounded-2xl glass flex items-center justify-center">
                  <s.icon className="h-8 w-8 text-primary" />
                  <span className="absolute -top-2 -right-2 font-display text-xs font-bold bg-accent text-accent-foreground rounded-full h-7 w-7 flex items-center justify-center">{s.num}</span>
                </div>
                <h3 className="font-display text-sm font-semibold tracking-wider mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div className="max-w-2xl mx-auto text-center glass rounded-2xl p-12 glow-primary" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <Shield className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Ready to Detect Deepfakes?</h2>
            <p className="text-muted-foreground mb-8">Create your free account and start analyzing media in seconds.</p>
            <Button asChild size="lg" className="font-display text-sm tracking-wider px-10">
              <Link to="/auth?mode=signup">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-display text-sm font-bold tracking-wider">DEEPFAKE-X</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 DeepFake-X. AI-powered media authenticity detection.</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" /> Built for journalists, researchers & the public
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
