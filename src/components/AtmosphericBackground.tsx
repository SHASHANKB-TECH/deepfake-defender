import { motion } from "framer-motion";

const AtmosphericBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Gradient mesh */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, hsl(265 90% 65% / 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, hsl(38 100% 55% / 0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, hsl(265 60% 40% / 0.03) 0%, transparent 70%)
          `,
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          top: "15%",
          left: "10%",
          background: "hsl(265 90% 65% / 0.05)",
          filter: "blur(140px)",
        }}
        animate={{
          x: [0, 50, -20, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 350,
          height: 350,
          top: "55%",
          right: "15%",
          background: "hsl(38 100% 55% / 0.04)",
          filter: "blur(140px)",
        }}
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 30, -40, 0],
          scale: [1.05, 0.9, 1.1, 1.05],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 250,
          height: 250,
          bottom: "20%",
          left: "45%",
          background: "hsl(265 60% 50% / 0.03)",
          filter: "blur(120px)",
        }}
        animate={{
          x: [0, 30, -50, 0],
          y: [0, -25, 15, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(265 90% 65%) 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Noise grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default AtmosphericBackground;
