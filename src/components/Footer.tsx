const Footer = () => (
  <footer className="relative py-8 border-t" style={{ borderColor: "rgba(0,245,255,0.1)" }}>
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="font-mono text-xs tracking-[0.15em] text-muted-foreground">
        DEEPFAKE X — Powered by Neural Forensics
      </p>
      <div className="flex items-center gap-4">
        <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-xs font-mono">Docs</a>
        <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-xs font-mono">API</a>
        <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-xs font-mono">GitHub</a>
      </div>
    </div>
  </footer>
);

export default Footer;
