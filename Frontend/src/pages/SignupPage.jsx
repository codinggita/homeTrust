import { Link, useNavigate } from "react-router-dom";
import { Home, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { useAuthStore } from "@/stores";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

export default function SignupPage() {
  const navigate = useNavigate();
  const login    = useAuthStore((s) => s.login);

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", password: "",
    brokerCompany: "",
  });
  const [role, setRole]         = useState("buyer");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.password)
      return toast.error("Please fill all required fields");
    if (form.password.length < 8)
      return toast.error("Password must be at least 8 characters");
    if (!/^[6-9]\d{9}$/.test(form.phone))
      return toast.error("Enter a valid 10-digit Indian mobile number");

    setLoading(true);
    try {
      const payload = { fullName: form.fullName, email: form.email, phone: form.phone, password: form.password, role };
      if (role === "broker" && form.brokerCompany) payload.brokerCompany = form.brokerCompany;

      const { data } = await authApi.signup(payload);
      login(data.token, data.user);
      toast.success("Account created! Welcome to HomeTrust 🎉");
      navigate(role === "broker" ? "/broker/dashboard" : "/");
    } catch (err) {
      const msg = err.response?.data?.details?.[0] || err.response?.data?.error || "Signup failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Left panel */}
      <aside className="hidden gradient-navy p-10 text-primary-foreground md:flex md:flex-col md:justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gold">
            <Home className="h-4 w-4 text-navy" />
          </div>
          <span className="font-serif text-lg font-bold">Home<span className="text-gold">Trust</span></span>
        </Link>
        <div className="max-w-md">
          <h2 className="font-serif text-3xl font-bold">Join the verified marketplace.</h2>
          <p className="mt-3 text-sm text-primary-foreground/70">
            Create a free account to save neighborhoods, list verified rentals, or browse scam-free inventory.
          </p>
          <div className="mt-8 space-y-3">
            {[
              "Save unlimited neighborhood reports",
              "Access verified broker profiles",
              "Get scam-detection alerts",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <ShieldCheck className="h-4 w-4 text-gold flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-primary-foreground/60">© {new Date().getFullYear()} HomeTrust</p>
      </aside>

      {/* Right: form */}
      <section className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-navy">
                <Home className="h-4 w-4 text-gold" />
              </div>
              <span className="font-serif text-lg font-bold text-navy">Home<span className="text-gold">Trust</span></span>
            </Link>
          </div>
          <h1 className="font-serif text-3xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">All features are 100% free. No credit card required.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {/* Role selector */}
            <div className="space-y-2">
              <Label>I'm signing up as</Label>
              <div className="grid grid-cols-2 gap-2">
                {["buyer", "broker"].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className={`rounded-md border px-3 py-2.5 text-xs font-semibold uppercase tracking-wide transition ${
                      role === r
                        ? "border-navy bg-navy text-primary-foreground"
                        : "border-border bg-background hover:border-navy/40"
                    }`}
                  >
                    {r === "buyer" ? "🏠 Buyer / Renter" : "🏢 Broker / Agent"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name *</Label>
                <Input id="fullName" value={form.fullName} onChange={set("fullName")} placeholder="Arjun Sharma" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile number *</Label>
                <Input id="phone" value={form.phone} onChange={set("phone")} placeholder="9876543210" maxLength={10} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
            </div>

            {role === "broker" && (
              <div className="space-y-2">
                <Label htmlFor="company">Company / Agency name</Label>
                <Input id="company" value={form.brokerCompany} onChange={set("brokerCompany")} placeholder="e.g. Patel Realty" />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Minimum 8 characters"
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

            <Button type="submit" disabled={loading} className="w-full bg-navy text-primary-foreground hover:bg-navy/90">
              {loading ? "Creating account…" : "Create free account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-navy hover:text-navy/80">Sign in</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
