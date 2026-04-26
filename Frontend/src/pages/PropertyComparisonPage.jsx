import { Link } from "react-router-dom";
import { CheckCircle2, Minus, MapPin, Building2, Ruler, BadgeIndianRupee } from "lucide-react";
import { LISTINGS } from "@/data/mockData";
import { Button } from "@/components/button";

export default function PropertyComparisonPage() {
  // Hardcoded for demo purposes
  const prop1 = LISTINGS[0];
  const prop2 = LISTINGS[1];

  const specs = [
    { label: "Price", icon: BadgeIndianRupee, getValue: (p) => `$${p.price.toLocaleString()}/mo` },
    { label: "Area", icon: Ruler, getValue: (p) => `${p.area} sqft` },
    { label: "Configuration", icon: Building2, getValue: (p) => `${p.bhk} BHK` },
    { label: "Furnishing", icon: CheckCircle2, getValue: (p) => p.furnishing },
    { label: "Broker Rating", icon: CheckCircle2, getValue: (p) => `${p.brokerRating} / 5.0` },
    { label: "Trust Score", icon: ShieldCheckMock, getValue: (p) => p.trustScore },
    { label: "Walk Score", icon: MapPin, getValue: (p) => p.walkScore },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl font-bold text-navy md:text-5xl">Compare Properties</h1>
        <p className="mt-4 text-lg text-muted-foreground">Make the right choice by comparing amenities, specs, and trust scores.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="grid grid-cols-3 border-b border-border bg-secondary/30">
          <div className="p-6 flex items-center justify-center font-serif text-xl font-bold text-navy border-r border-border">
            Features
          </div>
          <div className="p-6 text-center border-r border-border">
            <h3 className="font-bold text-lg">{prop1.title}</h3>
            <p className="text-sm text-muted-foreground">{prop1.address}</p>
            <Button size="sm" className="mt-4 w-full bg-navy text-white hover:bg-navy/90">Request Visit</Button>
          </div>
          <div className="p-6 text-center">
            <h3 className="font-bold text-lg">{prop2.title}</h3>
            <p className="text-sm text-muted-foreground">{prop2.address}</p>
            <Button size="sm" className="mt-4 w-full bg-navy text-white hover:bg-navy/90">Request Visit</Button>
          </div>
        </div>

        <div className="divide-y divide-border">
          {specs.map((spec, i) => (
            <div key={i} className="grid grid-cols-3 hover:bg-secondary/10 transition-colors">
              <div className="p-4 flex items-center gap-3 font-semibold text-foreground border-r border-border bg-secondary/5">
                <spec.icon className="h-5 w-5 text-muted-foreground" />
                {spec.label}
              </div>
              <div className="p-4 text-center font-medium border-r border-border text-navy">
                {spec.getValue(prop1)}
              </div>
              <div className="p-4 text-center font-medium text-navy">
                {spec.getValue(prop2)}
              </div>
            </div>
          ))}

          {/* Pros & Cons Section */}
          <div className="grid grid-cols-3">
            <div className="p-4 flex items-center gap-3 font-semibold text-foreground border-r border-border bg-secondary/5">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Key Highlights
            </div>
            <div className="p-4 border-r border-border">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /> Premium interior finish</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /> High walk score</li>
              </ul>
            </div>
            <div className="p-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /> Better transit connectivity</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /> Larger carpet area</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link to="/listings/browse" className="text-navy hover:underline font-semibold">
          &larr; Back to all listings
        </Link>
      </div>
    </div>
  );
}

function ShieldCheckMock({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
