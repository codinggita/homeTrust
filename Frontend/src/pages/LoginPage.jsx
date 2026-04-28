import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Home, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { useAuthStore } from "@/stores";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

export default function LoginPage() {
  const [params]  = useSearchParams();
  const redirect  = params.get("redirect") || "/";
  const navigate  = useNavigate();
  const loginStore = useAuthStore((s) => s.login);

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");
    if (!password) return toast.error("Password is required");

    setLoading(true);
    try {
      const { data } = await authApi.login({ email, password });
      loginStore(data.token, data.user);
      toast.success(`Welcome back to HomeTrust!`);
      // Route based on role
      const dest =
        data.user.role === "admin"   ? "/admin/dashboard" :
        data.user.role === "broker"  ? "/broker/dashboard" :
        redirect;
      navigate(dest, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid email or password.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Left branding panel */}
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
            Sign in to save neighborhood reports, compare localities, and access
            verified rental inventory with broker trust scores.
          </p>
          <div className="mt-8 flex items-center gap-2 text-xs text-primary-foreground/70">
            <ShieldCheck className="h-4 w-4 text-gold" />
            Institutional-grade data · AI moderated · Always free
          </div>
        </div>
        <p className="text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} HomeTrust
        </p>
      </aside>

      {/* Right: form */}
      <section className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-navy">
                <Home className="h-4 w-4 text-gold" />
              </div>
              <span className="font-serif text-lg font-bold text-navy">
                Home<span className="text-gold">Trust</span>
              </span>
            </Link>
          </div>

          <h1 className="font-serif text-3xl font-bold">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Use the credentials you registered with.
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-navy hover:text-navy/80"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-navy text-primary-foreground hover:bg-navy/90"
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-4 rounded-lg border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
            <strong className="text-foreground">Demo credentials:</strong><br />
            Buyer: test.buyer@hometrust.in / Secure@1234<br />
            Broker: test.broker@hometrust.in / Secure@1234
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to HomeTrust?{" "}
            <Link to="/signup" className="font-semibold text-navy hover:text-navy/80">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
