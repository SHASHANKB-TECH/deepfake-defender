import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Search, ScanLine, Clock, ArrowLeft, Upload, GitCompare, Zap } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate("/auth");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("analyses")
        .select("id, file_name, file_type, overall_score, risk_level, created_at, scan_mode, suspected_method")
        .order("created_at", { ascending: false });
      setAnalyses((data as Analysis[]) || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = analyses.filter((a) => {
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
    if (risk === "authentic") return <Badge className="font-display text-[10px] tracking-wider bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Authentic</Badge>;
    if (risk === "suspicious") return <Badge variant="secondary" className="font-display text-[10px] tracking-wider">Suspicious</Badge>;
    if (risk === "inconclusive") return <Badge className="font-display text-[10px] tracking-wider bg-violet-500/20 text-violet-400 border-violet-500/30">Inconclusive</Badge>;
    return <Badge variant="destructive" className="font-display text-[10px] tracking-wider">Likely Deepfake</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body">
      <nav className="sticky top-0 z-50 glass-strong">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-display text-sm font-bold tracking-wider">DEEPFAKE-X</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="font-display text-xs tracking-wider glow-primary">
              <Link to="/analyze"><Upload className="h-3.5 w-3.5 mr-1.5" /> Analyze</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-xs">
              <Link to="/dashboard"><ArrowLeft className="h-3.5 w-3.5 mr-1" /> Dashboard</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <motion.div className="flex items-center justify-between mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="font-display text-2xl font-bold">Analysis History</h1>
          <Button
            variant={compareMode ? "default" : "outline"}
            size="sm"
            className="text-xs font-display tracking-wider gap-1.5"
            onClick={() => { setCompareMode(!compareMode); setSelected([]); }}
          >
            <GitCompare className="h-3.5 w-3.5" />
            {compareMode ? "Cancel Compare" : "Compare"}
          </Button>
        </motion.div>

        {compareMode && (
          <motion.div className="glass rounded-xl p-4 mb-6 flex items-center justify-between" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm text-muted-foreground">
              Select 2 analyses to compare. <span className="text-foreground font-medium">{selected.length}/2 selected</span>
            </p>
            {selected.length === 2 && (
              <Button size="sm" className="text-xs font-display tracking-wider glow-primary" onClick={() => navigate(`/results/${selected[0]}`)}>
                View Comparison
              </Button>
            )}
          </motion.div>
        )}

        {/* Filters */}
        <motion.div className="flex flex-col sm:flex-row gap-3 mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by file name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-background/50" />
          </div>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-full sm:w-44 bg-background/50"><SelectValue placeholder="Risk level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Results</SelectItem>
              <SelectItem value="authentic">Authentic</SelectItem>
              <SelectItem value="suspicious">Suspicious</SelectItem>
              <SelectItem value="inconclusive">Inconclusive</SelectItem>
              <SelectItem value="likely_deepfake">Likely Deepfake</SelectItem>
            </SelectContent>
          </Select>
          <Select value={mediaFilter} onValueChange={setMediaFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-background/50"><SelectValue placeholder="Media type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Media</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Table */}
        {filtered.length === 0 ? (
          <motion.div className="glass rounded-xl p-12 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ScanLine className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{analyses.length === 0 ? "No analyses yet." : "No results match your filters."}</p>
          </motion.div>
        ) : (
          <motion.div className="glass rounded-xl overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {compareMode && <TableHead className="w-10" />}
                  <TableHead className="font-display text-xs tracking-wider">FILE</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">TYPE</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">SCORE</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">RESULT</TableHead>
                  <TableHead className="font-display text-xs tracking-wider hidden md:table-cell">METHOD</TableHead>
                  <TableHead className="font-display text-xs tracking-wider hidden md:table-cell">MODE</TableHead>
                  <TableHead className="font-display text-xs tracking-wider">DATE</TableHead>
                  <TableHead className="font-display text-xs tracking-wider text-right">ACTION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow
                    key={a.id}
                    className={`cursor-pointer ${compareMode && selected.includes(a.id) ? "bg-primary/5" : ""}`}
                    onClick={() => compareMode ? toggleSelect(a.id) : navigate(`/results/${a.id}`)}
                  >
                    {compareMode && (
                      <TableCell>
                        <div className={`h-4 w-4 rounded-sm border-2 ${selected.includes(a.id) ? "bg-primary border-primary" : "border-border"}`} />
                      </TableCell>
                    )}
                    <TableCell className="font-medium max-w-[200px] truncate">{a.file_name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{a.file_type.split("/")[1]?.toUpperCase()}</TableCell>
                    <TableCell>
                      <span className={`font-display font-bold text-sm ${
                        (a.overall_score ?? 0) >= 80 ? "text-emerald-400" : (a.overall_score ?? 0) >= 50 ? "text-amber-400" : "text-red-400"
                      }`}>
                        {a.overall_score ?? "—"}%
                      </span>
                    </TableCell>
                    <TableCell>{riskBadge(a.risk_level)}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                      {a.suspected_method && a.suspected_method !== "None detected" && a.suspected_method !== "Unknown" ? a.suspected_method : "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {a.scan_mode === "deep" ? (
                        <Badge variant="secondary" className="text-[9px] gap-1"><Zap className="h-2.5 w-2.5" /> Deep</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Standard</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(a.created_at).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm" className="text-xs" onClick={(e) => e.stopPropagation()}>
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
