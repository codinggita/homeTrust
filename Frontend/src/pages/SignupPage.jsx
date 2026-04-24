import { Link, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores";
import { toast } from "sonner";

export default function SignupPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [role, setRole] = useState("buyer");
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Fill all fields");
    setLoading(true);
    setTimeout(() => {
      login(form.email, role);
      toast.success("Account created");
      setLoading(false);
      navigate("/");
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
            Join the verified marketplace.
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/70">
            Free forever. No premium tiers. Create an account to save
            neighborhoods, list rentals, or moderate the platform.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} HomeTrust
        </p>
      </aside>

      <section className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <h1 className="font-serif text-3xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All features are 100% free.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Alexander Sterling"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimum 8 characters"
              />
            </div>
            <div className="space-y-2">
              <Label>I'm signing up as</Label>
              <div className="grid grid-cols-3 gap-2">
                {["buyer", "broker", "admin"].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className={`rounded-md border px-3 py-2 text-xs font-semibold uppercase tracking-wide ${
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
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-navy text-primary-foreground hover:bg-navy/90"
            >
              {loading ? "Creating account..." : "Create free account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-navy hover:text-navy/80"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
