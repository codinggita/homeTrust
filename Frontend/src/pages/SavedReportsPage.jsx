import { Link } from "react-router-dom";
import {
  Award,
  CheckCircle2,
  Infinity as InfinityIcon,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import { SAVED_REPORTS } from "@/data/mockData";

const TIER_STYLE = {
  "LUXURY TIER": "bg-amber-50 text-amber-900 ring-amber-200",
  "RENTAL HOTSPOT": "bg-rose-50 text-rose-800 ring-rose-200",
  "ELITE ADVISOR PICK": "bg-slate-900 text-slate-100 ring-slate-900",
};

export default function SavedReportsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <InfinityIcon className="h-3.5 w-3.5" /> Free & Unlimited
        </div>
        <h1 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
          My Saved Reports
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Every report is saved free of charge. Revisit, re-run, or export at
          any time.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {SAVED_REPORTS.map((r) => (
            <Card key={r.id} className="overflow-hidden border-border">
              <div className="h-28 bg-gradient-to-br from-navy via-navy/90 to-slate-700 p-4 text-primary-foreground">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${
                      TIER_STYLE[r.badge] ??
                      "bg-background text-foreground ring-border"
                    }`}
                  >
                    {r.badge}
                  </span>
                  <span className="text-[10px] uppercase tracking-wide text-primary-foreground/70">
                    Saved {r.savedAt}
                  </span>
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <div className="font-serif text-xl font-bold">
                      {r.location}
                    </div>
                    <div className="text-xs text-primary-foreground/70">
                      {r.city}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gold">
                    {r.overallScore}
                  </div>
                </div>
              </div>
              <CardContent className="space-y-4 p-4">
                <p className="text-sm text-muted-foreground">{r.summary}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />{" "}
                  11-parameter audit complete
                </div>
                <Link to={`/report/result?location=${r.id}`}>
                  <Button variant="outline" className="w-full justify-between">
                    View Detailed Analytics <span aria-hidden>→</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-serif text-lg font-semibold">
              Why HomeTrust Reports?
            </h3>
            <ul className="mt-3 space-y-3 text-sm">
              {[
                "11 independent livability parameters",
                "Institutional-grade anomaly detection",
                "Unlimited saves at zero cost",
                "PDF & JSON export for advisors",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gold/30 bg-gold/10 p-5">
            <div className="flex items-center gap-2 text-navy">
              <Award className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Verified Status
              </span>
            </div>
            <div className="mt-2 font-serif text-xl font-bold">
              Platinum Advisor
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Your saved reports benefit from the highest moderation tier.
              Listings tied to these areas are AI-audited twice daily.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-navy">
              <ShieldCheck className="h-4 w-4" /> Audit trust hash: 0x82f4…d119
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
