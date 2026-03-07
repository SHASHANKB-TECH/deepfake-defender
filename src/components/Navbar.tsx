import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface NavbarProps {
  showAuth?: boolean;
  showDashboard?: boolean;
  showAnalyze?: boolean;
  onLogout?: () => void;
}

const ShieldLogo = () => (
  <div className="relative">
    <span className="font-display text-lg font-black" style={{ color: "#00F5FF", textShadow: "0 0 15px rgba(0,245,255,0.5)" }}>
      ⛨
    </span>
  </div>
);

const Navbar = ({ showAuth, showDashboard, showAnalyze, onLogout }: NavbarProps) => {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <ShieldLogo />
          <span className="font-display text-sm font-bold tracking-[0.2em]" style={{ color: "#F0F0F0" }}>
            CROWN SHIELD
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {isLanding && (
            <div className="hidden md:flex items-center gap-6">
              {["Features", "How It Works", "Testimonials"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                  className="relative text-sm font-mono tracking-wider text-muted-foreground hover:text-foreground transition-colors group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>
          )}

          {showAuth && (
            <>
              <Link to="/auth" className="hidden md:inline text-sm font-mono tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                Log In
              </Link>
              <Button asChild size="sm" variant="outline" className="font-display text-xs tracking-[0.15em] btn-press border-primary/30 bg-transparent hover:bg-primary/10 hover:border-primary/60 transition-all">
                <Link to="/auth?mode=signup">Run Analysis</Link>
              </Button>
            </>
          )}

          {showDashboard && (
            <Button asChild variant="ghost" size="sm" className="font-mono text-xs tracking-wider text-muted-foreground">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          )}

          {showAnalyze && (
            <Button asChild size="sm" variant="outline" className="font-display text-xs tracking-[0.15em] btn-press border-primary/30 bg-transparent hover:bg-primary/10">
              <Link to="/analyze">Analyze</Link>
            </Button>
          )}

          {onLogout && (
            <button onClick={onLogout} className="text-xs font-mono tracking-wider text-muted-foreground hover:text-foreground transition-colors">
              Logout
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
