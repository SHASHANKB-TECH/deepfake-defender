import { motion } from "framer-motion";

const AtmosphericBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Layer 1: Base - handled by body bg */}

      {/* Layer 2: Gradient mesh */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 40%, rgba(0,245,255,0.04) 0%, transparent 60%),
            radial-gradient(ellipse at 20% 80%, rgba(255,0,60,0.03) 0%, transparent 50%)
          `,
        }}
      />

      {/* Layer 3: Scanlines */}
      <div className="absolute inset-0 scanlines" />

      {/* Layer 4: Floating orbs */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          top: "20%",
          left: "15%",
          background: "rgba(0,245,255,0.06)",
          filter: "blur(120px)",
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 250,
          height: 250,
          top: "60%",
          right: "20%",
          background: "rgba(0,245,255,0.05)",
          filter: "blur(120px)",
        }}
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 20, -30, 0],
          scale: [1.05, 0.95, 1.1, 1.05],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 200,
          height: 200,
          bottom: "30%",
          left: "50%",
          background: "rgba(255,0,60,0.04)",
          filter: "blur(120px)",
        }}
        animate={{
          x: [0, 20, -40, 0],
          y: [0, -20, 10, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Layer 5: Corner brackets */}
      {/* Top-left */}
      <svg className="absolute top-6 left-6 w-16 h-16 opacity-30" viewBox="0 0 64 64">
        <path d="M 0 24 L 0 0 L 24 0" fill="none" stroke="#00F5FF" strokeWidth="1" />
      </svg>
      {/* Bottom-right */}
      <svg className="absolute bottom-6 right-6 w-16 h-16 opacity-30" viewBox="0 0 64 64">
        <path d="M 64 40 L 64 64 L 40 64" fill="none" stroke="#00F5FF" strokeWidth="1" />
      </svg>

      {/* Hexagonal grid (subtle) */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        animate={{ opacity: [0.02, 0.04, 0.02] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hex" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
              <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="rgba(0,245,255,1)" strokeWidth="0.5" />
              <path d="M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34" fill="none" stroke="rgba(0,245,255,1)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex)" />
        </svg>
      </motion.div>
    </div>
  );
};

export default AtmosphericBackground;
