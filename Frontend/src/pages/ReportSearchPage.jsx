import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BookmarkCheck,
  Flame,
  Heart,
  LayoutGrid,
  Search,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/button";
import MapView from "@/components/MapView";
import { LOCATIONS } from "@/data/mockData";
import { useAuthStore, useReportStore } from "@/stores";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ReportSearchPage() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const [q, setQ] = useState(sp.get("q") || "Koramangala");
  const { isLoggedIn } = useAuthStore();
  const { savedIds, toggleSaved } = useReportStore();

  const suggestions = useMemo(() => {
    if (!q) return [];
    return LOCATIONS.filter(
      (l) =>
        l.name.toLowerCase().includes(q.toLowerCase()) ||
        l.city.toLowerCase().includes(q.toLowerCase()),
    ).slice(0, 5);
  }, [q]);

  const selected = suggestions[0] ?? LOCATIONS[0];

  const onGenerate = () => {
    navigate(`/report/result?location=${selected.id}`);
  };

  const onFavorite = (id) => {
    if (!isLoggedIn) return toast.error("Sign in to save favorites");
    toggleSaved(id);
    toast.success(
      savedIds.includes(id) ? "Removed from favorites" : "Added to favorites",
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Neighborhood Intelligence
        </span>
        <h1 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
          Generate a free neighborhood report
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Search any neighborhood to see an institutional-grade livability
          assessment across 11 parameters — completely free, unlimited reports.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main search & map */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="e.g. Koramangala, Indiranagar, Powai, Connaught Place..."
                className="h-14 w-full rounded-xl border border-border bg-background pl-12 pr-4 text-base outline-none focus:border-ring"
              />

              {q && suggestions.length > 0 && (
                <ul className="absolute inset-x-0 top-16 z-10 max-h-72 overflow-y-auto rounded-xl border border-border bg-popover p-2 shadow-lg">
                  {suggestions.map((s) => (
                    <li key={s.id}>
                      <button
                        onClick={() => {
                          setQ(s.name);
                          navigate(`/report/result?location=${s.id}`);
                        }}
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-secondary"
                      >
                        <span>
                          <span className="font-medium">{s.name}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {s.city}
                          </span>
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-navy">
                          {s.tier}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-muted-foreground">
                Popular:{" "}
                {["Koramangala", "Indiranagar", "Powai", "Chelsea"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setQ(c)}
                    className="mr-1 rounded-full border border-border px-2.5 py-1 text-[11px] font-medium hover:border-navy hover:text-navy"
                  >
                    {c}
                  </button>
                ))}
              </div>
              <Button
                onClick={onGenerate}
                className="bg-navy text-primary-foreground hover:bg-navy/90"
              >
                Generate Free Report <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Map preview */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Market heat view
                </div>
                <div className="font-serif text-lg font-semibold">
                  {selected.name.toUpperCase()} · {selected.city}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Flame className="h-4 w-4 text-destructive" />
                <span className="font-semibold text-destructive">
                  HIGH DEMAND
                </span>
              </div>
            </div>
            <MapView
              center={[selected.lat, selected.lon]}
              zoom={13}
              className="h-[360px] w-full"
              markers={suggestions.slice(1, 4).map((s) => ({
                position: [s.lat, s.lon],
                label: s.name,
              }))}
              showRadius
            />

            <div className="grid grid-cols-2 gap-3 border-t border-border p-4 sm:grid-cols-4">
              {[
                { label: "Avg. rent", val: "₹68k /mo" },
                { label: "YoY change", val: "+6.2%" },
                { label: "Trust listings", val: "142" },
                { label: "Liveability", val: `${selected.overallScore}/100` },
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

          {/* Suggestions list */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold">
                Explore curated neighborhoods
              </h3>
              <Link
                to="/report/saved"
                className="text-sm font-medium text-navy hover:text-navy/80"
              >
                View my saved reports →
              </Link>
            </div>
            <ul className="divide-y divide-border">
              {LOCATIONS.slice(0, 6).map((l) => (
                <li
                  key={l.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{l.name}</span>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {l.tier}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {l.city} · Livability {l.overallScore}/100
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onFavorite(l.id)}
                      aria-label="Favorite"
                      className={cn(
                        "rounded-md border border-border p-2 hover:bg-secondary",
                        savedIds.includes(l.id) &&
                          "border-destructive/30 bg-destructive/5",
                      )}
                    >
                      <Heart
                        className={cn(
                          "h-4 w-4",
                          savedIds.includes(l.id)
                            ? "fill-destructive text-destructive"
                            : "text-muted-foreground",
                        )}
                      />
                    </button>
                    <Link to={`/report/result?location=${l.id}`}>
                      <Button variant="outline" size="sm">
                        View report
                      </Button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {[
            {
              title: "Market Heat",
              icon: Flame,
              desc: "See demand spikes, YoY price movement and broker activity in any pocket.",
            },
            {
              title: "Institutional Trust",
              icon: ShieldCheck,
              desc: "Every report cross-checks 11 independent data sources with AI anomaly scoring.",
            },
            {
              title: "Deep Analytics",
              icon: TrendingUp,
              desc: "Compare localities side-by-side, track over time, export JSON / PDF.",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="mb-3 inline-flex rounded-md bg-navy/10 p-2">
                <s.icon className="h-5 w-5 text-navy" />
              </div>
              <h4 className="font-serif text-lg font-semibold">{s.title}</h4>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}

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
                  Free & unlimited — no cap on saves.
                </p>
              </div>
              <LayoutGrid className="h-5 w-5 text-navy transition group-hover:translate-x-1" />
            </div>
          </Link>
        </aside>
      </div>
    </div>
  );
}
