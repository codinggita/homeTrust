import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");
    setTimeout(() => {
      setSent(true);
      toast.success("Reset link sent (demo)");
    }, 400);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <Link
          to="/login"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to sign in
        </Link>
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-navy">
            <Home className="h-4 w-4 text-gold" />
          </div>
          <span className="font-serif text-lg font-bold text-navy">
            Home<span className="text-gold">Trust</span>
          </span>
        </div>
        <h1 className="font-serif text-2xl font-bold">Reset your password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your email and we'll send a reset link.
        </p>
        {sent ? (
          <div className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            A reset link was sent to{" "}
            <span className="font-semibold">{email}</span>. Check your inbox.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-navy text-primary-foreground hover:bg-navy/90"
            >
              Send reset link
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
