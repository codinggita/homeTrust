import { cn } from "@/lib/utils";

export function trustColor(score) {
  if (score >= 90) return "text-emerald-600 bg-emerald-50 ring-emerald-100";
  if (score >= 75) return "text-amber-700 bg-amber-50 ring-amber-100";
  if (score >= 60) return "text-orange-700 bg-orange-50 ring-orange-100";
  return "text-destructive bg-destructive/10 ring-destructive/20";
}

export default function TrustScore({ score, compact }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md font-semibold ring-1",
        trustColor(score),
        compact ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-1 text-xs",
      )}
    >
      <span className="font-mono">{score}</span>
      <span className="text-[10px] uppercase tracking-wide opacity-70">
        Trust
      </span>
    </div>
  );
}
