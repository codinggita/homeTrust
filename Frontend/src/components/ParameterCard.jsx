import { useState } from "react";
import {
  Activity,
  ChevronDown,
  Droplets,
  Gauge,
  Leaf,
  Radio,
  School,
  ShieldAlert,
  Stethoscope,
  Train,
  Volume2,
  Wifi,
  Wind,
  Zap,
} from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";

const ICONS = {
  // mock keys
  aqi: Wind,
  walkability: Activity,
  flood: Droplets,
  crime: ShieldAlert,
  noise: Volume2,
  metro: Train,
  schools: School,
  hospitals: Stethoscope,
  green: Leaf,
  internet: Wifi,
  power: Zap,
  // real backend keys
  floodRisk      : Droplets,
  safety         : ShieldAlert,
  metroProximity : Train,
  schoolRating   : School,
  hospitalAccess : Stethoscope,
  greenCover     : Leaf,
  internetSpeed  : Wifi,
  powerReliability: Zap,
};

const STATUS_COLOR = {
  excellent: "text-emerald-600 bg-emerald-50",
  good: "text-sky-700 bg-sky-50",
  moderate: "text-amber-700 bg-amber-50",
  poor: "text-destructive bg-destructive/10",
};

const AIR_CHART = [
  { time: "06:00", PM25: 22, PM10: 34, NO2: 18 },
  { time: "09:00", PM25: 28, PM10: 41, NO2: 22 },
  { time: "12:00", PM25: 25, PM10: 38, NO2: 19 },
  { time: "15:00", PM25: 30, PM10: 45, NO2: 24 },
  { time: "18:00", PM25: 34, PM10: 52, NO2: 28 },
  { time: "21:00", PM25: 26, PM10: 39, NO2: 20 },
];

export default function ParameterCard({ p, onShowOnMap }) {
  const [open, setOpen] = useState(false);
  const Icon = ICONS[p.key] ?? Gauge;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card transition",
        open && "ring-2 ring-gold/30",
      )}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className={cn("rounded-lg p-2", STATUS_COLOR[p.status])}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">{p.label}</div>
            <div className="text-xs text-muted-foreground capitalize">
              {p.label2 || p.status}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-mono text-lg font-bold text-navy">
              {p.score}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {p.unit ?? "/100"}
            </div>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-border bg-secondary/30 px-4 py-5">
          {p.key === "aqi" ? (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Environmental Metrics
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last updated: 6 min ago · Station North Beverly Hills
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { k: "AQI", v: p.score, u: "Good" },
                    { k: "PM2.5", v: 24, u: "µg/m³" },
                    { k: "PM10", v: 39, u: "µg/m³" },
                    { k: "NO₂", v: 22, u: "ppb" },
                  ].map((s) => (
                    <div key={s.k} className="rounded-lg bg-background p-3">
                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {s.k}
                      </div>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-xl font-semibold">{s.v}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {s.u}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-gold/10 p-3 text-sm">
                <span className="font-semibold text-navy">Recommendation:</span>{" "}
                <span className="text-muted-foreground">
                  Safe for outdoor activity all day. Sensitive groups should
                  limit exertion after 6 PM when PM2.5 trends upward.
                </span>
              </div>

              <div className="h-48 rounded-lg border border-border bg-background p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={AIR_CHART}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="time" fontSize={10} stroke="#64748b" />
                    <YAxis fontSize={10} stroke="#64748b" />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line
                      type="monotone"
                      dataKey="PM25"
                      stroke="#0b3c5d"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="PM10"
                      stroke="#b08a2c"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="NO2"
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { k: "Humidity", v: "58%" },
                  { k: "Wind", v: "9 km/h" },
                  { k: "Visibility", v: "12 km" },
                  { k: "UV Index", v: "5 / Mod" },
                ].map((o) => (
                  <div
                    key={o.k}
                    className="rounded-md border border-border bg-background p-2 text-center"
                  >
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {o.k}
                    </div>
                    <div className="text-sm font-semibold">{o.v}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Radio className="hidden h-4 w-4 text-muted-foreground sm:block" />
                <p className="text-xs text-muted-foreground">
                  Data provided by open government AQ stations · refreshed every
                  15 minutes.
                </p>
                <Button size="sm" variant="outline" onClick={onShowOnMap}>
                  Show on map
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.detail}
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { k: "City avg", v: Math.max(0, p.score - 12) },
                  { k: "This area", v: p.score },
                  { k: "Top 10%", v: Math.min(100, p.score + 10) },
                ].map((s) => (
                  <div key={s.k} className="rounded-md bg-background p-3">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {s.k}
                    </div>
                    <div className="text-lg font-semibold">{s.v}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Trusted data source · last audit 2 days ago
                </span>
                <Button size="sm" variant="outline" onClick={onShowOnMap}>
                  Show on map
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
