import { Award, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const TIER_STYLES = {
  Platinum: {
    bg: "bg-slate-900",
    fg: "text-slate-100",
    ring: "ring-slate-900/20",
    label: "PLATINUM",
  },
  Gold: {
    bg: "bg-amber-400",
    fg: "text-amber-950",
    ring: "ring-amber-400/30",
    label: "GOLD",
  },
  Silver: {
    bg: "bg-zinc-300",
    fg: "text-zinc-800",
    ring: "ring-zinc-300/30",
    label: "SILVER",
  },
  Bronze: {
    bg: "bg-amber-700",
    fg: "text-amber-50",
    ring: "ring-amber-700/30",
    label: "BRONZE",
  },
};

export default function VerificationBadge({ tier, size = "sm" }) {
  const s = TIER_STYLES[tier];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-wide ring-1",
        s.bg,
        s.fg,
        s.ring,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
      )}
    >
      {tier === "Platinum" || tier === "Gold" ? (
        <Award className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      ) : (
        <ShieldCheck className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      )}
      {s.label}
    </span>
  );
}
