/**
 * CompareLocalitiesPage.jsx
 * POST /api/report/compare — compare up to 3 pincodes side by side.
 */
import { useState } from "react";
import { GitCompare, Loader2, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { reportApi } from "@/lib/api";
import { toast } from "sonner";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const GRADE_COLOR = { A: "#059669", B: "#16a34a", C: "#ca8a04", D: "#dc2626", F: "#7f1d1d" };

const PARAM_LABELS = {
  aqi            : "AQI",
  walkability    : "Walkability",
  floodRisk      : "Flood Risk",
  safety         : "Safety",
  noise          : "Noise",
  metroProximity : "Metro",
  schoolRating   : "Schools",
  hospitalAccess : "Hospitals",
  greenCover     : "Green",
  internetSpeed  : "Internet",
  powerReliability:"Power",
};

const COLORS = ["#0b1f3a", "#b08a2c", "#059669"];

export default function CompareLocalitiesPage() {
  const [pincodes, setPincodes] = useState(["", "", ""]);
  const [reports,  setReports]  = useState([]);
  const [loading,  setLoading]  = useState(false);

  const setPin = (i, val) => {
    const next = [...pincodes];
    next[i] = val.replace(/\D/g, "").slice(0, 6);
    setPincodes(next);
  };

  const removePin = (i) => {
    const next = pincodes.filter((_, idx) => idx !== i);
    next.push("");
    setPincodes(next);
    setReports([]);
  };

  const compare = async () => {
    const valid = pincodes.filter((p) => /^\d{6}$/.test(p));
    if (valid.length < 2) {
      toast.error("Enter at least 2 valid 6-digit pincodes");
      return;
    }
    setLoading(true);
    try {
      const { data } = await reportApi.compare(valid);
      setReports(data.reports);
    } catch (err) {
      toast.error(err.response?.data?.error || "Comparison failed");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => { setPincodes(["", "", ""]); setReports([]); };

  const filled = reports.filter((r) => !r.error);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      {/* Header */}
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Comparison Tool
        </span>
        <h1 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
          Compare localities
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Enter up to 3 Indian pincodes to compare their livability scores side-by-side.
        </p>
      </div>

      {/* Input row */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm mb-6">
        <div className="grid gap-3 sm:grid-cols-3">
          {pincodes.map((p, i) => (
            <div key={i} className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide">
                Pincode {i + 1} {i === 0 && "*"}
              </Label>
              <div className="relative">
                <Input
                  value={p}
                  onChange={(e) => setPin(i, e.target.value)}
                  placeholder="6-digit pincode"
                  inputMode="numeric"
                  maxLength={6}
                  className="pr-8"
                />
                {p && (
                  <button
                    onClick={() => removePin(i)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={compare}
            disabled={loading}
            className="bg-navy text-primary-foreground hover:bg-navy/90"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Comparing…</>
            ) : (
              <><GitCompare className="mr-2 h-4 w-4" /> Compare</>
            )}
          </Button>
          {reports.length > 0 && (
            <Button variant="outline" onClick={clear}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      {filled.length >= 2 && (
        <div className="space-y-6">
          {/* Score gauges */}
          <div className={`grid gap-4 ${filled.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {filled.map((r, i) => (
              <div key={r.pincode} className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                  {r.district}, {r.state}
                </div>
                <div className="text-lg font-bold text-navy mb-4">Pincode {r.pincode}</div>
                <div className="mx-auto h-32 w-32">
                  <CircularProgressbar
                    value={r.overallScore}
                    text={`${r.overallScore}`}
                    styles={buildStyles({
                      pathColor : COLORS[i],
                      textColor : "#0b1f3a",
                      trailColor: "#f1f5f9",
                      textSize  : "22px",
                    })}
                  />
                </div>
                <div className="mt-3 text-sm font-semibold" style={{ color: GRADE_COLOR[r.grade] }}>
                  Grade {r.grade}
                </div>
              </div>
            ))}
          </div>

          {/* Metric table */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="border-b border-border bg-secondary/40 px-5 py-3">
              <h2 className="font-serif text-lg font-semibold">Parameter comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wide text-muted-foreground bg-secondary/30">
                  <tr>
                    <th className="px-5 py-3 text-left">Parameter</th>
                    {filled.map((r) => (
                      <th key={r.pincode} className="px-5 py-3 text-center">
                        {r.pincode}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(PARAM_LABELS).map((key) => {
                    const values = filled.map((r) => r.scores?.[key]?.value ?? null);
                    const max    = Math.max(...values.filter((v) => v !== null));
                    return (
                      <tr key={key} className="border-t border-border hover:bg-secondary/20">
                        <td className="px-5 py-3 font-medium">{PARAM_LABELS[key]}</td>
                        {filled.map((r, i) => {
                          const val = r.scores?.[key]?.value;
                          const isMax = val === max && val !== null;
                          return (
                            <td key={i} className="px-5 py-3 text-center">
                              {val !== null && val !== undefined ? (
                                <span
                                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                    isMax
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-secondary text-muted-foreground"
                                  }`}
                                >
                                  {val}
                                </span>
                              ) : (
                                <span className="text-muted-foreground/50">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Winner */}
          {(() => {
            const winner = [...filled].sort((a, b) => b.overallScore - a.overallScore)[0];
            return (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🏆</div>
                  <div>
                    <div className="text-sm font-semibold text-emerald-800">
                      Best locality: Pincode {winner.pincode}
                    </div>
                    <p className="text-sm text-emerald-700">
                      {winner.district}, {winner.state} — Score {winner.overallScore}/100 (Grade {winner.grade})
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Empty prompt */}
      {reports.length === 0 && !loading && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
          <GitCompare className="h-10 w-10 text-muted-foreground/50" />
          <div className="font-semibold">Enter pincodes above to compare</div>
          <p className="max-w-xs text-sm text-muted-foreground">
            Add 2–3 Indian pincodes and hit Compare to see a side-by-side breakdown.
          </p>
        </div>
      )}
    </div>
  );
}
