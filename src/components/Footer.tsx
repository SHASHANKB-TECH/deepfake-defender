const Footer = () => (
  <footer className="relative py-10 border-t border-primary/[0.08]">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span
          className="font-display text-sm font-black"
          style={{
            background: "linear-gradient(135deg, hsl(265 90% 65%), hsl(38 100% 55%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          CS
        </span>
        <span className="text-xs text-muted-foreground">Crown Shield — AI Forensics</span>
      </div>
      <div className="flex items-center gap-5">
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-xs">Docs</a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-xs">API</a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-xs">GitHub</a>
      </div>
    </div>
  </footer>
);

export default Footer;
