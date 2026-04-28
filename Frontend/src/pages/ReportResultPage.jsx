/**
 * ReportResultPage.jsx
 * Fetches real data from GET /api/report/:pincode and renders the report.
 */
import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  BarChart, Bar, CartesianGrid, Legend,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  BarChart3, Bookmark, Download, GitCompare, Loader2,
  Minus, Plus, RefreshCw, Share2, Sparkles,
} from "lucide-react";
import { Button } from "@/components/button";
import { reportApi } from "@/lib/api";
import { useAuthStore, useReportStore } from "@/stores";
import ParameterCard from "@/components/ParameterCard";
import MapView from "@/components/MapView";
import { toast } from "sonner";

// ── Map backend score keys → display labels ───────────────────────
const PARAM_META = {
  aqi            : { label: "Air Quality (AQI)",   icon: "🌫️" },
  walkability    : { label: "Walkability",          icon: "🚶" },
  floodRisk      : { label: "Flood Risk",           icon: "🌊" },
  safety         : { label: "Safety Score",         icon: "🛡️" },
  noise          : { label: "Noise Level",          icon: "🔇" },
  metroProximity : { label: "Metro Proximity",      icon: "🚇" },
  schoolRating   : { label: "School Rating",        icon: "🏫" },
  hospitalAccess : { label: "Hospital Access",      icon: "🏥" },
  greenCover     : { label: "Green Cover",          icon: "🌳" },
  internetSpeed  : { label: "Internet Speed",       icon: "📶" },
  powerReliability:{ label: "Power Reliability",   icon: "⚡" },
};

const GRADE_COLOR = { A: "#059669", B: "#16a34a", C: "#ca8a04", D: "#dc2626", F: "#7f1d1d" };

function scoreToStatus(v) {
  if (v >= 80) return "excellent";
  if (v >= 65) return "good";
  if (v >= 45) return "moderate";
  return "poor";
}

// Convert backend scores object → ParameterCard-compatible array
function buildParameters(scores) {
  return Object.entries(scores || {}).map(([key, data]) => ({
    key,
    label  : PARAM_META[key]?.label || key,
    icon   : PARAM_META[key]?.icon  || "📊",
    score  : data.value ?? 0,
    unit   : data.unit  || "",
    source : data.source || "",
    status : scoreToStatus(data.value ?? 0),
    error  : data.error || false,
    label2 : data.label || "",
    detail : data.source ? `Source: ${data.source}` : "Computed locally",
  }));
}

export default function ReportResultPage() {
  const [sp] = useSearchParams();
  const pincode = sp.get("pincode") || "";

  const { isLoggedIn }         = useAuthStore();
  const { savedIds, toggleSaved, addCompare } = useReportStore();

  const [report,  setReport]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const reportRef = useRef(null);

  useEffect(() => {
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      setError("Invalid pincode in URL. Please go back and try again.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    reportApi.getReport(pincode)
      .then(({ data }) => setReport(data.report))
      .catch((err) => {
        const msg = err.response?.data?.error || "Failed to load report.";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [pincode]);

  const isSaved = savedIds.includes(pincode);

  const handleSave = async () => {
    if (!isLoggedIn) return toast.error("Sign in to save reports");
    try {
      await reportApi.saveReport(pincode);
      toggleSaved(pincode);
      toast.success("Report saved to your account");
    } catch (err) {
      const msg = err.response?.data?.error || "Could not save report.";
      toast.error(msg);
    }
  };

  const handleUnsave = () => {
    toggleSaved(pincode);
    toast.success("Removed from saved reports");
  };

  const handleCompare = () => {
    addCompare(pincode);
    toast.success(`Added ${pincode} to compare list`);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success("Report link copied to clipboard");
  };

  const downloadPDF = async () => {
    toast.loading("Generating PDF…", { id: "pdf" });
    try {
      const mod = await import("html2pdf.js");
      const html2pdf = mod.default || mod;
      if (reportRef.current) {
        await html2pdf()
          .set({
            margin: 10,
            filename: `HomeTrust-${pincode}-report.pdf`,
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { format: "a4" },
          })
          .from(reportRef.current)
          .save();
      }
      toast.success("PDF downloaded", { id: "pdf" });
    } catch {
      toast.error("PDF generation failed", { id: "pdf" });
    }
  };

  // ── Loading state ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="mb-4 flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-navy" />
          <span className="text-sm font-medium">
            Fetching live data for pincode <strong>{pincode}</strong>…
          </span>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-1/3 rounded-lg bg-muted" />
          <div className="h-64 rounded-2xl bg-muted" />
          <div className="grid gap-3 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────
  if (error || !report) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <Link to="/report/search" className="text-xs font-medium text-muted-foreground hover:text-foreground">
          ← Back to search
        </Link>
        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <div className="text-5xl">🗺️</div>
          <h1 className="font-serif text-2xl font-bold">Report unavailable</h1>
          <p className="max-w-md text-sm text-muted-foreground">
            {error || `No data found for pincode ${pincode}.`}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
            <Link to="/report/search">
              <Button className="bg-navy text-primary-foreground hover:bg-navy/90">
                Try another pincode
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const parameters  = buildParameters(report.scores);
  const compareData = parameters.map((p) => ({
    name : p.label.split(" ")[0],
    area : p.score,
    city : Math.max(0, p.score - 10),
  }));
  const gradeColor = GRADE_COLOR[report.grade] || "#0b1f3a";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      {/* Topbar */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/report/search" className="text-xs font-medium text-muted-foreground hover:text-foreground">
            ← Back to search
          </Link>
          <h1 className="mt-1 font-serif text-3xl font-bold md:text-4xl">
            Pincode {report.pincode}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{report.district}</span>
            {report.district && report.state && <span>·</span>}
            <span>{report.state}</span>
            <span className="ml-2 rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Grade {report.grade}
            </span>
            {report.fromCache && (
              <span className="text-[10px] text-muted-foreground/60 italic">cached</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={isSaved ? handleUnsave : handleSave}
          >
            <Bookmark className={`mr-1.5 h-4 w-4 ${isSaved ? "fill-navy text-navy" : ""}`} />
            {isSaved ? "Saved" : "Save"}
          </Button>
          <Button variant="outline" onClick={handleCompare}>
            <GitCompare className="mr-1.5 h-4 w-4" /> Compare
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-1.5 h-4 w-4" /> Share
          </Button>
          <Button onClick={downloadPDF} className="bg-navy text-primary-foreground hover:bg-navy/90">
            <Download className="mr-1.5 h-4 w-4" /> PDF
          </Button>
        </div>
      </div>

      <div ref={reportRef} className="space-y-6">
        {/* Hero: overall score + summary */}
        <section className="grid gap-4 lg:grid-cols-3">
          {/* Circular score */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-6">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-4">
              Overall Livability
            </div>
            <div className="h-40 w-40">
              <CircularProgressbar
                value={report.overallScore}
                text={`${report.overallScore}`}
                styles={buildStyles({
                  pathColor  : gradeColor,
                  textColor  : "#0b1f3a",
                  trailColor : "#f1f5f9",
                  textSize   : "22px",
                })}
              />
            </div>
            <div className="mt-4 text-center">
              <div className="text-sm font-bold" style={{ color: gradeColor }}>
                Grade {report.grade}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Composite of {parameters.length} independently sourced parameters.
              </p>
            </div>
          </div>

          {/* Summary box */}
          <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Pros */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Strengths
                </div>
                <ul className="space-y-1.5 text-sm">
                  {parameters
                    .filter((p) => p.score >= 65 && !p.error)
                    .slice(0, 4)
                    .map((p) => (
                      <li key={p.key} className="flex items-start gap-2">
                        <Plus className="mt-0.5 h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{p.icon} {p.label}: <strong>{p.score}</strong> ({p.label2})</span>
                      </li>
                    ))}
                </ul>
              </div>
              {/* Cons */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Areas of concern
                </div>
                <ul className="space-y-1.5 text-sm">
                  {parameters
                    .filter((p) => p.score < 45 || p.error)
                    .slice(0, 4)
                    .map((p) => (
                      <li key={p.key} className="flex items-start gap-2">
                        <Minus className="mt-0.5 h-4 w-4 text-destructive shrink-0" />
                        <span>{p.icon} {p.label}: {p.error ? "data unavailable" : `${p.score} (${p.label2})`}</span>
                      </li>
                    ))}
                  {parameters.filter((p) => p.score < 45 || p.error).length === 0 && (
                    <li className="text-xs text-muted-foreground italic">No major concerns found.</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="mt-5 rounded-lg bg-gold/10 p-4 text-sm">
              <div className="flex items-center gap-2 font-semibold text-navy mb-1">
                <Sparkles className="h-4 w-4" /> Institutional summary
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Pincode <strong>{report.pincode}</strong> ({report.district}, {report.state}) has an overall livability
                score of <strong>{report.overallScore}/100</strong> (Grade {report.grade}).{" "}
                {report.overallScore >= 70
                  ? "This is a strong locality with good infrastructure."
                  : report.overallScore >= 50
                  ? "This locality shows moderate livability with room for improvement."
                  : "This locality has several areas requiring attention before long-term commitment."}
              </p>
            </div>
          </div>
        </section>

        {/* 11 parameter cards */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold">
              {parameters.length} parameter breakdown
            </h2>
            <span className="text-xs text-muted-foreground">Tap a card to expand</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {parameters.map((p) => (
              <ParameterCard
                key={p.key}
                p={p}
                onShowOnMap={() => toast.info(`Centered on ${p.label}`)}
              />
            ))}
          </div>
        </section>

        {/* Bar chart */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-navy" />
            <h2 className="font-serif text-lg font-semibold">Score breakdown</h2>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" fontSize={11} stroke="#64748b" />
                <YAxis fontSize={11} stroke="#64748b" domain={[0, 100]} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="area" fill="#0b1f3a" name={`Pincode ${pincode}`} radius={[4, 4, 0, 0]} />
                <Bar dataKey="city" fill="#b08a2c" name="City avg (est)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Map */}
        {report.lat && report.lon && (
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold">Location map</h2>
              <span className="text-xs text-muted-foreground">
                {report.lat.toFixed(4)}, {report.lon.toFixed(4)}
              </span>
            </div>
            <MapView
              center={[report.lat, report.lon]}
              zoom={13}
              showRadius
              className="h-80 w-full overflow-hidden rounded-xl border border-border"
              markers={[
                { position: [report.lat, report.lon], label: `Pincode ${report.pincode}` },
              ]}
            />
          </section>
        )}

        {/* Cache info footer */}
        <div className="text-center text-xs text-muted-foreground pb-2">
          Report cached until {new Date(report.expiresAt).toLocaleString("en-IN")}.
          {" "}<button onClick={() => toast.info("Cache clears automatically after 24 hours.")} className="underline">Learn more</button>
        </div>
      </div>
    </div>
  );
}
