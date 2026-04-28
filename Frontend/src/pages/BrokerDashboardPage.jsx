/**
 * BrokerDashboardPage.jsx
 * Full real-data broker workspace.
 * APIs: GET /api/broker/stats, GET /api/broker/listings,
 *        POST /api/broker/verify-document, POST /api/listings
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Activity, AlertTriangle, BarChart3, CheckCircle2, Clock,
  Eye, FileEdit, FileUp, Home as HomeIcon, Loader2,
  MessageSquare, Plus, ShieldAlert, ShieldCheck, Trash2,
  TrendingUp, Upload, X,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Legend,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import { Badge } from "@/components/badge";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select";
import { brokerApi, listingApi } from "@/lib/api";
import { useAuthStore } from "@/stores";
import VerificationBadge from "@/components/VerificationBadge";
import TrustScore from "@/components/TrustScore";

const BADGE_ORDER = { none: 0, bronze: 1, silver: 2, gold: 3, platinum: 4 };

const DOC_TYPES = [
  { value: "kyc",        label: "KYC / ID Proof",       desc: "PAN, Aadhaar or Passport",       icon: "🪪" },
  { value: "ownership",  label: "Property Ownership",    desc: "Title deed or agreement copy",   icon: "📜" },
  { value: "live_photo", label: "Live Photo",            desc: "Geo-tagged property photo",      icon: "📸" },
  { value: "video",      label: "Video Walkthrough",     desc: "Property walkthrough video",     icon: "🎬" },
];

const STATUS_BADGE = {
  active  : { label: "Active",  cls: "text-emerald-700", Icon: CheckCircle2 },
  pending : { label: "Pending", cls: "text-amber-700",   Icon: Clock },
  flagged : { label: "Flagged", cls: "text-rose-700",    Icon: AlertTriangle },
  removed : { label: "Removed", cls: "text-muted-foreground", Icon: X },
};

// ── Bronze→Platinum badge progress ──────────────────────────────────
const BADGE_STEPS = [
  { id: "kyc",        label: "KYC",       badge: "Bronze"   },
  { id: "ownership",  label: "Ownership", badge: "Silver"   },
  { id: "live_photo", label: "Live Photo",badge: "Gold"     },
  { id: "video",      label: "Video",     badge: "Platinum" },
];

export default function BrokerDashboardPage() {
  const { user }         = useAuthStore();
  const [stats,    setStats]    = useState(null);
  const [listings, setListings] = useState([]);
  const [loadSt,   setLoadSt]   = useState(true);
  const [loadLst,  setLoadLst]  = useState(true);

  // Add listing dialog
  const [addOpen,  setAddOpen]  = useState(false);
  const [form,     setForm]     = useState({
    addressFull: "", pincode: "", price: "", bhk: "2",
    area: "", furnishing: "unfurnished", amenities: "",
  });
  const [photos,   setPhotos]   = useState([]);
  const [adding,   setAdding]   = useState(false);
  const photoRef = useRef();

  // KYC upload dialog
  const [kycOpen,   setKycOpen]  = useState(false);
  const [docType,   setDocType]  = useState("kyc");
  const [docFile,   setDocFile]  = useState(null);
  const [uploading, setUploading] = useState(false);
  const docRef = useRef();

  const badgeLevel  = user?.brokerDetails?.badgeLevel  || "none";
  const badgeDocs   = user?.brokerDetails?.verificationDocuments || [];
  const uploadedTypes = new Set(badgeDocs.map((d) => d.type));

  const loadStats = useCallback(async () => {
    try {
      const { data } = await brokerApi.getStats();
      setStats(data.stats);
    } catch { toast.error("Failed to load stats"); }
    finally { setLoadSt(false); }
  }, []);

  const loadListings = useCallback(async () => {
    try {
      const { data } = await brokerApi.getListings({ limit: 50 });
      setListings(data.listings || []);
    } catch { toast.error("Failed to load listings"); }
    finally { setLoadLst(false); }
  }, []);

  useEffect(() => { loadStats(); loadListings(); }, [loadStats, loadListings]);

  // ── Add listing submit ───────────────────────────────────────────
  const handleAddListing = async () => {
    if (!form.addressFull || !form.pincode || !form.price || !form.area)
      return toast.error("Please fill all required fields");
    if (!/^\d{6}$/.test(form.pincode))
      return toast.error("Pincode must be 6 digits");

    setAdding(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      photos.forEach((f) => fd.append("photos", f));

      const { data } = await listingApi.create(fd);
      setListings((prev) => [data.listing, ...prev]);
      setAddOpen(false);
      setForm({ addressFull: "", pincode: "", price: "", bhk: "2", area: "", furnishing: "unfurnished", amenities: "" });
      setPhotos([]);
      toast.success("Listing submitted for verification ✅");
      loadStats();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.details?.[0] || "Failed to create listing";
      toast.error(msg);
    } finally {
      setAdding(false);
    }
  };

  // ── KYC upload ───────────────────────────────────────────────────
  const handleDocUpload = async () => {
    if (!docFile) return toast.error("Please select a file");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("document", docFile);
      fd.append("type", docType);
      const { data } = await brokerApi.uploadDoc(fd);
      toast.success(`${data.message} — Badge upgraded to ${data.badgeLevel.toUpperCase()} 🎉`);
      setKycOpen(false);
      setDocFile(null);
      // Update local user state
      window.location.reload(); // simplest refresh to pick up new badge
    } catch (err) {
      toast.error(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ── Stat cards ───────────────────────────────────────────────────
  const STAT_ITEMS = [
    { label: "Total",    value: stats?.totalListings  ?? "—", Icon: HomeIcon,      cls: "bg-navy/10 text-navy" },
    { label: "Active",   value: stats?.activeListings ?? "—", Icon: CheckCircle2,  cls: "bg-emerald-100 text-emerald-700" },
    { label: "Views",    value: stats?.totalViews     ?? "—", Icon: Eye,           cls: "bg-sky-100 text-sky-700" },
    { label: "Contacts", value: stats?.totalContacts  ?? "—", Icon: MessageSquare, cls: "bg-violet-100 text-violet-700" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-6 md:py-10">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Broker workspace</p>
          <h1 className="font-serif text-3xl font-bold text-navy md:text-4xl">
            {user?.profile?.fullName || "Your"} Dashboard
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* KYC upload */}
          <Dialog open={kycOpen} onOpenChange={setKycOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-navy text-navy">
                <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-serif">Upload Verification Document</DialogTitle>
                <DialogDescription>
                  Upload documents to unlock higher badge levels and trust scores.
                </DialogDescription>
              </DialogHeader>

              {/* Badge progress */}
              <div className="rounded-lg bg-secondary/40 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide mb-2 text-muted-foreground">
                  Badge progression
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {BADGE_STEPS.map((step, i) => {
                    const done = uploadedTypes.has(step.id);
                    return (
                      <div key={step.id} className="flex items-center gap-2 shrink-0">
                        <div className={`flex flex-col items-center gap-1`}>
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${done ? "bg-emerald-100 text-emerald-700" : "bg-border text-muted-foreground"}`}>
                            {done ? "✓" : i + 1}
                          </div>
                          <span className="text-[10px] text-muted-foreground">{step.badge}</span>
                        </div>
                        {i < BADGE_STEPS.length - 1 && <div className={`h-0.5 w-6 rounded ${done ? "bg-emerald-400" : "bg-border"}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>Document type</Label>
                  <Select value={docType} onValueChange={setDocType}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DOC_TYPES.map((d) => (
                        <SelectItem key={d.value} value={d.value}>
                          {d.icon} {d.label}
                          {uploadedTypes.has(d.value) && " ✓"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {DOC_TYPES.find((d) => d.value === docType)?.desc}
                  </p>
                </div>

                <div>
                  <Label>File</Label>
                  <div
                    className="mt-1.5 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/30 p-6 text-center hover:border-navy/50 transition"
                    onClick={() => docRef.current?.click()}
                  >
                    <FileUp className="h-8 w-8 text-muted-foreground/50" />
                    {docFile ? (
                      <span className="text-sm font-medium">{docFile.name}</span>
                    ) : (
                      <>
                        <span className="text-sm font-medium">Click to upload</span>
                        <span className="text-xs text-muted-foreground">PDF, JPG, PNG, MP4 — max 50 MB</span>
                      </>
                    )}
                  </div>
                  <input
                    ref={docRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.mp4,.mov"
                    onChange={(e) => setDocFile(e.target.files[0] || null)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button onClick={handleDocUpload} disabled={uploading} className="bg-navy text-primary-foreground hover:bg-navy/90">
                  {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading…</> : "Upload & Upgrade Badge"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add listing */}
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gold text-navy hover:bg-gold/90">
                <Plus className="mr-1.5 h-4 w-4" /> Add Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif">Add New Listing</DialogTitle>
                <DialogDescription>
                  Complete all required fields. Your listing will go into the verification queue.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="addr">Full address *</Label>
                  <Input id="addr" value={form.addressFull} onChange={(e) => setForm({ ...form, addressFull: e.target.value })} placeholder="e.g. Flat 4B, Rose Apartments, MG Road" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="pin">Pincode *</Label>
                    <Input id="pin" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} placeholder="560034" inputMode="numeric" maxLength={6} />
                  </div>
                  <div>
                    <Label htmlFor="price">Rent/month (₹) *</Label>
                    <Input id="price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="25000" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>BHK *</Label>
                    <Select value={form.bhk} onValueChange={(v) => setForm({ ...form, bhk: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["1","2","3","4","5"].map((n) => <SelectItem key={n} value={n}>{n} BHK</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="area">Area (sqft) *</Label>
                    <Input id="area" type="number" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="950" />
                  </div>
                </div>
                <div>
                  <Label>Furnishing</Label>
                  <Select value={form.furnishing} onValueChange={(v) => setForm({ ...form, furnishing: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unfurnished">Unfurnished</SelectItem>
                      <SelectItem value="semi-furnished">Semi-furnished</SelectItem>
                      <SelectItem value="fully-furnished">Fully furnished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amenities">Amenities (comma separated)</Label>
                  <Input id="amenities" value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} placeholder="Parking, Gym, Lift, Security" />
                </div>
                <div>
                  <Label>Photos (up to 10)</Label>
                  <div
                    className="mt-1.5 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/30 p-4 text-center hover:border-navy/50 transition"
                    onClick={() => photoRef.current?.click()}
                  >
                    <FileUp className="h-6 w-6 text-muted-foreground/50" />
                    <span className="text-sm">
                      {photos.length > 0 ? `${photos.length} photo(s) selected` : "Click to add photos"}
                    </span>
                  </div>
                  <input ref={photoRef} type="file" multiple accept="image/*" className="hidden"
                    onChange={(e) => setPhotos(Array.from(e.target.files).slice(0, 10))} />
                </div>
              </div>

              <DialogFooter>
                <Button onClick={handleAddListing} disabled={adding} className="bg-navy text-primary-foreground hover:bg-navy/90">
                  {adding ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…</> : "Submit for Verification"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Badge status */}
      <Card className="border-border overflow-hidden">
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Verification badge</div>
              <div className="mt-1 flex items-center gap-3">
                <VerificationBadge tier={badgeLevel.charAt(0).toUpperCase() + badgeLevel.slice(1)} />
                <span className="text-sm text-muted-foreground">
                  {badgeLevel === "platinum"
                    ? "Highest tier — maximum trust score"
                    : `Upload more documents to reach the next tier`}
                </span>
              </div>
            </div>
            <Button size="sm" variant="outline" className="border-navy text-navy" onClick={() => setKycOpen(true)}>
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Upgrade badge
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {STAT_ITEMS.map((s) => (
          <Card key={s.label} className="border-border">
            <CardContent className="p-4">
              <div className={`inline-flex rounded-md p-1.5 ${s.cls}`}>
                <s.Icon className="h-3.5 w-3.5" />
              </div>
              <div className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</div>
              <div className="mt-1 font-serif text-2xl font-bold text-navy">
                {loadSt ? <Loader2 className="h-5 w-5 animate-spin text-navy" /> : s.value?.toLocaleString?.() ?? s.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Listings table */}
      <Card className="border-border">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h2 className="font-serif text-xl font-semibold">Your Listings</h2>
              <p className="text-xs text-muted-foreground">{listings.length} listings</p>
            </div>
            <Badge variant="outline" className={
              listings.some((l) => l.status === "flagged")
                ? "border-rose-300 bg-rose-50 text-rose-700"
                : "border-emerald-300 bg-emerald-50 text-emerald-700"
            }>
              {listings.some((l) => l.status === "flagged") ? "Action required" : "Moderation: clean"}
            </Badge>
          </div>

          {loadLst ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-navy" />
            </div>
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-14 text-center">
              <HomeIcon className="h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm font-medium">No listings yet</p>
              <p className="text-xs text-muted-foreground">Create your first listing to get started.</p>
              <Button size="sm" className="bg-navy text-primary-foreground" onClick={() => setAddOpen(true)}>
                <Plus className="mr-1 h-3.5 w-3.5" /> Add Listing
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 text-left">Address</th>
                    <th className="px-5 py-3 text-left">Rent</th>
                    <th className="px-5 py-3 text-left">BHK</th>
                    <th className="px-5 py-3 text-left">Tier</th>
                    <th className="px-5 py-3 text-left">Trust</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((l) => {
                    const st = STATUS_BADGE[l.status] || STATUS_BADGE.pending;
                    return (
                      <tr key={l._id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                        <td className="px-5 py-3 font-medium max-w-[200px]">
                          <div className="truncate">{l.address?.full || "—"}</div>
                          <div className="text-xs text-muted-foreground">{l.address?.pincode}</div>
                        </td>
                        <td className="px-5 py-3 font-semibold">₹{l.price?.toLocaleString("en-IN")}</td>
                        <td className="px-5 py-3 text-muted-foreground">{l.bhk} BHK</td>
                        <td className="px-5 py-3"><VerificationBadge tier={l.verificationLevel?.charAt(0).toUpperCase() + l.verificationLevel?.slice(1)} /></td>
                        <td className="px-5 py-3"><TrustScore score={l.trustScore} compact /></td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold ${st.cls}`}>
                            <st.Icon className="h-3 w-3" /> {st.label}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <Link to={`/listings/${l._id}`}>
                            <Button size="sm" variant="ghost" className="text-navy">
                              <Eye className="mr-1 h-3 w-3" /> View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
