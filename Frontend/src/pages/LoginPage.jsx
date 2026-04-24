import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Home, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores";
import { toast } from "sonner";

export default function LoginPage() {
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/";
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");
    setLoading(true);
    setTimeout(() => {
      login(email, role);
      toast.success("Welcome back to HomeTrust");
      setLoading(false);
      navigate(redirect);
    }, 400);
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <aside className="hidden gradient-navy p-10 text-primary-foreground md:flex md:flex-col md:justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gold">
            <Home className="h-4 w-4 text-navy" />
          </div>
          <span className="font-serif text-lg font-bold">
            Home<span className="text-gold">Trust</span>
          </span>
        </Link>
        <div className="max-w-md">
          <h2 className="font-serif text-3xl font-bold">
            Free intelligence. Verified listings.
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/70">
            Sign in to save reports, compare localities, and access verified
            rental inventory with broker trust scores.
          </p>
          <div className="mt-8 flex items-center gap-2 text-xs text-primary-foreground/70">
            <ShieldCheck className="h-4 w-4 text-gold" /> Institutional-grade
            data · AI moderated
          </div>
        </div>
        <p className="text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} HomeTrust
        </p>
      </aside>

      <section className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="md:hidden">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-navy">
                <Home className="h-4 w-4 text-gold" />
              </div>
              <span className="font-serif text-lg font-bold text-navy">
                Home<span className="text-gold">Trust</span>
              </span>
            </Link>
          </div>
          <h1 className="mt-6 font-serif text-3xl font-bold">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter any email to continue (demo only).
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label>Sign in as</Label>
              <div className="grid grid-cols-3 gap-2">
                {["buyer", "broker", "admin"].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className={`rounded-md border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                      role === r
                        ? "border-navy bg-navy text-primary-foreground"
                        : "border-border bg-background hover:border-navy/40"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-border"
                />{" "}
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="font-medium text-navy hover:text-navy/80"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-navy text-primary-foreground hover:bg-navy/90"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to HomeTrust?{" "}
            <Link
              to="/signup"
              className="font-semibold text-navy hover:text-navy/80"
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
