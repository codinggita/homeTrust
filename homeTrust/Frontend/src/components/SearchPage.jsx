import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  MapPin, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Navigation 
} from "lucide-react";
import { Button, Card, CardContent } from "./UI";

const TRENDING_LOCATIONS = [
  { name: "Lincoln Park", city: "Chicago", score: "A+" },
  { name: "Greenwich Village", city: "New York", score: "A" },
  { name: "Santa Monica", city: "Los Angeles", score: "A+" },
  { name: "Back Bay", city: "Boston", score: "A-" },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

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
            <Link to="/listings/browse" className="text-sm font-medium hover:text-navy">Find Rentals</Link>
            <Button variant="outline" size="sm">Log In</Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold md:text-5xl mb-4 text-navy">
            Neighborhood Quality Reports
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get instant, institutional-grade data on safety, transit, air quality, and more for any locality.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative group max-w-2xl mx-auto mb-16">
          <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter neighborhood or city name..."
              className="w-full h-14 pl-12 pr-32 rounded-2xl border border-border bg-background shadow-lg focus:ring-2 focus:ring-navy focus:border-transparent outline-none transition-all text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Link 
              to={`/report/result?location=${searchQuery.toLowerCase().replace(/\s+/g, '-')}`}
              className="absolute right-2"
            >
              <Button className="bg-navy text-primary-foreground h-10 px-6 rounded-xl">
                Search
              </Button>
            </Link>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Navigation className="h-3.5 w-3.5" />
            <span>Try searching "Lincoln Park" or "Austin, TX"</span>
          </div>
        </div>

        {/* Trending Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-2xl font-bold text-navy">Trending Locations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TRENDING_LOCATIONS.map((loc) => (
              <Link key={loc.name} to={`/report/result?location=${loc.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <Card className="hover:border-gold/50 transition-colors group">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-secondary p-3 rounded-xl group-hover:bg-gold/10 transition-colors">
                        <MapPin className="h-6 w-6 text-navy" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{loc.name}</h3>
                        <p className="text-sm text-muted-foreground">{loc.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Score</div>
                        <div className="text-xl font-bold text-navy">{loc.score}</div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
