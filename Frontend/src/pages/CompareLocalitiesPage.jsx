import { useState, useRef } from "react";
import { Award, Download, FileText, Plus, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/button";
import { LOCATIONS } from "@/data/mockData";
import { useReportStore } from "@/stores";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import html2pdf from "html2pdf.js";

const ROW_KEYS = [
  { key: "aqi", label: "Air Quality", unit: "AQI" },
  { key: "walkability", label: "Walkability", unit: "/100" },
  { key: "flood", label: "Flood Risk", unit: "/100" },
  { key: "crime", label: "Safety Score", unit: "/100" },
  { key: "noise", label: "Noise Pollution", unit: "dB" },
  { key: "metro", label: "Metro Proximity", unit: "km" },
  { key: "schools", label: "School Rating", unit: "/10" },
  { key: "green", label: "Green Cover", unit: "%" },
  { key: "internet", label: "Internet Velocity", unit: "Mbps" },
];

function tierBadge(score) {
  if (score >= 85) return { label: "GOLD", cls: "bg-amber-400 text-amber-950" };
  if (score >= 70) return { label: "SILVER", cls: "bg-zinc-200 text-zinc-800" };
  return { label: "BRONZE", cls: "bg-amber-700 text-amber-50" };
}

export default function CompareLocalitiesPage() {
  const { compare, addCompare, removeCompare } = useReportStore();
  const [showPicker, setShowPicker] = useState(false);
  const reportRef = useRef(null);

  const chosen = compare
    .map((id) => LOCATIONS.find((l) => l.id === id))
    .filter(Boolean)
    .slice(0, 3);

  const pool = LOCATIONS.filter((l) => !compare.includes(l.id));

  const downloadFullPDF = () => {
    if (!chosen.length) {
      toast.error("Please select at least one locality to compare");
      return;
    }

    const element = reportRef.current;
    const opt = {
      margin: 10,
      filename: `HomeTrust_Comparison_${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    toast.promise(html2pdf().set(opt).from(element).save(), {
      loading: "Generating Premium PDF Report...",
      success: "Report downloaded successfully!",
      error: "Failed to generate report",
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Side-by-side analysis
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold md:text-4xl">
            Compare Localities
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Stack up to three neighborhoods across nine normalized parameters.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => toast.success("Metadata JSON copied (mock)")}
          >
            <FileText className="mr-1.5 h-4 w-4" /> View All Metadata
          </Button>
          <Button
            onClick={downloadFullPDF}
            className="bg-navy text-primary-foreground hover:bg-navy/90"
          >
            <Download className="mr-1.5 h-4 w-4" /> Download Full PDF
          </Button>
        </div>
      </div>

      <div ref={reportRef} className="p-1">
        {/* Locality headers */}
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((idx) => {
            const loc = chosen[idx];
            if (!loc) {
              return (
                <button
                  key={idx}
                  onClick={() => setShowPicker(true)}
                  data-html2canvas-ignore
                  className="flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-secondary/40 p-6 text-sm text-muted-foreground transition hover:border-navy hover:bg-secondary"
                >
                  <Plus className="h-6 w-6" />
                  <span className="font-semibold">SELECT LOCALITY</span>
                  <span className="text-xs">Add up to 3 neighborhoods</span>
                </button>
              );
            }
            const badge = tierBadge(loc.overallScore);
            return (
              <div
                key={loc.id}
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-5"
              >
                <button
                  onClick={() => removeCompare(loc.id)}
                  data-html2canvas-ignore
                  className="absolute right-3 top-3 rounded-full bg-background p-1 text-muted-foreground ring-1 ring-border hover:text-foreground"
                  aria-label="Remove"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold",
                      badge.cls,
                    )}
                  >
                    {badge.label}
                  </span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                    {loc.tier}
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-xl font-bold">{loc.name}</h3>
                <p className="text-xs text-muted-foreground">{loc.city}</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-mono text-4xl font-bold text-navy">
                    {loc.overallScore}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    / 100 overall
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Audited 2h
                  ago
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Parameter</th>
                {[0, 1, 2].map((idx) => (
                  <th key={idx} className="px-4 py-3 text-left">
                    {chosen[idx]?.name ?? `Slot ${idx + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ROW_KEYS.map((row) => (
                <tr key={row.key} className="hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="font-medium">{row.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {row.unit}
                    </div>
                  </td>
                  {[0, 1, 2].map((idx) => {
                    const loc = chosen[idx];
                    const param = loc?.parameters.find((p) => p.key === row.key);
                    return (
                      <td key={idx} className="px-4 py-3">
                        {param ? (
                          <div className="flex items-center gap-3">
                            <div className="font-mono text-lg font-semibold">
                              {param.score}
                            </div>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  param.score >= 80
                                    ? "bg-emerald-500"
                                    : param.score >= 60
                                      ? "bg-amber-500"
                                      : "bg-destructive",
                                )}
                                style={{ width: `${param.score}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Institutional summary */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-navy">
            <Award className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Institutional Summary
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Across the selected localities, safety and metro proximity remain the
            strongest differentiators for rental yield. Green cover is a secondary
            driver but has an outsized impact on tenant retention. We recommend
            pairing high-trust (85+) areas with mid-tier entry prices for balanced
            portfolios.
          </p>
        </div>
      </div>

      {/* Picker modal */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold">
                Add a locality
              </h3>
              <button onClick={() => setShowPicker(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="mt-3 max-h-80 space-y-1 overflow-y-auto">
              {pool.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => {
                      addCompare(p.id);
                      setShowPicker(false);
                      toast.success(`${p.name} added to compare`);
                    }}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-secondary"
                  >
                    <span>
                      <span className="font-medium">{p.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {p.city}
                      </span>
                    </span>
                    <span className="text-xs font-semibold text-navy">
                      {p.overallScore}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
