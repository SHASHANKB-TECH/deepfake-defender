import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_MESSAGES = [
  "INITIALIZING NEURAL NETWORKS...",
  "LOADING DETECTION MODELS...",
  "CALIBRATING FREQUENCY ANALYSIS...",
  "MAPPING GAN FINGERPRINT DATABASE...",
  "SYSTEM READY.",
];

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
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 1;
      });
    }, 35);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const idx = Math.min(Math.floor((progress / 100) * STATUS_MESSAGES.length), STATUS_MESSAGES.length - 1);
    setStatusIndex(idx);
  }, [progress]);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => { setExiting(true); setTimeout(onComplete, 800); }, 600);
      return () => clearTimeout(t);
    }
  }, [progress, onComplete]);

  const skip = useCallback(() => {
    setExiting(true);
    setTimeout(onComplete, 400);
  }, [onComplete]);

  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "radial-gradient(ellipse at center, hsl(250 30% 8%) 0%, hsl(250 25% 3%) 100%)" }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Ambient glow */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 500,
              height: 500,
              background: "radial-gradient(circle, hsl(265 90% 65% / 0.08) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 300,
              height: 300,
              top: "60%",
              left: "30%",
              background: "radial-gradient(circle, hsl(38 100% 55% / 0.05) 0%, transparent 70%)",
            }}
            animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Floating particles */}
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 3 === 0 ? "hsl(38 100% 55% / 0.3)" : "hsl(265 90% 65% / 0.2)",
              }}
              animate={{
                y: [0, -30 - Math.random() * 40, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{ duration: 4 + Math.random() * 6, repeat: Infinity, delay: Math.random() * 3 }}
            />
          ))}

          {/* Center card */}
          <div
            className="relative z-10 flex flex-col items-center rounded-2xl px-14 py-12"
            style={{
              background: "hsl(250 20% 8% / 0.6)",
              border: "1px solid hsl(265 50% 50% / 0.1)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Logo ring */}
            <div className="relative mb-8">
              <svg width="120" height="120" className="-rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(265 50% 50% / 0.1)" strokeWidth="2" />
                <motion.circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke="url(#ringGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{ filter: "drop-shadow(0 0 8px hsl(265 90% 65% / 0.6))" }}
                />
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(265 90% 65%)" />
                    <stop offset="100%" stopColor="hsl(38 100% 55%)" />
                  </linearGradient>
                </defs>
              </svg>

              {/* CS Logo */}
              <AnimatePresence>
                {logoVisible && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <motion.span
                      className="font-display text-[2.2rem] font-black relative"
                      style={{
                        background: "linear-gradient(135deg, hsl(265 90% 65%), hsl(38 100% 55%))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        filter: "drop-shadow(0 0 20px hsl(265 90% 65% / 0.5))",
                      }}
                      animate={{
                        filter: [
                          "drop-shadow(0 0 15px hsl(265 90% 65% / 0.3))",
                          "drop-shadow(0 0 30px hsl(265 90% 65% / 0.6))",
                          "drop-shadow(0 0 15px hsl(265 90% 65% / 0.3))",
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
                  <span className="font-display text-xl tracking-[0.4em] font-bold text-foreground">
                    {displayedTitle}
                  </span>
                  <motion.span
                    className="inline-block w-[2px] h-5 ml-1 align-middle"
                    style={{ background: "hsl(var(--primary))" }}
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                </div>
              </div>
            )}

            {/* Divider */}
            {titleDone && (
              <motion.div
                className="h-[1px] mb-4 mt-2"
                style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.4), hsl(var(--secondary) / 0.4), transparent)", width: 0 }}
                animate={{ width: 220 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            )}

            {/* Tagline */}
            <AnimatePresence>
              {taglineVisible && (
                <motion.p
                  className="font-mono text-xs tracking-[0.2em] mb-8"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  AI-POWERED DEEPFAKE DETECTION
                </motion.p>
              )}
            </AnimatePresence>

            {/* Status */}
            <motion.p
              key={statusIndex}
              className="font-mono text-[11px] tracking-[0.15em]"
              style={{ color: "hsl(var(--primary) / 0.6)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {STATUS_MESSAGES[statusIndex]}
            </motion.p>

            {/* Progress bar */}
            <div className="relative mt-4" style={{ width: 260 }}>
              <div className="w-full rounded-full overflow-hidden" style={{ height: 3, background: "hsl(var(--muted))" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, hsl(265 90% 65%), hsl(38 100% 55%))",
                    boxShadow: "0 0 12px hsl(265 90% 65% / 0.5)",
                  }}
                />
              </div>
              <span className="absolute -top-4 right-0 font-mono text-[9px] tracking-[0.2em]" style={{ color: "hsl(var(--muted-foreground) / 0.6)" }}>
                {progress}%
              </span>
            </div>
          </div>

          {/* Skip */}
          <button
            onClick={skip}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.2em] px-5 py-1.5 rounded-lg transition-all duration-300 hover:bg-primary/10"
            style={{
              color: "hsl(var(--muted-foreground) / 0.4)",
              border: "1px solid hsl(var(--primary) / 0.15)",
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
