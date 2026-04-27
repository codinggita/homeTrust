import { Link } from "react-router-dom";
import {
  Award,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  FileText,
  Home as HomeIcon,
  Map as MapIcon,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import { TESTIMONIALS } from "@/data/mockData";

const TRUST_BADGES = [
  { label: "INSTITUTIONAL GRADE DATA", icon: BarChart3 },
  { label: "AI SCAM DETECTION ENGINE", icon: Shield },
  { label: "NEIGHBORHOOD QUALITY", icon: MapIcon },
  { label: "VERIFIED LANDLORDS", icon: ShieldCheck },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-20" aria-hidden>
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-gold/30 blur-3xl" />
          <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-12 md:px-6 md:py-24">
          <div className="md:col-span-7">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
              <Sparkles className="h-3.5 w-3.5" /> 100% Free · No Premium Tiers
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-balance md:text-6xl">
              Know Your Neighborhood.
              <br />
              <span className="text-gold">Rent with Confidence.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/75 md:text-lg">
              HomeTrust delivers free, institutional-grade neighborhood quality
              reports and a scam-free verified rental marketplace — with trust
              scores, broker badges and AI moderation baked in.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/report/search">
                <Button
                  size="lg"
                  className="w-full bg-gold text-navy hover:bg-gold/90 sm:w-auto"
                >
                  <FileText className="mr-2 h-4 w-4" /> Search Reports
                </Button>
              </Link>
              <Link to="/listings/browse">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
                >
                  <HomeIcon className="mr-2 h-4 w-4" /> Find Verified Rentals
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
              {TRUST_BADGES.map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-2 rounded-lg border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-2"
                >
                  <b.icon className="h-4 w-4 text-gold" />
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-primary-foreground/80">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Livability preview card */}
          <div className="md:col-span-5">
            <div className="relative rounded-2xl bg-background p-5 text-foreground shadow-2xl ring-1 ring-primary-foreground/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Livability Score · Top 1%
                  </div>
                  <h3 className="mt-1 font-serif text-2xl font-bold">
                    Oak Ridge
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Boston Metro · Verified
                  </p>
                </div>
                <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-navy text-primary-foreground">
                  <span className="text-2xl font-bold text-gold">A+</span>
                  <span className="text-[10px] uppercase tracking-wide text-primary-foreground/70">
                    Safety
                  </span>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { label: "Transit", val: "A+" },
                  { label: "Schools", val: "A" },
                  { label: "Air Quality", val: "A-" },
                  { label: "Green Cover", val: "B+" },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="flex items-center justify-between rounded-md bg-secondary/60 px-3 py-2"
                  >
                    <span className="text-xs text-muted-foreground">
                      {m.label}
                    </span>
                    <span className="font-semibold text-navy">{m.val}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-lg border border-border bg-gold/10 px-3 py-2 text-xs">
                <Award className="h-4 w-4 text-gold" />
                <span className="font-medium">
                  Institutional advisors recommend this area
                </span>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Last updated 2h ago
                </span>
                <Link
                  to="/report/result?location=lincoln-park"
                  className="inline-flex items-center text-sm font-semibold text-navy hover:text-navy/80"
                >
                  View full report <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature highlight */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 md:grid-cols-2 md:px-6">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="mb-4 inline-flex rounded-md bg-navy/10 p-2">
              <FileText className="h-5 w-5 text-navy" />
            </div>
            <h3 className="font-serif text-2xl font-semibold">
              Neighborhood Quality Reports
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Free livability reports across 11 parameters — air quality,
              walkability, flood risk, crime, noise, metro proximity, schools,
              hospitals, green cover, internet and power. Export to PDF and
              compare localities.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                "11-parameter livability index",
                "Locality comparison",
                "Free PDF export",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> {t}
                </li>
              ))}
            </ul>
            <Link to="/report/search">
              <Button className="mt-5 bg-navy text-primary-foreground hover:bg-navy/90">
                Generate free report
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="mb-4 inline-flex rounded-md bg-gold/20 p-2">
              <ShieldCheck className="h-5 w-5 text-gold" />
            </div>
            <h3 className="font-serif text-2xl font-semibold">
              Verified Rental Listings
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Scam-free marketplace. Brokers earn Bronze, Silver, Gold and
              Platinum badges. Every listing displays a trust score. Community
              reporting + AI moderation keep it clean.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                "Bronze / Silver / Gold / Platinum badges",
                "Community + AI moderation",
                "Transparent trust score",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> {t}
                </li>
              ))}
            </ul>
            <Link to="/listings/browse">
              <Button variant="outline" className="mt-5 border-navy text-navy">
                Browse verified rentals
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-3xl font-bold">
              Trusted by renters & institutions
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Real feedback from our community.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 text-gold">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-3 text-sm leading-relaxed text-foreground/90">
                    "{t.quote}"
                  </blockquote>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-semibold text-gold">
                      {t.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
