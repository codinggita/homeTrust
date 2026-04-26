import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Eye,
  FileEdit,
  Home as HomeIcon,
  MessageSquare,
  Plus,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import { Badge } from "@/components/badge";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { BROKER_MONTHLY, LISTINGS } from "@/data/mockData";
import VerificationBadge from "@/components/VerificationBadge";
import TrustScore from "@/components/TrustScore";

const STATS = [
  {
    label: "Total Listings",
    value: "142",
    icon: HomeIcon,
    tone: "bg-navy/10 text-navy",
  },
  {
    label: "Active",
    value: "89",
    delta: "+4%",
    icon: CheckCircle2,
    tone: "bg-emerald-100 text-emerald-700",
  },
  {
    label: "Pending",
    value: "34",
    icon: Clock,
    tone: "bg-amber-100 text-amber-700",
  },
  {
    label: "Reported",
    value: "3",
    icon: AlertTriangle,
    tone: "bg-rose-100 text-rose-700",
  },
  {
    label: "Views (24h)",
    value: "12.8k",
    icon: Eye,
    tone: "bg-sky-100 text-sky-700",
  },
  {
    label: "Contacts",
    value: "452",
    icon: MessageSquare,
    tone: "bg-violet-100 text-violet-700",
  },
  {
    label: "Strikes",
    value: "0 / 3",
    icon: ShieldAlert,
    tone: "bg-gold/20 text-navy",
  },
];

export default function BrokerDashboardPage() {
  const [listings, setListings] = useState(
    LISTINGS.slice(0, 8).map((l, i) => ({
      ...l,
      status: i === 2 ? "pending" : i === 5 ? "flagged" : "active",
    })),
  );
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    city: "",
    price: "",
    bhk: "2",
  });

  useEffect(() => {
    toast.info("Broker mode · demo data loaded");
  }, []);

  function handleAddListing() {
    if (!form.title || !form.city || !form.price) {
      toast.error("Please fill all required fields");
      return;
    }
    const newListing = {
      ...LISTINGS[0],
      id: `new-${Date.now()}`,
      title: form.title,
      city: form.city,
      address: `Pending — ${form.city}`,
      price: Number(form.price),
      bhk: Number(form.bhk),
      trustScore: 70,
      verification: "Silver",
      status: "pending",
    };
    setListings((rows) => [newListing, ...rows]);
    setForm({ title: "", city: "", price: "", bhk: "2" });
    setOpen(false);
    toast.success("Listing submitted for verification");
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-6 md:py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Broker workspace
          </p>
          <h1 className="font-serif text-3xl font-bold text-navy md:text-4xl">
            Portfolio Overview
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/report/compare">
            <Button variant="outline" className="border-navy text-navy">
              <BarChart3 className="mr-1.5 h-3 w-3" /> Compare
            </Button>
          </Link>
          <Link to="/listings/browse">
            <Button variant="outline" className="border-navy text-navy">
              <HomeIcon className="mr-1.5 h-3 w-3" /> Browse Rentals
            </Button>
          </Link>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gold text-navy hover:bg-gold/90">
                <Plus className="mr-1.5 h-4 w-4" /> Add Listing
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-serif">
                  Add a new listing
                </DialogTitle>
                <DialogDescription>
                  Provide basic details. Full verification runs automatically
                  after submission.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="e.g. Skyline Loft Residence"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price / month</Label>
                    <Input
                      id="price"
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      placeholder="3200"
                    />
                  </div>
                </div>
                <div>
                  <Label>BHK</Label>
                  <Select
                    value={form.bhk}
                    onValueChange={(v) => setForm({ ...form, bhk: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["1", "2", "3", "4"].map((n) => (
                        <SelectItem key={n} value={n}>
                          {n} BHK
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleAddListing}
                  className="bg-navy text-primary-foreground hover:bg-navy/90"
                >
                  Submit for Verification
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        {STATS.map((s) => (
          <Card key={s.label} className="border-border">
            <CardContent className="p-4">
              <div className={`inline-flex rounded-md p-1.5 ${s.tone}`}>
                <s.icon className="h-3.5 w-3.5" />
              </div>
              <div className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-1 flex items-end gap-1">
                <span className="font-serif text-2xl font-bold text-navy">
                  {s.value}
                </span>
                {s.delta && (
                  <span className="mb-0.5 inline-flex items-center text-xs font-semibold text-emerald-600">
                    <TrendingUp className="h-3 w-3" /> {s.delta}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Portfolio chart */}
      <Card className="border-border">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-semibold">
                Portfolio Performance
              </h2>
              <p className="text-xs text-muted-foreground">
                Views vs contact requests · last 12 months
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">
              <Activity className="h-3 w-3" /> Healthy
            </div>
          </div>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BROKER_MONTHLY} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                  }}
                />

                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  dataKey="views"
                  fill="#0b1f3a"
                  radius={[4, 4, 0, 0]}
                  name="Views"
                />
                <Bar
                  dataKey="requests"
                  fill="#c9a24a"
                  radius={[4, 4, 0, 0]}
                  name="Requests"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Listings table */}
      <Card className="border-border">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h2 className="font-serif text-xl font-semibold">
                Your Listings
              </h2>
              <p className="text-xs text-muted-foreground">
                {listings.length} listings · manage, edit and monitor status
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-emerald-300 bg-emerald-50 text-emerald-700"
            >
              Moderation: clean
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 text-left">Title</th>
                  <th className="px-5 py-3 text-left">City</th>
                  <th className="px-5 py-3 text-left">Price</th>
                  <th className="px-5 py-3 text-left">Tier</th>
                  <th className="px-5 py-3 text-left">Trust</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((l) => (
                  <tr
                    key={l.id}
                    className="border-b border-border last:border-0 hover:bg-secondary/30"
                  >
                    <td className="px-5 py-3 font-medium">{l.title}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {l.city}
                    </td>
                    <td className="px-5 py-3">${l.price.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <VerificationBadge tier={l.verification} />
                    </td>
                    <td className="px-5 py-3">
                      <TrustScore score={l.trustScore} compact />
                    </td>
                    <td className="px-5 py-3">
                      {l.status === "active" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      ) : l.status === "pending" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
                          <Clock className="h-3 w-3" /> Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700">
                          <AlertTriangle className="h-3 w-3" /> Flagged
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link to={`/listings/${l.id}`}>
                        <Button size="sm" variant="ghost" className="text-navy">
                          <Eye className="mr-1 h-3 w-3" /> View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-navy"
                        onClick={() => toast.info("Edit mode coming soon")}
                      >
                        <FileEdit className="mr-1 h-3 w-3" /> Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
