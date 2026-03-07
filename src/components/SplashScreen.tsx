import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_MESSAGES = [
  "INITIALIZING NEURAL NETWORKS...",
  "LOADING DETECTION MODELS...",
  "CALIBRATING FREQUENCY ANALYSIS...",
  "MAPPING GAN FINGERPRINT DATABASE...",
  "SYSTEM READY.",
];

// Binary rain column
const BinaryColumn = ({ delay, left }: { delay: number; left: string }) => {
  const chars = Array.from({ length: 20 }, () => Math.random() > 0.5 ? "1" : "0").join("\n");
  return (
    <motion.pre
      className="absolute top-0 text-[10px] font-mono text-primary/[0.05] leading-tight select-none"
      style={{ left }}
      initial={{ y: -200 }}
      animate={{ y: "100vh" }}
      transition={{ duration: 15 + Math.random() * 10, delay, repeat: Infinity, ease: "linear" }}
    >
      {chars}
    </motion.pre>
  );
};

// Circuit grid background
const CircuitGrid = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,245,255,1)" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

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

  const title = "CROWN SHIELD";

  useEffect(() => {
    const t = setTimeout(() => setLogoVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Typewriter effect for title
  useEffect(() => {
    if (!textVisible) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedTitle(title.slice(0, i));
      if (i >= title.length) clearInterval(interval);
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

  // Progress & status
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
          style={{ background: "#000000" }}
          exit={{
            opacity: 0,
            scale: 1.1,
            filter: "brightness(3) blur(10px)",
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
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

          {/* Scanning bar */}
          <motion.div
            className="absolute left-0 right-0 h-[2px] pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent 0%, #00F5FF 50%, transparent 100%)",
              boxShadow: "0 0 20px rgba(0,245,255,0.5), 0 0 60px rgba(0,245,255,0.2)",
            }}
            animate={{ y: ["-100vh", "100vh"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo X with progress ring */}
            <div className="relative mb-8">
              <svg width="140" height="140" className="-rotate-90">
                <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(0,245,255,0.1)" strokeWidth="2" />
                <motion.circle
                  cx="70" cy="70" r="60" fill="none"
                  stroke="#00F5FF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{ filter: "drop-shadow(0 0 6px rgba(0,245,255,0.6))" }}
                />
              </svg>

              {/* Glitching X */}
              <AnimatePresence>
                {logoVisible && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    {/* Glitch layers */}
                    <span
                      className="absolute font-display text-6xl font-black select-none"
                      style={{
                        color: "#FF003C",
                        opacity: 0.5,
                        animation: "glitch-1 0.3s ease-in-out infinite alternate",
                        animationDelay: "0.1s",
                      }}
                    >
                      ⛨
                    </span>
                    <motion.span
                      className="font-display text-6xl font-black relative"
                      style={{
                        color: "#00F5FF",
                        textShadow: "0 0 30px rgba(0,245,255,0.6), 0 0 60px rgba(0,245,255,0.3)",
                      }}
                      animate={{
                        textShadow: [
                          "0 0 20px rgba(0,245,255,0.4), 0 0 40px rgba(0,245,255,0.2)",
                          "0 0 40px rgba(0,245,255,0.8), 0 0 80px rgba(0,245,255,0.4)",
                          "0 0 20px rgba(0,245,255,0.4), 0 0 40px rgba(0,245,255,0.2)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      ⛨
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Title - typewriter */}
            {textVisible && (
              <div className="h-8 mb-3">
                <span
                  className="font-display text-xl tracking-[0.4em] font-bold"
                  style={{
                    color: "#F0F0F0",
                    textShadow: "0 0 20px rgba(0,245,255,0.3)",
                  }}
                >
                  {displayedTitle}
                </span>
                <motion.span
                  className="inline-block w-[2px] h-5 ml-1 align-middle"
                  style={{ background: "#00F5FF" }}
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              </div>
            )}

            {/* Tagline */}
            <AnimatePresence>
              {taglineVisible && (
                <motion.p
                  className="text-sm tracking-[0.15em] mb-10"
                  style={{ color: "rgba(240,240,240,0.5)" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Truth Has a Signature.
                </motion.p>
              )}
            </AnimatePresence>

            {/* Status text */}
            <motion.p
              key={statusIndex}
              className="font-mono text-[11px] tracking-[0.15em]"
              style={{ color: "rgba(0,245,255,0.6)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {STATUS_MESSAGES[statusIndex]}
            </motion.p>

            {/* Progress percentage */}
            <p
              className="font-mono text-[10px] mt-2 tracking-[0.2em]"
              style={{ color: "rgba(240,240,240,0.3)" }}
            >
              {progress}%
            </p>
          </div>

          {/* Skip button */}
          <button
            onClick={skip}
            className="absolute bottom-8 right-8 font-mono text-[11px] tracking-[0.15em] transition-opacity hover:opacity-100"
            style={{ color: "rgba(240,240,240,0.3)" }}
          >
            SKIP →
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default SplashScreen;
