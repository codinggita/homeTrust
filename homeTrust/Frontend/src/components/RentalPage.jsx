import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  CheckCircle2, 
  Star,
  ChevronDown
} from "lucide-react";
import { Button, Card, CardContent } from "./UI";

const MOCK_LISTINGS = [
  {
    id: 1,
    title: "Modern Loft in Lincoln Park",
    location: "Lincoln Park, Chicago",
    price: "$2,450",
    beds: 2,
    baths: 2,
    sqft: 1100,
    verified: true,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400",
    tags: ["No Broker Fee", "Pet Friendly"]
  },
  {
    id: 2,
    title: "Luxury Condo with City Views",
    location: "River North, Chicago",
    price: "$3,100",
    beds: 1,
    baths: 1,
    sqft: 850,
    verified: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400",
    tags: ["Gym Access", "24/7 Concierge"]
  },
  {
    id: 3,
    title: "Renovated Townhouse",
    location: "Wicker Park, Chicago",
    price: "$2,800",
    beds: 3,
    baths: 2,
    sqft: 1400,
    verified: true,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=400",
    tags: ["Backyard", "Hardwood Floors"]
  }
];

export default function RentalPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header/Navigation */}
      <nav className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-navy p-1.5 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-gold" />
            </div>
            <span className="font-serif text-xl font-bold text-navy">HomeTrust</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/report/search" className="text-sm font-medium hover:text-navy">Neighborhood Reports</Link>
            <Button variant="outline" size="sm">Log In</Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="font-serif text-3xl font-bold text-navy mb-2">Verified Rentals</h1>
            <p className="text-muted-foreground">Browse scam-free listings with verified landlords and trust scores.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
            <Button className="bg-navy text-primary-foreground gap-2">
              <MapPin className="h-4 w-4" /> Map View
            </Button>
          </div>
        </div>

        {/* Search & Quick Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters (Hidden on mobile for brevity) */}
          <aside className="hidden lg:block space-y-8">
            <div>
              <h3 className="font-bold mb-4">Price Range</h3>
              <div className="space-y-3">
                {["Any", "$0 - $1,500", "$1,500 - $2,500", "$2,500 - $4,000", "$4,000+"].map(range => (
                  <label key={range} className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="price" className="accent-navy" defaultChecked={range === "Any"} />
                    <span className="text-sm group-hover:text-navy transition-colors">{range}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Bedrooms</h3>
              <div className="flex flex-wrap gap-2">
                {["Studio", "1", "2", "3", "4+"].map(bed => (
                  <button key={bed} className="px-3 py-1.5 border rounded-md text-sm hover:border-navy hover:text-navy transition-colors">
                    {bed}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Listings Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_LISTINGS.map(listing => (
                <Card key={listing.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={listing.image} 
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {listing.verified && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Verified</span>
                      </div>
                    )}
                    <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:text-red-500 transition-colors">
                      <Star className="h-4 w-4" />
                    </button>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-navy transition-colors">{listing.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {listing.location}
                        </p>
                      </div>
                      <div className="text-xl font-bold text-navy">{listing.price}<span className="text-xs font-normal text-muted-foreground">/mo</span></div>
                    </div>
                    
                    <div className="flex items-center gap-4 my-4 py-3 border-y border-secondary/50">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Bed className="h-4 w-4 text-muted-foreground" />
                        <span>{listing.beds} Bed</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Bath className="h-4 w-4 text-muted-foreground" />
                        <span>{listing.baths} Bath</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Maximize className="h-4 w-4 text-muted-foreground" />
                        <span>{listing.sqft} sqft</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {listing.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-semibold uppercase tracking-wider bg-secondary px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Button className="w-full bg-navy text-primary-foreground hover:bg-navy/90">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" className="px-8">
                Load More Listings
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
