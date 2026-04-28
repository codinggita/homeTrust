/**
 * ReportSearchPage.jsx
 * Neighborhood search — submits a 6-digit pincode to GET /api/report/:pincode
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight, BookmarkCheck, Flame, LayoutGrid,
  Search, ShieldCheck, TrendingUp, MapPin,
} from "lucide-react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import MapView from "@/components/MapView";
import { useAuthStore } from "@/stores";
import { toast } from "sonner";

const POPULAR_PINCODES = [
  { label: "Koramangala, Bengaluru",   pincode: "560034" },
  { label: "Powai, Mumbai",            pincode: "400076" },
  { label: "Connaught Place, Delhi",   pincode: "110001" },
  { label: "Banjara Hills, Hyderabad", pincode: "500034" },
  { label: "Anna Nagar, Chennai",      pincode: "600040" },
];

export default function ReportSearchPage() {
  const navigate          = useNavigate();
  const { isLoggedIn }    = useAuthStore();
  const [pincode, setPincode] = useState("");
  const [error, setError]     = useState("");

  const validate = (val) => /^\d{6}$/.test(val);

  const onGenerate = (e) => {
    e?.preventDefault();
    const p = pincode.trim();
    if (!validate(p)) {
      setError("Please enter a valid 6-digit Indian pincode.");
      return;
    }
    setError("");
    navigate(`/report/result?pincode=${p}`);
  };

  const pickPopular = (p) => {
    setPincode(p);
    setError("");
    navigate(`/report/result?pincode=${p}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Neighborhood Intelligence
        </span>
        <h1 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
          Generate a free neighborhood report
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Enter any 6-digit Indian pincode to get an institutional-grade
          livability assessment across 11 parameters — AQI, walkability, flood
          risk, safety, metro proximity and more.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main search column */}
        <div className="space-y-5 lg:col-span-2">

          {/* Search card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <form onSubmit={onGenerate} className="space-y-4">
              <div>
                <Label htmlFor="pincode" className="text-sm font-semibold">
                  Enter Indian Pincode
                </Label>
                <div className="relative mt-2">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="pincode"
                    value={pincode}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setPincode(v);
                      if (error) setError("");
                    }}
                    placeholder="e.g. 560034, 400076, 110001…"
                    className="h-14 pl-12 text-base"
                    maxLength={6}
                    inputMode="numeric"
                  />
                </div>
                {error && (
                  <p className="mt-1.5 text-xs text-destructive">{error}</p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs text-muted-foreground self-center">Popular:</span>
                  {POPULAR_PINCODES.map((p) => (
                    <button
                      key={p.pincode}
                      type="button"
                      onClick={() => pickPopular(p.pincode)}
                      className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium hover:border-navy hover:text-navy transition-colors"
                    >
                      {p.pincode} · {p.label.split(",")[0]}
                    </button>
                  ))}
                </div>
                <Button
                  type="submit"
                  className="bg-navy text-primary-foreground hover:bg-navy/90 shrink-0"
                >
                  Generate Report <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Map preview */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-5 py-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Coverage Map
                </div>
                <div className="font-serif text-lg font-semibold">
                  Pan India · All 30,000+ pincodes
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Flame className="h-4 w-4 text-destructive" />
                <span className="font-semibold text-destructive">LIVE DATA</span>
              </div>
            </div>
            <MapView
              center={[20.5937, 78.9629]}
              zoom={5}
              className="h-[340px] w-full"
              markers={POPULAR_PINCODES.map(() => ({
                position: [
                  20 + Math.random() * 10,
                  75 + Math.random() * 10,
                ],
                label: "HomeTrust coverage",
              }))}
            />
            <div className="grid grid-cols-3 gap-3 border-t border-border p-4">
              {[
                { label: "Pincodes covered", val: "30,000+" },
                { label: "Reports generated", val: "2.4M+" },
                { label: "Data sources", val: "11 live APIs" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg bg-secondary/40 p-3">
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {s.label}
                  </div>
                  <div className="mt-1 text-sm font-semibold">{s.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular pincodes list */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold">
                Explore popular localities
              </h3>
              {isLoggedIn && (
                <Link
                  to="/report/saved"
                  className="text-sm font-medium text-navy hover:text-navy/80"
                >
                  My saved reports →
                </Link>
              )}
            </div>
            <ul className="divide-y divide-border">
              {POPULAR_PINCODES.map((loc) => (
                <li
                  key={loc.pincode}
                  className="flex items-center justify-between py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy/10">
                      <MapPin className="h-4 w-4 text-navy" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{loc.label}</div>
                      <div className="text-xs text-muted-foreground">
                        Pincode: {loc.pincode}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => pickPopular(loc.pincode)}
                    className="shrink-0"
                  >
                    View Report
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {[
            {
              title: "11 Live Parameters",
              icon: Flame,
              desc: "AQI, walkability, flood risk, crime index, noise, metro, schools, hospitals, green cover, internet speed, and power reliability.",
            },
            {
              title: "Institutional Trust",
              icon: ShieldCheck,
              desc: "Every report cross-checks 11 independent data sources including OpenWeatherMap, OpenStreetMap, and NCRB crime records.",
            },
            {
              title: "Compare & Save",
              icon: TrendingUp,
              desc: "Compare up to 3 localities side-by-side. Save reports to your account for future reference.",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="mb-3 inline-flex rounded-md bg-navy/10 p-2">
                <s.icon className="h-5 w-5 text-navy" />
              </div>
              <h4 className="font-serif text-base font-semibold">{s.title}</h4>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}

          {isLoggedIn ? (
            <Link to="/report/saved">
              <div className="group flex items-center justify-between rounded-2xl border border-border bg-gold/10 p-5 transition hover:bg-gold/20">
                <div>
                  <div className="flex items-center gap-2 text-navy">
                    <BookmarkCheck className="h-5 w-5" />
                    <span className="text-sm font-semibold uppercase tracking-wide">
                      My Saved Reports
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Access your pinned neighborhood analyses.
                  </p>
                </div>
                <LayoutGrid className="h-5 w-5 text-navy transition group-hover:translate-x-1" />
              </div>
            </Link>
          ) : (
            <div className="rounded-2xl border border-border bg-secondary/40 p-5">
              <div className="text-sm font-semibold">Save reports</div>
              <p className="mt-1 text-xs text-muted-foreground">
                <Link to="/signup" className="text-navy underline">Create a free account</Link>{" "}
                to bookmark neighborhoods and compare over time.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
