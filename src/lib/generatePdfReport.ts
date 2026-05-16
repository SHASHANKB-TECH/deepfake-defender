import { jsPDF } from "jspdf";

const MODULE_META: { key: string; label: string }[] = [
  { key: "facial_inconsistency", label: "Facial Inconsistency" },
  { key: "metadata_compression", label: "Metadata & Compression" },
  { key: "gan_fingerprint", label: "GAN Fingerprint" },
  { key: "semantic_consistency", label: "Semantic Consistency" },
  { key: "eye_reflection", label: "Eye Reflection" },
  { key: "temporal_consistency", label: "Temporal Consistency" },
  { key: "biological_signals", label: "Biological Signals" },
  { key: "boundary_blending", label: "Boundary & Blending" },
];

const riskColor = (risk: string): [number, number, number] => {
  if (risk === "authentic") return [0, 200, 120];
  if (risk === "suspicious") return [240, 170, 30];
  if (risk === "inconclusive") return [140, 110, 220];
  return [220, 40, 70];
};

const riskLabel = (risk: string) => {
  if (risk === "authentic") return "Authentic";
  if (risk === "suspicious") return "Suspicious";
  if (risk === "inconclusive") return "Inconclusive";
  return "Likely Deepfake";
};

export function generatePdfReport(analysis: any) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  let y = margin;

  const report = analysis.detailed_report || {};
  const modules = report.modules || {};
  const reasons: string[] = analysis.confidence_reasons || report.confidence_reasons || [];
  const score = analysis.overall_score ?? 0;
  const risk = analysis.risk_level || "inconclusive";
  const [r, g, b] = riskColor(risk);

  const ensureSpace = (need: number) => {
    if (y + need > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Header band
  doc.setFillColor(15, 15, 30);
  doc.rect(0, 0, pageW, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("CROWN SHIELD", margin, 40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 220);
  doc.text("Forensic Deepfake Analysis Report", margin, 58);
  doc.setFontSize(9);
  doc.text(new Date(analysis.created_at || Date.now()).toLocaleString(), margin, 74);
  y = 120;

  // File info
  doc.setTextColor(40, 40, 50);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("File:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(String(analysis.file_name || "—"), margin + 40, y);
  y += 16;
  doc.setFont("helvetica", "bold");
  doc.text("Type:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(String(analysis.file_type || "—"), margin + 40, y);
  y += 24;

  // Score box
  ensureSpace(120);
  doc.setFillColor(245, 246, 250);
  doc.roundedRect(margin, y, pageW - margin * 2, 110, 8, 8, "F");
  doc.setTextColor(r, g, b);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(48);
  doc.text(`${score}%`, margin + 24, y + 70);
  doc.setFontSize(14);
  doc.text(riskLabel(risk), margin + 24, y + 96);
  doc.setTextColor(90, 90, 110);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Authenticity Confidence", pageW - margin - 24, y + 30, { align: "right" });
  if (analysis.suspected_method && analysis.suspected_method !== "None detected") {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 50);
    doc.text("Suspected Method:", pageW - margin - 24, y + 60, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.text(String(analysis.suspected_method), pageW - margin - 24, y + 78, { align: "right" });
  }
  y += 130;

  // Reasons
  if (reasons.length) {
    ensureSpace(40);
    doc.setTextColor(40, 40, 50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Confidence Reasoning", margin, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 80);
    reasons.forEach((reason, i) => {
      const lines = doc.splitTextToSize(`${i + 1}. ${reason}`, pageW - margin * 2);
      ensureSpace(lines.length * 14 + 4);
      doc.text(lines, margin, y);
      y += lines.length * 14 + 4;
    });
    y += 10;
  }

  // Modules
  ensureSpace(40);
  doc.setTextColor(40, 40, 50);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Module Breakdown", margin, y);
  y += 18;

  MODULE_META.forEach((mod) => {
    const m = modules[mod.key] || {};
    const ms = m.score ?? "—";
    const pass = m.pass;
    const detail = m.detail || "";
    const anomalies: any[] = m.anomalies || [];
    const detailLines = doc.splitTextToSize(detail, pageW - margin * 2 - 16);
    const anomalyHeight = anomalies.reduce((acc, a) => {
      const ls = doc.splitTextToSize(`• [${(a.severity || "low").toUpperCase()}] ${a.finding || ""}`, pageW - margin * 2 - 24);
      return acc + ls.length * 12 + 4;
    }, 0);
    const blockH = 34 + detailLines.length * 12 + anomalyHeight + 8;
    ensureSpace(blockH);

    doc.setDrawColor(220, 220, 230);
    doc.setFillColor(252, 252, 254);
    doc.roundedRect(margin, y, pageW - margin * 2, blockH, 6, 6, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 45);
    doc.text(mod.label, margin + 12, y + 18);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    const scoreText = `${ms}/100  ${pass ? "PASS" : "FAIL"}`;
    const sc: [number, number, number] = pass ? [0, 160, 90] : [200, 50, 70];
    doc.setTextColor(...sc);
    doc.text(scoreText, pageW - margin - 12, y + 18, { align: "right" });

    if (detail) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(70, 70, 90);
      doc.text(detailLines, margin + 12, y + 32);
    }

    let ay = y + 32 + detailLines.length * 12 + 4;
    anomalies.forEach((a) => {
      const sev = (a.severity || "low").toLowerCase();
      const col: [number, number, number] = sev === "high" ? [200, 50, 70] : sev === "medium" ? [200, 140, 20] : [110, 110, 130];
      doc.setTextColor(...col);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const ls = doc.splitTextToSize(`• [${sev.toUpperCase()}] ${a.finding || ""}`, pageW - margin * 2 - 24);
      doc.text(ls, margin + 18, ay);
      ay += ls.length * 12 + 4;
    });

    y += blockH + 8;
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 160);
    doc.text(`Crown Shield • Forensic Report • Page ${i} of ${pageCount}`, pageW / 2, pageH - 20, { align: "center" });
  }

  const safeName = String(analysis.file_name || "report").replace(/[^a-z0-9._-]/gi, "_");
  doc.save(`crown-shield-${safeName}-${analysis.id || Date.now()}.pdf`);
}
