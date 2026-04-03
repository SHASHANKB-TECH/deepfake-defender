import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface NavbarProps {
  showAuth?: boolean;
  showDashboard?: boolean;
  showAnalyze?: boolean;
  onLogout?: () => void;
}

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
          <span
            className="font-display text-lg font-black"
            style={{
              background: "linear-gradient(135deg, hsl(265 90% 65%), hsl(38 100% 55%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            CS
          </span>
          <span className="font-display text-sm font-bold tracking-[0.15em] text-foreground">
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
                  className="relative text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>
          )}

          {showAuth && (
            <>
              <Link to="/auth" className="hidden md:inline text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
                Log In
              </Link>
              <Button asChild size="sm" className="font-display text-xs tracking-[0.1em] btn-press bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg glow-primary">
                <Link to="/auth?mode=signup">Get Started</Link>
              </Button>
            </>
          )}

          {showDashboard && (
            <Button asChild variant="ghost" size="sm" className="text-sm text-muted-foreground">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          )}

          {showAnalyze && (
            <Button asChild size="sm" className="font-display text-xs tracking-[0.1em] btn-press bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg">
              <Link to="/analyze">+ New Scan</Link>
            </Button>
          )}

          {onLogout && (
            <button onClick={onLogout} className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300">
              Logout
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
