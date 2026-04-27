import { Link } from "react-router-dom";
import {
  Users,
  ShieldCheck,
  FileText,
  AlertTriangle,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";

const pendingVerifications = [
  { id: "v1", name: "Suresh Kumar", category: "Plumber", date: "2 hours ago" },
  {
    id: "v2",
    name: "Meena Electricals",
    category: "Electrician",
    date: "5 hours ago",
  },
  { id: "v3", name: "Ashok Painters", category: "Painter", date: "1 day ago" },
];

const recentReports = [
  {
    id: "r1",
    type: "Spam listing",
    target: "ABC Plumbing",
    severity: "medium",
  },
  {
    id: "r2",
    type: "Fake reviews",
    target: "Pro Electricals",
    severity: "high",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      <div className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor and moderate platform activity
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon={Users}
            label="Total users"
            value="12,450"
            trend="+234"
          />
          <StatCard
            icon={ShieldCheck}
            label="Verified providers"
            value="1,823"
            trend="+18"
          />
          <StatCard
            icon={FileText}
            label="Reports generated"
            value="8,910"
            trend="+412"
          />
          <StatCard
            icon={AlertTriangle}
            label="Pending issues"
            value="14"
            trend="-3"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <CardTitle className="text-base">Pending verifications</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/verifications">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingVerifications.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between border rounded-md p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{v.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {v.category} · {v.date}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent"
                    >
                      Reject
                    </Button>
                    <Button size="sm">Approve</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Flagged content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentReports.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between border rounded-md p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{r.target}</p>
                    <p className="text-xs text-muted-foreground">{r.type}</p>
                  </div>
                  <Badge
                    variant={
                      r.severity === "high" ? "destructive" : "secondary"
                    }
                    className="text-xs capitalize"
                  >
                    {r.severity}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Platform activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end gap-2">
              {[45, 62, 38, 78, 92, 55, 88, 72, 68, 85, 95, 80].map((v, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary/80 rounded-t-sm hover:bg-primary transition-colors"
                  style={{ height: `${v}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Jan</span>
              <span>Dec</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <AdminLink to="/admin/users" icon={Users} label="Users" />
          <AdminLink
            to="/admin/verifications"
            icon={ShieldCheck}
            label="Verifications"
          />
          <AdminLink to="/admin/reports" icon={FileText} label="Reports" />
          <AdminLink to="/admin/localities" icon={MapPin} label="Localities" />
          <AdminLink
            to="/admin/moderation"
            icon={AlertTriangle}
            label="Moderation"
          />
          <AdminLink
            to="/admin/analytics"
            icon={TrendingUp}
            label="Analytics"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-bold mt-1">{value}</p>
            <p className="text-xs text-primary mt-1">{trend}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AdminLink({ to, icon: Icon, label }) {
  return (
    <Link to={to}>
      <Card className="hover:border-primary/50 transition-colors">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <span className="font-medium text-sm">{label}</span>
        </CardContent>
      </Card>
    </Link>
  );
}
