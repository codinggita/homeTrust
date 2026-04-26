import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BedDouble,
  Grid3x3,
  Heart,
  Home as HomeIcon,
  Loader2,
  MapPin,
  Map as MapIcon,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import { Checkbox } from "@/components/checkbox";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Slider } from "@/components/slider";
import { Switch } from "@/components/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { Skeleton } from "@/components/skeleton";
import { delay, LISTINGS } from "@/data/mockData";
import { useListingStore } from "@/stores";
import VerificationBadge from "@/components/VerificationBadge";
import TrustScore from "@/components/TrustScore";
import MapView from "@/components/MapView";

const BHK_OPTIONS = [1, 2, 3, 4];
const TIER_OPTIONS = ["Platinum", "Gold", "Silver", "Bronze"];

function ListingCard({ listing }) {
  return (
    <Card className="group overflow-hidden border-border transition-shadow hover:shadow-lg">
      <div
        className="relative h-44 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${listing.imageColor} 0%, #0b1f3a 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-30" aria-hidden>
          <div className="absolute left-4 top-4 h-16 w-16 rounded-lg bg-gold/40 blur-2xl" />
          <div className="absolute bottom-6 right-6 h-24 w-24 rounded-full bg-sky-400/30 blur-2xl" />
        </div>
        <div className="absolute left-3 top-3">
          <VerificationBadge tier={listing.verification} />
        </div>
        <button
          type="button"
          className="absolute right-3 top-3 rounded-full bg-background/80 p-2 text-navy backdrop-blur transition hover:bg-background"
          aria-label="Save listing"
        >
          <Heart className="h-4 w-4" />
        </button>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-primary-foreground">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
              {listing.bhk} BHK · {listing.area} sqft
            </div>
            <div className="text-xl font-bold">
              ${listing.price.toLocaleString()}/mo
            </div>
          </div>
          <TrustScore score={listing.trustScore} />
        </div>
      </div>
      <CardContent className="space-y-3 p-4">
        <div>
          <h3 className="font-serif text-lg font-semibold text-navy">
            {listing.title}
          </h3>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {listing.address}
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
          <div>
            <div className="font-semibold">{listing.brokerName}</div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Star className="h-3 w-3 fill-gold text-gold" />
              {listing.brokerRating.toFixed(1)} ({listing.brokerReviews})
            </div>
          </div>
          <Link to={`/listings/${listing.id}`}>
            <Button
              size="sm"
              className="bg-navy text-primary-foreground hover:bg-navy/90"
            >
              View
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ListingsBrowsePage() {
  const store = useListingStore();
  const {
    query,
    trustedOnly,
    priceMin,
    priceMax,
    bhk,
    verification,
    minTrust,
    viewMode,
    sort,
    setFilter,
  } = store;

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [visible, setVisible] = useState(9);

  useEffect(() => {
    setLoading(true);
    let cancelled = false;
    delay(LISTINGS, 400).then((data) => {
      if (!cancelled) {
        setListings(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function toggleBhk(n) {
    const set = bhk.includes(n) ? bhk.filter((x) => x !== n) : [...bhk, n];
    setFilter("bhk", set);
  }

  function toggleTier(tier) {
    const set = verification.includes(tier)
      ? verification.filter((t) => t !== tier)
      : [...verification, tier];
    setFilter("verification", set);
  }

  const filtered = useMemo(() => {
    let rows = listings.filter((l) => {
      if (trustedOnly && l.trustScore < 85) return false;
      if (l.price < priceMin || l.price > priceMax) return false;
      if (bhk.length && !bhk.includes(l.bhk)) return false;
      if (verification.length && !verification.includes(l.verification))
        return false;
      if (l.trustScore < minTrust) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay =
          `${l.title} ${l.city} ${l.address} ${l.brokerName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sort === "trust")
      rows = [...rows].sort((a, b) => b.trustScore - a.trustScore);
    if (sort === "price-asc")
      rows = [...rows].sort((a, b) => a.price - b.price);
    if (sort === "price-desc")
      rows = [...rows].sort((a, b) => b.price - a.price);
    return rows;
  }, [
    listings,
    trustedOnly,
    priceMin,
    priceMax,
    bhk,
    verification,
    minTrust,
    query,
    sort,
  ]);

  return (
    <div className="bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-navy md:text-4xl">
            Verified Rentals
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Every listing is vetted by our community and AI scam-detection
            engine. Filter by trust score and verification tier to find the
            right home, scam-free.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Filter sidebar */}
          <aside className="space-y-4">
            <Card className="border-border">
              <CardContent className="space-y-5 p-5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-navy" />
                  <h2 className="font-serif text-lg font-semibold">Filters</h2>
                </div>

                <div>
                  <Label
                    htmlFor="search"
                    className="text-xs font-semibold uppercase tracking-wide"
                  >
                    City, ZIP or neighborhood
                  </Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="search"
                      value={query}
                      onChange={(e) => setFilter("query", e.target.value)}
                      placeholder="Search…"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md bg-gold/10 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-gold" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-navy">
                      Trusted Only
                    </span>
                  </div>
                  <Switch
                    checked={trustedOnly}
                    onCheckedChange={(v) => setFilter("trustedOnly", v)}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold uppercase tracking-wide">
                      Price range
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      ${priceMin} – ${priceMax.toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    min={500}
                    max={10000}
                    step={100}
                    value={[priceMin, priceMax]}
                    onValueChange={(v) => {
                      setFilter("priceMin", v[0]);
                      setFilter("priceMax", v[1]);
                    }}
                    className="mt-3"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide">
                    Configuration (BHK)
                  </Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {BHK_OPTIONS.map((n) => (
                      <label
                        key={n}
                        className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm"
                      >
                        <Checkbox
                          checked={bhk.includes(n)}
                          onCheckedChange={() => toggleBhk(n)}
                        />
                        <BedDouble className="h-3 w-3 text-muted-foreground" />
                        {n} BHK
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide">
                    Verification level
                  </Label>
                  <div className="mt-2 space-y-2">
                    {TIER_OPTIONS.map((tier) => (
                      <label
                        key={tier}
                        className="flex items-center gap-2 rounded-md bg-background px-3 py-2 text-sm"
                      >
                        <Checkbox
                          checked={verification.includes(tier)}
                          onCheckedChange={() => toggleTier(tier)}
                        />

                        <VerificationBadge tier={tier} />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold uppercase tracking-wide">
                      Min trust score
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {minTrust}
                    </span>
                  </div>
                  <Slider
                    min={40}
                    max={100}
                    step={1}
                    value={[minTrust]}
                    onValueChange={(v) => setFilter("minTrust", v[0])}
                    className="mt-3"
                  />
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Results */}
          <section>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground">
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" /> Loading
                    verified listings…
                  </span>
                ) : (
                  <>
                    Showing{" "}
                    <span className="font-semibold text-foreground">
                      {Math.min(visible, filtered.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-foreground">
                      {filtered.length}
                    </span>{" "}
                    verified listings
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex overflow-hidden rounded-md border border-border">
                  <button
                    type="button"
                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs ${
                      viewMode === "grid"
                        ? "bg-navy text-primary-foreground"
                        : "bg-background text-muted-foreground"
                    }`}
                    onClick={() => setFilter("viewMode", "grid")}
                  >
                    <Grid3x3 className="h-3 w-3" /> Grid
                  </button>
                  <button
                    type="button"
                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs ${
                      viewMode === "map"
                        ? "bg-navy text-primary-foreground"
                        : "bg-background text-muted-foreground"
                    }`}
                    onClick={() => setFilter("viewMode", "map")}
                  >
                    <MapIcon className="h-3 w-3" /> Map
                  </button>
                </div>

                <Select
                  value={sort}
                  onValueChange={(v) => setFilter("sort", v)}
                >
                  <SelectTrigger className="w-[180px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trust">Reliability</SelectItem>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 w-full rounded-xl" />
                ))}
              </div>
            ) : viewMode === "map" ? (
              <div className="space-y-4">
                <div className="h-[480px] overflow-hidden rounded-xl border border-border">
                  <MapView
                    center={[40.7128, -74.006]}
                    zoom={11}
                    markers={filtered.slice(0, visible).map((l) => ({
                      id: l.id,
                      position: [l.lat, l.lon],
                      label: `${l.title} · $${l.price.toLocaleString()}`,
                    }))}
                    className="h-full w-full"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filtered.slice(0, Math.min(6, visible)).map((l) => (
                    <ListingCard key={l.id} listing={l} />
                  ))}
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
                  <HomeIcon className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    No listings match your filters.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Try widening the price range or lowering the min trust
                    score.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.slice(0, visible).map((l) => (
                    <ListingCard key={l.id} listing={l} />
                  ))}
                </div>
                {visible < filtered.length && (
                  <div className="mt-8 flex justify-center">
                    <Button
                      variant="outline"
                      className="border-navy text-navy"
                      onClick={() => setVisible((v) => v + 6)}
                    >
                      Load More High-Trust Listings
                    </Button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
