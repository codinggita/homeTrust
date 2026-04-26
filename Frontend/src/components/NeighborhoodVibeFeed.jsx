import { useState } from "react";
import { MessageSquare, ThumbsUp, MapPin, UserCheck, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/avatar";

const MOCK_REVIEWS = [
  { id: 1, user: "Sarah J.", role: "Resident (2 yrs)", text: "Very quiet at night, but the new cafe on 5th street gets busy on weekends. Great for families.", helpful: 12, category: "Lifestyle" },
  { id: 2, user: "Michael T.", role: "Resident (5 yrs)", text: "Street parking can be tough after 7PM. Otherwise, very safe and clean neighborhood.", helpful: 8, category: "Parking" },
  { id: 3, user: "Elena R.", role: "Verified Broker", text: "Property values here have stabilized, making it a great time for long-term rentals.", helpful: 24, category: "Market" }
];

export default function NeighborhoodVibeFeed({ location = "Oak Ridge" }) {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-6">
      <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-indigo-600" />
          <h3 className="font-serif text-xl font-semibold">Community Vibe & Insights</h3>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md">
          <Shield className="h-3 w-3" /> Moderated Feed
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-lg border border-border bg-secondary/30 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {r.user.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-foreground">{r.user}</span>
                    {r.role.includes("Verified") || r.role.includes("Resident") ? (
                      <UserCheck className="h-3 w-3 text-emerald-600" />
                    ) : null}
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {location} • {r.role}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white border border-border px-2 py-0.5 rounded-full text-muted-foreground">
                {r.category}
              </span>
            </div>
            <p className="mt-3 text-sm text-foreground/80 leading-relaxed">
              "{r.text}"
            </p>
            <div className="mt-3 flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-indigo-600 transition-colors">
                <ThumbsUp className="h-4 w-4" /> {r.helpful} Helpful
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-4 w-full rounded-lg border border-border border-dashed py-3 text-sm font-semibold text-muted-foreground hover:bg-secondary/50 transition-colors">
        + Add an Insight
      </button>
    </div>
  );
}
