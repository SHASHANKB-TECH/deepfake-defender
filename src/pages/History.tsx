import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ScanLine, Clock, Upload, GitCompare, Zap } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import AtmosphericBackground from "@/components/AtmosphericBackground";
import Navbar from "@/components/Navbar";

interface Analysis {
  id: string;
  file_name: string;
  file_type: string;
  overall_score: number | null;
  risk_level: string | null;
  created_at: string;
  scan_mode: string | null;
  suspected_method: string | null;
}

const History = () => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [mediaFilter, setMediaFilter] = useState("all");
  const [compareMode, setCompareMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    // auth removed
  }, []);
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("analyses").select("id, file_name, file_type, overall_score, risk_level, created_at, scan_mode, suspected_method").order("created_at", { ascending: false });
      setAnalyses((data as Analysis[]) || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = analyses.filter(a => {
    if (searchQuery && !a.file_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (riskFilter !== "all" && a.risk_level !== riskFilter) return false;
    if (mediaFilter === "image" && !a.file_type.startsWith("image")) return false;
    if (mediaFilter === "video" && !a.file_type.startsWith("video")) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(s => s !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const riskBadge = (risk: string | null) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      authentic: { bg: "rgba(0,255,136,0.15)", color: "#00FF88", label: "Authentic" },
      suspicious: { bg: "rgba(251,191,36,0.15)", color: "#FBBF24", label: "Suspicious" },
      inconclusive: { bg: "rgba(167,139,250,0.15)", color: "#A78BFA", label: "Inconclusive" },
    };
    const s = styles[risk || ""] || { bg: "rgba(255,0,60,0.15)", color: "#FF003C", label: "Likely Deepfake" };
    return <Badge className="font-mono text-[10px] tracking-wider border-none" style={{ background: s.bg, color: s.color }}>{s.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050508" }}>
        <div className="h-8 w-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#00F5FF", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-body relative" style={{ background: "#050508" }}>
      <AtmosphericBackground />
      <Navbar showDashboard showAnalyze />

      <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
        <motion.div className="flex items-center justify-between mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="font-display text-2xl font-bold" style={{ color: "#F0F0F0" }}>Analysis History</h1>
          <Button
            variant={compareMode ? "default" : "outline"}
            size="sm"
            className="text-xs font-display tracking-[0.15em] gap-1.5 btn-press border-primary/20 bg-transparent"
            onClick={() => { setCompareMode(!compareMode); setSelected([]); }}
          >
            <GitCompare className="h-3.5 w-3.5" />
            {compareMode ? "Cancel" : "Compare"}
          </Button>
        </motion.div>

        {compareMode && (
          <motion.div className="glass rounded-xl p-4 mb-6 flex items-center justify-between" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm font-mono" style={{ color: "#888899" }}>
              Select 2 analyses. <span style={{ color: "#F0F0F0" }}>{selected.length}/2</span>
            </p>
            {selected.length === 2 && (
              <Button size="sm" className="text-xs font-display tracking-[0.15em] glow-primary btn-press bg-primary text-primary-foreground" onClick={() => navigate(`/results/${selected[0]}`)}>
                Compare
              </Button>
            )}
          </motion.div>
        )}

        <motion.div className="flex flex-col sm:flex-row gap-3 mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#888899" }} />
            <Input placeholder="Search by file name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 bg-muted/50 border-primary/10 focus:border-primary/40" />
          </div>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-full sm:w-44 bg-muted/50 border-primary/10"><SelectValue placeholder="Risk level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Results</SelectItem>
              <SelectItem value="authentic">Authentic</SelectItem>
              <SelectItem value="suspicious">Suspicious</SelectItem>
              <SelectItem value="inconclusive">Inconclusive</SelectItem>
              <SelectItem value="likely_deepfake">Likely Deepfake</SelectItem>
            </SelectContent>
          </Select>
          <Select value={mediaFilter} onValueChange={setMediaFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-muted/50 border-primary/10"><SelectValue placeholder="Media type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Media</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {filtered.length === 0 ? (
          <motion.div className="glass rounded-xl p-12 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ScanLine className="h-10 w-10 mx-auto mb-4" style={{ color: "#888899" }} />
            <p style={{ color: "#888899" }}>{analyses.length === 0 ? "No analyses yet." : "No results match."}</p>
          </motion.div>
        ) : (
          <motion.div className="glass rounded-xl overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent" style={{ borderColor: "rgba(0,245,255,0.05)" }}>
                  {compareMode && <TableHead className="w-10" />}
                  <TableHead className="font-mono text-xs tracking-wider" style={{ color: "#888899" }}>FILE</TableHead>
                  <TableHead className="font-mono text-xs tracking-wider" style={{ color: "#888899" }}>SCORE</TableHead>
                  <TableHead className="font-mono text-xs tracking-wider" style={{ color: "#888899" }}>RESULT</TableHead>
                  <TableHead className="font-mono text-xs tracking-wider hidden md:table-cell" style={{ color: "#888899" }}>METHOD</TableHead>
                  <TableHead className="font-mono text-xs tracking-wider" style={{ color: "#888899" }}>DATE</TableHead>
                  <TableHead className="font-mono text-xs tracking-wider text-right" style={{ color: "#888899" }}>ACTION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(a => (
                  <TableRow
                    key={a.id}
                    className="cursor-pointer transition-colors"
                    style={{ borderColor: "rgba(0,245,255,0.05)", background: compareMode && selected.includes(a.id) ? "rgba(0,245,255,0.05)" : "transparent" }}
                    onClick={() => compareMode ? toggleSelect(a.id) : navigate(`/results/${a.id}`)}
                  >
                    {compareMode && (
                      <TableCell>
                        <div className="h-4 w-4 rounded-sm border-2" style={{ borderColor: selected.includes(a.id) ? "#00F5FF" : "rgba(0,245,255,0.2)", background: selected.includes(a.id) ? "#00F5FF" : "transparent" }} />
                      </TableCell>
                    )}
                    <TableCell>
                      <span className="font-medium max-w-[200px] truncate block" style={{ color: "#F0F0F0" }}>{a.file_name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-display font-bold text-sm" style={{
                        color: (a.overall_score ?? 0) >= 80 ? "#00FF88" : (a.overall_score ?? 0) >= 50 ? "#FBBF24" : "#FF003C"
                      }}>
                        {a.overall_score ?? "—"}%
                      </span>
                    </TableCell>
                    <TableCell>{riskBadge(a.risk_level)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-xs font-mono" style={{ color: "#888899" }}>
                        {a.suspected_method && a.suspected_method !== "None detected" && a.suspected_method !== "Unknown" ? a.suspected_method : "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-xs font-mono" style={{ color: "#888899" }}>
                        <Clock className="h-3 w-3" />
                        {new Date(a.created_at).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm" className="text-xs btn-press border-primary/20 bg-transparent" onClick={e => e.stopPropagation()}>
                        <Link to={`/results/${a.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default History;
