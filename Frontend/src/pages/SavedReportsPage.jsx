/**
 * SavedReportsPage.jsx
 * Fetches saved pincode reports from GET /api/report/saved
 */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookmarkCheck, ExternalLink, Loader2, MapPin, Trash2,
} from "lucide-react";
import { Button } from "@/components/button";
import { reportApi } from "@/lib/api";
import { useAuthStore } from "@/stores";
import { toast } from "sonner";

const GRADE_COLOR = { A: "#059669", B: "#16a34a", C: "#ca8a04", D: "#dc2626", F: "#7f1d1d" };

export default function SavedReportsPage() {
  const navigate       = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [reports,  setReports]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) { navigate("/login?redirect=/report/saved"); return; }
    reportApi.getSavedReports()
      .then(({ data }) => setReports(data.savedReports || []))
      .catch(() => toast.error("Failed to load saved reports"))
      .finally(() => setLoading(false));
  }, [isLoggedIn, navigate]);

  const handleDelete = async (id, pincode) => {
    setDeleting(id);
    try {
      await reportApi.deleteSaved(id);
      setReports((prev) => prev.filter((r) => r._id !== id));
      toast.success(`Removed report for ${pincode}`);
    } catch {
      toast.error("Could not delete report");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            My account
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold">Saved Reports</h1>
        </div>
        <Link to="/report/search">
          <Button className="bg-navy text-primary-foreground hover:bg-navy/90">
            + New report
          </Button>
        </Link>
      </div>

      {/* Empty state */}
      {reports.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-20 text-center">
          <BookmarkCheck className="h-12 w-12 text-muted-foreground/40" />
          <div>
            <h2 className="font-serif text-xl font-semibold">No saved reports yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate a report for any Indian pincode and save it for quick access.
            </p>
          </div>
          <Link to="/report/search">
            <Button className="bg-navy text-primary-foreground hover:bg-navy/90">
              Search a neighborhood
            </Button>
          </Link>
        </div>
      )}

      {/* Reports list */}
      <div className="space-y-3">
        {reports.map((r) => {
          const grade      = Object.entries(r.snapshot?.scores || {})
            .reduce((acc, [, v]) => acc + (v.value || 0), 0) /
            Math.max(Object.keys(r.snapshot?.scores || {}).length, 1);
          const overall = r.snapshot?.overallScore || Math.round(grade);
          return (
            <div
              key={r._id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy/10">
                  <MapPin className="h-5 w-5 text-navy" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg font-bold">Pincode {r.pincode}</span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                      style={{
                        background: GRADE_COLOR[r.snapshot?.grade] + "20",
                        color     : GRADE_COLOR[r.snapshot?.grade],
                      }}
                    >
                      Grade {r.snapshot?.grade || "—"}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {r.snapshot?.district || "—"}, {r.snapshot?.state || "—"}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Overall score: <strong>{r.snapshot?.overallScore ?? "—"}/100</strong>
                    {" · "}Saved {new Date(r.savedAt).toLocaleDateString("en-IN")}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:ml-4">
                <Link to={`/report/result?pincode=${r.pincode}`}>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> View
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleDelete(r._id, r.pincode)}
                  disabled={deleting === r._id}
                >
                  {deleting === r._id
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Trash2 className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
