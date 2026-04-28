/**
 * ListingsBrowsePage.jsx
 * Fetches from GET /api/listings with real filters → displays real listings.
 */
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  BedDouble, Grid3x3, Heart, Home as HomeIcon,
  Loader2, MapPin, Map as MapIcon, RotateCcw,
  Search, ShieldCheck, SlidersHorizontal, Star,
} from "lucide-react";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import { Checkbox } from "@/components/checkbox";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Slider } from "@/components/slider";
import { Switch } from "@/components/switch";
import { Skeleton } from "@/components/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select";
import { listingApi } from "@/lib/api";
import { useListingStore } from "@/stores";
import VerificationBadge from "@/components/VerificationBadge";
import TrustScore from "@/components/TrustScore";
import MapView from "@/components/MapView";
import { toast } from "sonner";

const BHK_OPTIONS    = [1, 2, 3, 4];
const TIER_OPTIONS   = ["Platinum", "Gold", "Silver", "Bronze"];
const FURNISHING_MAP = {
  unfurnished: "Unfurnished",
  "semi-furnished": "Semi",
  "fully-furnished": "Furnished",
};

// Normalize backend listing → display shape
function normalise(l) {
  return {
    _id        : l._id,
    title      : l.address?.full || "Property Listing",
    address    : l.address?.full || "",
    pincode    : l.address?.pincode || "",
    city       : l.address?.pincode || "",
    price      : l.price,
    bhk        : l.bhk,
    area       : l.area,
    furnishing : FURNISHING_MAP[l.furnishing] || l.furnishing,
    verification: l.verificationLevel
      ? l.verificationLevel.charAt(0).toUpperCase() + l.verificationLevel.slice(1)
      : "Bronze",
    trustScore : l.trustScore,
    status     : l.status,
    lat        : l.address?.lat || 20.5937,
    lon        : l.address?.lon || 78.9629,
    photos     : l.photos || [],
    brokerName : l.brokerId?.profile?.fullName || "Verified Broker",
    brokerId   : l.brokerId,
    amenities  : l.amenities || [],
    imageColor : ["#1e3a5f", "#2d4a6b", "#0f2744"][l.bhk % 3],
    createdAt  : l.createdAt,
  };
}

function ListingCard({ listing }) {
  const photo = listing.photos?.[0];
  return (
    <Card className="group overflow-hidden border-border transition-all hover:shadow-xl hover:-translate-y-0.5">
      <div
        className="relative h-44 overflow-hidden"
        style={{
          background: photo
            ? undefined
            : `linear-gradient(135deg, ${listing.imageColor} 0%, #0b1f3a 100%)`,
        }}
      >
        {photo ? (
          <img src={photo} alt={listing.title} className="h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-primary-foreground/30">
            <HomeIcon className="h-12 w-12" />
          </div>
        )}
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
              ₹{listing.price.toLocaleString("en-IN")}/mo
            </div>
          </div>
          <TrustScore score={listing.trustScore} />
        </div>
      </div>

      <CardContent className="space-y-3 p-4">
        <div>
          <h3 className="font-serif text-base font-semibold text-navy line-clamp-1">
            {listing.title}
          </h3>
          <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="line-clamp-1">{listing.address}</span>
          </p>
        </div>
        {listing.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {listing.amenities.slice(0, 3).map((a) => (
              <span key={a} className="rounded-full border border-border bg-secondary/50 px-2 py-0.5 text-[10px]">
                {a}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
          <div>
            <div className="font-semibold">{listing.brokerName}</div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Star className="h-3 w-3 fill-gold text-gold" />
              Verified broker
            </div>
          </div>
          <Link to={`/listings/${listing._id}`}>
            <Button size="sm" className="bg-navy text-primary-foreground hover:bg-navy/90">
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
  const { priceMin, priceMax, bhk, verification, minTrust, trustedOnly, sort, viewMode, setFilter, reset } = store;

  const [search,    setSearch]   = useState("");
  const [listings,  setListings] = useState([]);
  const [total,     setTotal]    = useState(0);
  const [page,      setPage]     = useState(1);
  const [loading,   setLoading]  = useState(true);
  const [hasMore,   setHasMore]  = useState(false);

  const fetchListings = useCallback(async (pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const params = {
        page       : pageNum,
        limit      : 12,
        sortBy     : sort === "trust" ? "reliability" : sort === "price-asc" ? "priceLow" : sort === "price-desc" ? "priceHigh" : "newest",
        minPrice   : priceMin || undefined,
        maxPrice   : priceMax < 200000 ? priceMax : undefined,
        bhk        : bhk.length ? bhk.join(",") : undefined,
        verificationLevel: verification.length === 4 ? undefined : verification[0]?.toLowerCase(),
        minTrustScore: minTrust > 0 ? minTrust : undefined,
        trustedOnly  : trustedOnly ? "true" : undefined,
      };
      const { data } = await listingApi.getAll(params);
      const normalised = (data.listings || []).map(normalise);
      setListings((prev) => append ? [...prev, ...normalised] : normalised);
      setTotal(data.total || 0);
      setHasMore(pageNum < data.totalPages);
    } catch (err) {
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, [priceMin, priceMax, bhk, verification, minTrust, trustedOnly, sort]);

  useEffect(() => { setPage(1); fetchListings(1, false); }, [fetchListings]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchListings(next, true);
  };

  const toggleBhk  = (n)    => setFilter("bhk", bhk.includes(n) ? bhk.filter((x) => x !== n) : [...bhk, n]);
  const toggleTier = (tier) => setFilter("verification", verification.includes(tier) ? verification.filter((t) => t !== tier) : [...verification, tier]);

  const filtered = search
    ? listings.filter((l) => `${l.title} ${l.address} ${l.brokerName}`.toLowerCase().includes(search.toLowerCase()))
    : listings;

  return (
    <div className="bg-secondary/20 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="font-serif text-3xl font-bold text-navy md:text-4xl">Verified Rentals</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Every listing is broker-verified and scam-detected. Filter by trust score and verification tier.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar filters */}
          <aside>
            <Card className="border-border sticky top-4">
              <CardContent className="space-y-5 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-navy" />
                    <h2 className="font-serif text-base font-semibold">Filters</h2>
                  </div>
                  <button onClick={reset} className="text-xs text-navy hover:underline flex items-center gap-1">
                    <RotateCcw className="h-3 w-3" /> Reset
                  </button>
                </div>

                {/* Search */}
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide">Search</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Title, address…" className="pl-9" />
                  </div>
                </div>

                {/* Trusted only */}
                <div className="flex items-center justify-between rounded-md bg-gold/10 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-gold" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-navy">Trusted Only</span>
                  </div>
                  <Switch checked={trustedOnly} onCheckedChange={(v) => setFilter("trustedOnly", v)} />
                </div>

                {/* Price */}
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold uppercase tracking-wide">Price range</Label>
                    <span className="text-xs text-muted-foreground">
                      ₹{priceMin.toLocaleString("en-IN")} – ₹{priceMax.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <Slider
                    min={0} max={200000} step={1000}
                    value={[priceMin, priceMax]}
                    onValueChange={(v) => { setFilter("priceMin", v[0]); setFilter("priceMax", v[1]); }}
                    className="mt-3"
                  />
                </div>

                {/* BHK */}
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide">BHK</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {BHK_OPTIONS.map((n) => (
                      <label key={n} className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm cursor-pointer">
                        <Checkbox checked={bhk.includes(n)} onCheckedChange={() => toggleBhk(n)} />
                        <BedDouble className="h-3 w-3 text-muted-foreground" />
                        {n} BHK
                      </label>
                    ))}
                  </div>
                </div>

                {/* Verification */}
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide">Verification</Label>
                  <div className="mt-2 space-y-2">
                    {TIER_OPTIONS.map((tier) => (
                      <label key={tier} className="flex items-center gap-2 rounded-md bg-background px-3 py-2 text-sm cursor-pointer">
                        <Checkbox checked={verification.includes(tier)} onCheckedChange={() => toggleTier(tier)} />
                        <VerificationBadge tier={tier} />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Min trust */}
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold uppercase tracking-wide">Min trust score</Label>
                    <span className="text-xs text-muted-foreground">{minTrust}</span>
                  </div>
                  <Slider min={0} max={100} step={1} value={[minTrust]} onValueChange={(v) => setFilter("minTrust", v[0])} className="mt-3" />
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Results */}
          <section>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground">
                {loading && listings.length === 0 ? (
                  <span className="inline-flex items-center gap-2"><Loader2 className="h-3 w-3 animate-spin" /> Loading verified listings…</span>
                ) : (
                  <>Showing <strong className="text-foreground">{filtered.length}</strong> of <strong className="text-foreground">{total}</strong> listings</>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex overflow-hidden rounded-md border border-border">
                  {["grid", "map"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setFilter("viewMode", mode)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs ${viewMode === mode ? "bg-navy text-primary-foreground" : "bg-background text-muted-foreground"}`}
                    >
                      {mode === "grid" ? <Grid3x3 className="h-3 w-3" /> : <MapIcon className="h-3 w-3" />}
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
                <Select value={sort} onValueChange={(v) => setFilter("sort", v)}>
                  <SelectTrigger className="w-[160px] text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="trust">By Trust Score</SelectItem>
                    <SelectItem value="price-asc">Price: Low → High</SelectItem>
                    <SelectItem value="price-desc">Price: High → Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading && listings.length === 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-xl" />)}
              </div>
            ) : viewMode === "map" ? (
              <div className="h-[480px] overflow-hidden rounded-xl border border-border">
                <MapView
                  center={[20.5937, 78.9629]}
                  zoom={5}
                  markers={filtered.map((l) => ({ id: l._id, position: [l.lat, l.lon], label: `${l.bhk} BHK · ₹${l.price.toLocaleString("en-IN")}` }))}
                  className="h-full w-full"
                />
              </div>
            ) : filtered.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
                  <HomeIcon className="h-10 w-10 text-muted-foreground/40" />
                  <p className="text-sm font-semibold">No listings match your filters.</p>
                  <p className="text-xs text-muted-foreground">Try adjusting the price range or trust score filter.</p>
                  <Button variant="outline" size="sm" onClick={reset}>Reset filters</Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((l) => <ListingCard key={l._id} listing={l} />)}
                </div>
                {hasMore && (
                  <div className="mt-8 flex justify-center">
                    <Button variant="outline" className="border-navy text-navy" onClick={loadMore} disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Load More Listings
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
