import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Ban,
  Calendar,
  Flag,
  Heart,
  MapPin,
  MessageSquare,
  Ruler,
  ShieldCheck,
  Sofa,
  Star,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import { Badge } from "@/components/badge";
import { Skeleton } from "@/components/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import { Textarea } from "@/components/textarea";
import { Label } from "@/components/label";
import { delay, LISTINGS } from "@/data/mockData";
import VerificationBadge from "@/components/VerificationBadge";
import TrustScore from "@/components/TrustScore";
import MapView from "@/components/MapView";
import AutomatedViewingScheduler from "@/components/AutomatedViewingScheduler";
import MortgageCalculator from "@/components/MortgageCalculator";
import InvestmentForecaster from "@/components/InvestmentForecaster";
import ImmersiveViewer from "@/components/ImmersiveViewer";

export default function ListingDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);

  useEffect(() => {
    setLoading(true);
    const found = LISTINGS.find((l) => l.id === id) || LISTINGS[0];
    delay(found, 300).then((l) => {
      setListing(l);
      setLoading(false);
    });
  }, [id]);

  if (loading || !listing) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  const transitLabel =
    listing.transitScore >= 85
      ? "Excellent"
      : listing.transitScore >= 70
        ? "Good"
        : "Fair";
  const walkLabel =
    listing.walkScore >= 85
      ? "Excellent"
      : listing.walkScore >= 70
        ? "Good"
        : "Fair";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <Link
        to="/listings/browse"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to listings
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <main className="space-y-6">
          <div
            className="overflow-hidden rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${listing.imageColor} 0%, #0b1f3a 100%)`,
            }}
          >
            <div className="relative h-72 md:h-80">
              <div className="absolute inset-0 opacity-30" aria-hidden>
                <div className="absolute left-10 top-10 h-40 w-40 rounded-lg bg-gold/30 blur-3xl" />
                <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-sky-400/30 blur-3xl" />
              </div>
              <div className="absolute left-4 top-4">
                <VerificationBadge tier={listing.verification} />
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-2 text-primary-foreground md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="font-serif text-3xl font-bold md:text-4xl">
                    {listing.title}
                  </h1>
                  <p className="mt-1 flex items-center gap-1 text-sm text-primary-foreground/80">
                    <MapPin className="h-4 w-4" /> {listing.address}
                  </p>
                </div>
                <TrustScore score={listing.trustScore} />
              </div>
            </div>
          </div>

          <ImmersiveViewer imageColor={listing.imageColor} />

          <Card className="border-border">
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-lg font-bold text-gold">
                  {listing.brokerName
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <div className="font-serif text-lg font-semibold">
                    {listing.brokerName}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                      <Star className="h-3 w-3 fill-gold text-gold" />
                      {listing.brokerRating.toFixed(1)}
                    </span>
                    ({listing.brokerReviews} reviews)
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-emerald-600" />
                      Verified {listing.verification} broker
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <AutomatedViewingScheduler brokerName={listing.brokerName} />
                <Button
                  size="sm"
                  variant="outline"
                  className="border-navy text-navy"
                  onClick={() => toast.info("Opening secure chat…")}
                >
                  <MessageSquare className="mr-1.5 h-3 w-3" /> Contact
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground"
                  onClick={() => toast.success("Broker blocked")}
                >
                  <Ban className="mr-1.5 h-3 w-3" /> Block
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-5">
              <h2 className="font-serif text-xl font-semibold">
                Property Specifications
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  {
                    label: "Monthly Rent",
                    value: `$${listing.price.toLocaleString()}`,
                    trend: "down",
                    sub: "-2.1% vs last month",
                    icon: BedDouble,
                  },
                  {
                    label: "Total Area",
                    value: `${listing.area} sqft`,
                    trend: "up",
                    sub: "Above avg for area",
                    icon: Ruler,
                  },
                  {
                    label: "Configuration",
                    value: `${listing.bhk} Bed · ${listing.bath} Bath`,
                    trend: "up",
                    sub: "Family-friendly",
                    icon: Bath,
                  },
                  {
                    label: "Furnishing",
                    value: listing.furnishing,
                    trend: "flat",
                    sub: "Move-in ready",
                    icon: Sofa,
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg border border-border bg-secondary/30 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {s.label}
                      </div>
                      <s.icon className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="mt-1 font-serif text-lg font-bold text-navy">
                      {s.value}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                      {s.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-emerald-600" />
                      ) : s.trend === "down" ? (
                        <TrendingDown className="h-3 w-3 text-emerald-600" />
                      ) : null}
                      {s.sub}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-semibold">
                  Rent Value History
                </h2>
                <span className="text-xs text-muted-foreground">
                  Mock · last 12 months
                </span>
              </div>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={listing.rentHistory}>
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                        fontSize: 12,
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#c9a24a"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "#0b1f3a" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <InvestmentForecaster baseValue={listing.price * 12 * 20} />
          
          <MortgageCalculator propertyPrice={listing.price * 12 * 20} />

          <Card className="border-border">
            <CardContent className="p-5">
              <h2 className="font-serif text-xl font-semibold">
                Neighborhood at a Glance
              </h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg bg-emerald-50 p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                    Walk Score
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-bold text-emerald-700">
                      {listing.walkScore}
                    </span>
                    <span className="text-xs text-emerald-700/80">
                      {walkLabel}
                    </span>
                  </div>
                </div>
                <div className="rounded-lg bg-sky-50 p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-sky-700">
                    Transit Score
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-bold text-sky-700">
                      {listing.transitScore}
                    </span>
                    <span className="text-xs text-sky-700/80">
                      {transitLabel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Vibe tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {listing.tags.map((v) => (
                    <Badge
                      key={v}
                      variant="outline"
                      className="border-navy/20 bg-navy/5 text-navy"
                    >
                      {v}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-5 h-56 overflow-hidden rounded-lg border border-border">
                <MapView
                  center={[listing.lat, listing.lon]}
                  zoom={13}
                  markers={[
                    {
                      id: listing.id,
                      position: [listing.lat, listing.lon],
                      label: listing.title,
                    },
                  ]}
                  className="h-full w-full"
                />
              </div>
            </CardContent>
          </Card>
        </main>

        <aside className="space-y-4">
          <Card className="border-border bg-navy text-primary-foreground">
            <CardContent className="p-5">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-gold">
                Monthly Rent
              </div>
              <div className="mt-1 font-serif text-4xl font-bold">
                ${listing.price.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-primary-foreground/70">
                Includes maintenance · No hidden fees
              </div>
              <div className="mt-5">
                <AutomatedViewingScheduler brokerName={listing.brokerName} />
              </div>
              <Button
                variant="outline"
                className="mt-2 w-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => toast.success("Saved to favorites")}
              >
                <Heart className="mr-2 h-4 w-4" /> Save to Favorites
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="mt-2 w-full text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    <Flag className="mr-2 h-4 w-4" /> Report this listing
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Report this listing</DialogTitle>
                    <DialogDescription>
                      Help keep HomeTrust scam-free. Our moderation team will
                      review within 24h.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Label>Reason</Label>
                    <Textarea placeholder="e.g. Suspicious photos, duplicate listing, wrong address…" />
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() =>
                        toast.success("Report submitted. Thank you!")
                      }
                      className="bg-navy text-primary-foreground hover:bg-navy/90"
                    >
                      Submit Report
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card className="border-gold/40 bg-gold/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                <ShieldCheck className="h-4 w-4 text-gold" /> Trust Signals
              </div>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" /> Broker
                  ID verified
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" /> Photos
                  match registry records
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" /> Price
                  within market range
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" /> No
                  community reports in 90d
                </li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
