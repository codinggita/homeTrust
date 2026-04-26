import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  Bookmark,
  Download,
  GitCompare,
  Minus,
  Plus,
  Share2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/button";
import { LOCATIONS, findLocation } from "@/data/mockData";
import { useReportStore } from "@/stores";
import ParameterCard from "@/components/ParameterCard";
import NeighborhoodVibeFeed from "@/components/NeighborhoodVibeFeed";
import MapView from "@/components/MapView";
import { toast } from "sonner";

export default function ReportResultPage() {
  const [sp] = useSearchParams();
  const locParam = sp.get("location") || "koramangala-4th-block";
  const [loading, setLoading] = useState(true);
  const { savedIds, toggleSaved, addCompare } = useReportStore();

  const location = useMemo(
    () => findLocation(locParam) ?? LOCATIONS[0],
    [locParam],
  );
  const saved = savedIds.includes(location.id);
  const reportRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [locParam]);

  const compareData = location.parameters.map((p) => ({
    name: p.label.split(" ")[0],
    area: p.score,
    city: Math.max(0, p.score - 12),
  }));

  const downloadPDF = async () => {
    toast.loading("Generating PDF...", { id: "pdf" });
    try {
      const mod = await import("html2pdf.js");
      const html2pdf = mod.default || mod;
      if (reportRef.current) {
        await html2pdf()
          .set({
            margin: 10,
            filename: `HomeTrust-${location.name}-report.pdf`,
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { format: "a4" },
          })
          .from(reportRef.current)
          .save();
      }
      toast.success("PDF downloaded", { id: "pdf" });
    } catch {
      toast.error("PDF generation failed (mock)", { id: "pdf" });
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-1/2 rounded bg-muted" />
          <div className="h-60 rounded-xl bg-muted" />
          <div className="grid gap-3 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            to="/report/search"
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            ← Back to search
          </Link>
          <h1 className="mt-1 font-serif text-3xl font-bold md:text-4xl">
            {location.name}
            <span className="ml-2 text-base font-normal text-muted-foreground">
              {location.city}
            </span>
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-navy px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold">
              {location.tier}
            </span>
            <span className="text-xs text-muted-foreground">
              Report ID HT-{location.id.slice(0, 8).toUpperCase()} · Generated
              just now
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              toggleSaved(location.id);
              toast.success(saved ? "Removed from saved" : "Saved report");
            }}
          >
            <Bookmark
              className={`mr-1.5 h-4 w-4 ${saved ? "fill-navy text-navy" : ""}`}
            />
            {saved ? "Saved" : "Save"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              addCompare(location.id);
              toast.success("Added to compare");
            }}
          >
            <GitCompare className="mr-1.5 h-4 w-4" /> Compare
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.success("Share link copied (mock)")}
          >
            <Share2 className="mr-1.5 h-4 w-4" /> Share
          </Button>
          <Button
            onClick={downloadPDF}
            className="bg-navy text-primary-foreground hover:bg-navy/90"
          >
            <Download className="mr-1.5 h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      <div ref={reportRef}>
        {/* Hero: gauge + summary */}
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-1">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Overall Livability
            </div>
            <div className="mx-auto mt-4 h-40 w-40">
              <CircularProgressbar
                value={location.overallScore}
                text={`${location.overallScore}`}
                styles={buildStyles({
                  pathColor: "#b08a2c",
                  textColor: "#0b1f3a",
                  trailColor: "#eef0f3",
                  textSize: "22px",
                })}
              />
            </div>
            <div className="mt-4 text-center">
              <div className="text-sm font-semibold">Institutional grade</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Composite of 11 independently sourced parameters.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Pros
                </div>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {location.pros.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <Plus className="mt-0.5 h-4 w-4 text-emerald-600" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Cons
                </div>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {location.cons.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <Minus className="mt-0.5 h-4 w-4 text-destructive" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-5 rounded-lg bg-gold/10 p-4 text-sm">
              <div className="flex items-center gap-2 font-semibold text-navy">
                <Sparkles className="h-4 w-4" /> Institutional summary
              </div>
              <p className="mt-1 text-muted-foreground">
                {location.name} scores in the upper decile for safety and
                transit connectivity. Air quality is seasonal; monitor between
                Oct–Feb. Recommended for mid-term lease underwriting with
                routine market re-checks.
              </p>
            </div>
          </div>
        </section>

        {/* 11 parameter cards */}
        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold">
              11 parameter breakdown
            </h2>
            <span className="text-xs text-muted-foreground">
              Tap a card to expand
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {location.parameters.map((p) => (
              <ParameterCard
                key={p.key}
                p={p}
                onShowOnMap={() => toast.info("Centered on map")}
              />
            ))}
          </div>
        </section>

        {/* Neighborhood Vibe Feed */}
        <section className="mt-6">
          <NeighborhoodVibeFeed location={location.name} />
        </section>

        {/* Bar chart comparison */}
        <section className="mt-6 rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-navy" />
            <h2 className="font-serif text-lg font-semibold">
              This area vs city average
            </h2>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" fontSize={11} stroke="#64748b" />
                <YAxis fontSize={11} stroke="#64748b" />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  dataKey="area"
                  fill="#0b1f3a"
                  name={location.name}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="city"
                  fill="#b08a2c"
                  name="City avg"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Amenities map */}
        <section className="mt-6 rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold">
              Amenities within 1 km
            </h2>
            <span className="text-xs text-muted-foreground">
              Mock points of interest
            </span>
          </div>
          <MapView
            center={[location.lat, location.lon]}
            zoom={15}
            showRadius
            className="h-80 w-full overflow-hidden rounded-xl border border-border"
            markers={[
              {
                position: [location.lat + 0.004, location.lon + 0.004],
                label: "Central metro station",
              },
              {
                position: [location.lat - 0.003, location.lon + 0.002],
                label: "Community hospital",
              },
              {
                position: [location.lat + 0.002, location.lon - 0.005],
                label: "Public school",
              },
              {
                position: [location.lat - 0.005, location.lon - 0.003],
                label: "Parkside grocery",
              },
            ]}
          />
        </section>
      </div>
    </div>
  );
}
