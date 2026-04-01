import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_MESSAGES = [
  "INITIALIZING NEURAL NETWORKS...",
  "LOADING DETECTION MODELS...",
  "CALIBRATING FREQUENCY ANALYSIS...",
  "MAPPING GAN FINGERPRINT DATABASE...",
  "SYSTEM READY.",
];

const HEX_CHARS = "01ABCDEF";

const BinaryColumn = ({ delay, left }: { delay: number; left: string }) => {
  const chars = Array.from({ length: 20 }, () => HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]).join("\n");
  return (
    <motion.pre
      className="absolute top-0 text-[10px] font-mono leading-tight select-none"
      style={{ left, color: "hsl(var(--primary) / 0.03)" }}
      initial={{ y: -200 }}
      animate={{ y: "100vh" }}
      transition={{ duration: 15 + Math.random() * 10, delay, repeat: Infinity, ease: "linear" }}
    >
      {chars}
    </motion.pre>
  );
};

const CircuitGrid = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(186 100% 50%)" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

const CornerBracket = ({ position }: { position: "tl" | "tr" | "bl" | "br" }) => {
  const base = "absolute w-3 h-3";
  const styles: Record<string, string> = {
    tl: `${base} -top-4 -left-4 border-t border-l`,
    tr: `${base} -top-4 -right-4 border-t border-r`,
    bl: `${base} -bottom-4 -left-4 border-b border-l`,
    br: `${base} -bottom-4 -right-4 border-b border-r`,
  };
  return <span className={styles[position]} style={{ borderColor: "hsl(var(--primary))" }} />;
};

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [logoVisible, setLogoVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [titleDone, setTitleDone] = useState(false);

  const title = "CROWN SHIELD";

  useEffect(() => {
    const t = setTimeout(() => setLogoVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!textVisible) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedTitle(title.slice(0, i));
      if (i >= title.length) {
        clearInterval(interval);
        setTitleDone(true);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [textVisible]);

  useEffect(() => {
    const t = setTimeout(() => setTextVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setTaglineVisible(true), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 1;
      });
    }, 35);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const idx = Math.min(
      Math.floor((progress / 100) * STATUS_MESSAGES.length),
      STATUS_MESSAGES.length - 1
    );
    setStatusIndex(idx);
  }, [progress]);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => {
        setExiting(true);
        setTimeout(onComplete, 800);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [progress, onComplete]);

  const skip = useCallback(() => {
    setExiting(true);
    setTimeout(onComplete, 400);
  }, [onComplete]);

  const circumference = 2 * Math.PI * 60;
  const offset = circumference - (progress / 100) * circumference;

  const binaryColumns = Array.from({ length: 15 }, (_, i) => (
    <BinaryColumn key={i} delay={i * 0.5} left={`${(i / 15) * 100}%`} />
  ));

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "radial-gradient(ellipse at center, #0A0A1A 0%, #000000 100%)" }}
          exit={{ opacity: 0, scale: 1.1, filter: "brightness(3) blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Radial pulse glow behind logo */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 400,
              height: 400,
              background: "radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Circuit grid */}
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0.02, 0.05, 0.02] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <CircuitGrid />
          </motion.div>

          {/* Binary rain */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {binaryColumns}
          </div>

          {/* Scanning bar — top to bottom */}
          <motion.div
            className="absolute left-0 right-0 h-[2px] pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent 0%, hsl(var(--primary)) 50%, transparent 100%)",
              boxShadow: "0 0 20px hsl(var(--primary) / 0.5), 0 0 60px hsl(var(--primary) / 0.2)",
            }}
            animate={{ y: ["-100vh", "100vh"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {/* Second scanning bar — bottom to top, slower */}
          <motion.div
            className="absolute left-0 right-0 h-[1px] pointer-events-none opacity-30"
            style={{
              background: "linear-gradient(90deg, transparent 0%, hsl(var(--primary)) 50%, transparent 100%)",
              boxShadow: "0 0 12px hsl(var(--primary) / 0.3)",
            }}
            animate={{ y: ["100vh", "-100vh"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />

          {/* Glass card panel */}
          <div
            className="relative z-10 flex flex-col items-center rounded-xl px-12 py-10 backdrop-blur-sm"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid hsl(var(--primary) / 0.08)",
            }}
          >
            {/* Logo with progress ring */}
            <div className="relative mb-8">
              <svg width="140" height="140" className="-rotate-90">
                <circle cx="70" cy="70" r="60" fill="none" stroke="hsl(var(--primary) / 0.1)" strokeWidth="3" />
                <motion.circle
                  cx="70" cy="70" r="60" fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{ filter: "drop-shadow(0 0 10px hsl(var(--primary) / 0.9))" }}
                />
              </svg>

              {/* Corner targeting brackets */}
              <CornerBracket position="tl" />
              <CornerBracket position="tr" />
              <CornerBracket position="bl" />
              <CornerBracket position="br" />

              {/* CS Logo */}
              <AnimatePresence>
                {logoVisible && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    {/* Red glitch layer */}
                    <span
                      className="absolute font-display text-[2.5rem] font-black select-none"
                      style={{
                        color: "hsl(var(--secondary))",
                        opacity: 0.5,
                        transform: "translate(-3px, 0)",
                        animation: "glitch-1 0.3s ease-in-out infinite alternate",
                        animationDelay: "0.1s",
                      }}
                    >
                      CS
                    </span>
                    <motion.span
                      className="font-display text-[2.5rem] font-black relative"
                      style={{
                        color: "hsl(var(--primary))",
                        textShadow: "0 0 30px hsl(var(--primary) / 0.6), 0 0 60px hsl(var(--primary) / 0.3)",
                      }}
                      animate={{
                        textShadow: [
                          "0 0 20px hsl(186 100% 50% / 0.4), 0 0 40px hsl(186 100% 50% / 0.2)",
                          "0 0 40px hsl(186 100% 50% / 0.8), 0 0 80px hsl(186 100% 50% / 0.4)",
                          "0 0 20px hsl(186 100% 50% / 0.4), 0 0 40px hsl(186 100% 50% / 0.2)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      CS
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Title — typewriter */}
            {textVisible && (
              <div className="h-8 mb-2 flex flex-col items-center">
                <div>
                  <span
                    className="font-display text-2xl tracking-[0.5em] font-bold text-foreground"
                  >
                    {displayedTitle}
                  </span>
                  <motion.span
                    className="inline-block w-[2px] h-5 ml-1 align-middle bg-primary"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                </div>
              </div>
            )}

            {/* Horizontal rule after title */}
            {titleDone && (
              <motion.div
                className="h-[1px] mb-4 mt-2"
                style={{ background: "hsl(var(--primary) / 0.2)", width: 0 }}
                animate={{ width: 200 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            )}

            {/* Tagline */}
            <AnimatePresence>
              {taglineVisible && (
                <motion.p
                  className="font-mono text-xs tracking-[0.2em] mb-8"
                  style={{ color: "hsl(var(--primary) / 0.5)" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  AI-POWERED DEEPFAKE DETECTION
                </motion.p>
              )}
            </AnimatePresence>

            {/* Status text */}
            <motion.p
              key={statusIndex}
              className="font-mono text-[11px] tracking-[0.15em]"
              style={{ color: "hsl(var(--primary) / 0.6)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {STATUS_MESSAGES[statusIndex]}
            </motion.p>

            {/* Progress bar */}
            <div className="relative mt-4" style={{ width: 280 }}>
              <div
                className="w-full rounded-full"
                style={{ height: 2, background: "hsl(var(--primary) / 0.1)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))",
                    boxShadow: "0 0 8px hsl(var(--primary) / 0.6)",
                  }}
                />
              </div>
              <span
                className="absolute -top-4 font-mono text-[9px] tracking-[0.2em]"
                style={{
                  right: 0,
                  color: "hsl(var(--primary) / 0.4)",
                }}
              >
                {progress}%
              </span>
            </div>
          </div>

          {/* Skip button — bottom center */}
          <button
            onClick={skip}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.2em] px-4 py-1 rounded-sm transition-colors"
            style={{
              color: "hsl(var(--foreground) / 0.3)",
              border: "1px solid hsl(var(--primary) / 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "hsl(var(--primary))";
              e.currentTarget.style.color = "hsl(var(--foreground))";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "hsl(var(--primary) / 0.2)";
              e.currentTarget.style.color = "hsl(var(--foreground) / 0.3)";
            }}
          >
            SKIP →
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default SplashScreen;
