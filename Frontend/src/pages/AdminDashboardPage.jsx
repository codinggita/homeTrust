/**
 * AdminDashboardPage.jsx
 * Real data from GET /api/admin/* endpoints.
 */
import { useEffect, useState } from "react";
import {
  AlertTriangle, BarChart3, CheckCircle2, Loader2,
  Shield, ShieldOff, Users, X,
} from "lucide-react";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import { Badge } from "@/components/badge";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/dialog";
import { Textarea } from "@/components/textarea";
import { adminApi } from "@/lib/api";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const [analytics,   setAnalytics]   = useState(null);
  const [reports,     setReports]     = useState([]);
  const [queue,       setQueue]       = useState([]);
  const [tab,         setTab]         = useState("reports");
  const [loading,     setLoading]     = useState(true);
  const [resolving,   setResolving]   = useState(null);
  const [verifying,   setVerifying]   = useState(null);
  const [actionModal, setActionModal] = useState(null); // { type:'resolve'|'verify', item }
  const [note,        setNote]        = useState("");

  useEffect(() => {
    Promise.all([
      adminApi.getAnalytics(),
      adminApi.getReported({ status: "pending" }),
      adminApi.getVerificationQueue(),
    ]).then(([a, r, q]) => {
      setAnalytics(a.data);
      setReports(r.data.reports || []);
      setQueue(q.data.listings || []);
    }).catch(() => toast.error("Failed to load admin data"))
      .finally(() => setLoading(false));
  }, []);

  const resolveReport = async (action, strike = false) => {
    const id = actionModal?.item?._id;
    if (!id) return;
    setResolving(id);
    try {
      await adminApi.resolveReport(id, { action, strike, note });
      setReports((prev) => prev.filter((r) => r._id !== id));
      toast.success(`Report ${action === "remove" ? "resolved — listing removed" : "dismissed"}`);
      setActionModal(null);
      setNote("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Action failed");
    } finally {
      setResolving(null);
    }
  };

  const verifyListing = async (id, approve, level) => {
    setVerifying(id);
    try {
      await adminApi.verifyListing(id, { approve, verificationLevel: level || "bronze" });
      setQueue((prev) => prev.filter((l) => l._id !== id));
      toast.success(approve ? "Listing approved ✅" : "Listing rejected");
    } catch (err) {
      toast.error(err.response?.data?.error || "Action failed");
    } finally {
      setVerifying(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-navy" />
      </div>
    );
  }

  const summary = analytics?.summary || {};

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-6 md:py-10">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Admin console</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-navy">Platform Dashboard</h1>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {[
          { label: "Total Listings", value: summary.totalListings ?? "—", Icon: BarChart3,     cls: "bg-navy/10 text-navy" },
          { label: "Total Users",    value: summary.totalUsers    ?? "—", Icon: Users,         cls: "bg-emerald-100 text-emerald-700" },
          { label: "Total Reports",  value: summary.totalReports  ?? "—", Icon: AlertTriangle, cls: "bg-rose-100 text-rose-700" },
        ].map((s) => (
          <Card key={s.label} className="border-border">
            <CardContent className="p-4">
              <div className={`inline-flex rounded-md p-1.5 ${s.cls}`}><s.Icon className="h-3.5 w-3.5" /></div>
              <div className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</div>
              <div className="mt-1 font-serif text-3xl font-bold text-navy">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {[
          { id: "reports", label: `Reported (${reports.length})` },
          { id: "queue",   label: `Verification Queue (${queue.length})` },
          { id: "analytics", label: "Analytics" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id
                ? "border-navy text-navy"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Reported listings */}
      {tab === "reports" && (
        <Card className="border-border">
          <CardContent className="p-0">
            {reports.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-14 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                <p className="font-semibold text-emerald-700">No pending reports!</p>
                <p className="text-sm text-muted-foreground">The platform is clean.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3 text-left">Listing</th>
                      <th className="px-5 py-3 text-left">Reporter</th>
                      <th className="px-5 py-3 text-left">Reason</th>
                      <th className="px-5 py-3 text-left">Date</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r) => (
                      <tr key={r._id} className="border-t border-border hover:bg-secondary/20">
                        <td className="px-5 py-3 font-medium">
                          {r.listingId?.address?.full?.slice(0, 30) || r.listingId?._id?.slice(-6) || "—"}
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">{r.reporterId?.email || "Anonymous"}</td>
                        <td className="px-5 py-3">
                          <Badge variant="outline" className="text-xs">{r.reason}</Badge>
                        </td>
                        <td className="px-5 py-3 text-muted-foreground text-xs">
                          {new Date(r.createdAt).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-muted-foreground hover:text-foreground"
                              onClick={() => { setActionModal({ type: "resolve", item: r, action: "dismiss" }); }}
                              disabled={resolving === r._id}
                            >
                              <X className="h-3 w-3 mr-1" /> Dismiss
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                              onClick={() => { setActionModal({ type: "resolve", item: r, action: "remove" }); }}
                              disabled={resolving === r._id}
                            >
                              <ShieldOff className="h-3 w-3 mr-1" /> Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Verification queue */}
      {tab === "queue" && (
        <Card className="border-border">
          <CardContent className="p-0">
            {queue.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-14 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                <p className="font-semibold text-emerald-700">Queue is empty!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3 text-left">Listing</th>
                      <th className="px-5 py-3 text-left">Broker</th>
                      <th className="px-5 py-3 text-left">Badge</th>
                      <th className="px-5 py-3 text-left">Submitted</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queue.map((l) => (
                      <tr key={l._id} className="border-t border-border hover:bg-secondary/20">
                        <td className="px-5 py-3 font-medium">
                          {l.address?.full?.slice(0, 30) || "—"}
                          <div className="text-xs text-muted-foreground">{l.address?.pincode}</div>
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">{l.brokerId?.profile?.fullName || l.brokerId?.email || "—"}</td>
                        <td className="px-5 py-3 text-xs font-semibold uppercase">{l.brokerId?.brokerDetails?.badgeLevel || "none"}</td>
                        <td className="px-5 py-3 text-muted-foreground text-xs">{new Date(l.createdAt).toLocaleDateString("en-IN")}</td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-rose-600 hover:bg-rose-50"
                              onClick={() => verifyListing(l._id, false)}
                              disabled={verifying === l._id}
                            >
                              <X className="h-3 w-3 mr-1" /> Reject
                            </Button>
                            <Button
                              size="sm"
                              className="bg-emerald-600 text-white hover:bg-emerald-700"
                              onClick={() => verifyListing(l._id, true, l.suggestedVerificationLevel || "bronze")}
                              disabled={verifying === l._id}
                            >
                              {verifying === l._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Shield className="h-3 w-3 mr-1" />}
                              Approve
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Analytics tab */}
      {tab === "analytics" && (
        <div className="space-y-4">
          <Card className="border-border">
            <CardContent className="p-5">
              <h2 className="font-serif text-lg font-semibold mb-4">Fake listing % by pincode</h2>
              {(analytics?.fakePercentageByCity || []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No data yet.</p>
              ) : (
                <div className="space-y-2">
                  {analytics.fakePercentageByCity.map((c) => (
                    <div key={c.city} className="flex items-center gap-3">
                      <span className="w-20 text-xs font-mono">{c.city}</span>
                      <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                        <div
                          className="h-full bg-rose-500 rounded-full transition-all"
                          style={{ width: `${Math.min(c.percentage, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-rose-600 w-12 text-right">{c.percentage}%</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-5">
              <h2 className="font-serif text-lg font-semibold mb-4">Top offending brokers</h2>
              {(analytics?.topOffendingBrokers || []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No offending brokers.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="py-2 text-left">Broker</th>
                        <th className="py-2 text-left">Strikes</th>
                        <th className="py-2 text-left">Fake listings</th>
                        <th className="py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.topOffendingBrokers.map((b) => (
                        <tr key={b._id} className="border-t border-border">
                          <td className="py-2 font-medium">{b.brokerName || b.email}</td>
                          <td className="py-2 text-rose-600 font-semibold">{b.strikes}</td>
                          <td className="py-2 text-muted-foreground">{b.fakeListings}</td>
                          <td className="py-2">
                            {b.isSuspended
                              ? <Badge variant="destructive">Suspended</Badge>
                              : <Badge variant="outline">Active</Badge>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action confirmation dialog */}
      <Dialog open={!!actionModal} onOpenChange={() => { setActionModal(null); setNote(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">
              {actionModal?.action === "remove" ? "Remove listing" : "Dismiss report"}
            </DialogTitle>
            <DialogDescription>
              {actionModal?.action === "remove"
                ? "This will permanently remove the listing and optionally issue a strike to the broker."
                : "This will mark the report as dismissed — no action taken on the listing."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Admin note (optional)</label>
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason for this decision…" className="mt-1" rows={3} />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setActionModal(null); setNote(""); }}>Cancel</Button>
            <Button
              className={actionModal?.action === "remove" ? "bg-rose-600 text-white hover:bg-rose-700" : "bg-navy text-white hover:bg-navy/90"}
              onClick={() => resolveReport(actionModal?.action, actionModal?.action === "remove")}
              disabled={!!resolving}
            >
              {resolving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
