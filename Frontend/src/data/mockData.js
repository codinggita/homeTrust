import { faker } from "@faker-js/faker";

faker.seed(42);

const LOCATION_SEEDS = [
  {
    name: "Koramangala 4th Block",
    city: "Bengaluru",
    state: "KA",
    lat: 12.9352,
    lon: 77.6245,
    tier: "ELITE",
  },
  {
    name: "Indiranagar",
    city: "Bengaluru",
    state: "KA",
    lat: 12.9784,
    lon: 77.6408,
    tier: "LUXURY",
  },
  {
    name: "Powai",
    city: "Mumbai",
    state: "MH",
    lat: 19.1176,
    lon: 72.906,
    tier: "RENTAL HOTSPOT",
  },
  {
    name: "Connaught Place",
    city: "New Delhi",
    state: "DL",
    lat: 28.6315,
    lon: 77.2167,
    tier: "LUXURY",
  },
  {
    name: "Lincoln Park",
    city: "Chicago",
    state: "IL",
    lat: 41.9214,
    lon: -87.6513,
    tier: "LUXURY",
  },
  {
    name: "West Hollywood",
    city: "Los Angeles",
    state: "CA",
    lat: 34.09,
    lon: -118.3617,
    tier: "RENTAL HOTSPOT",
  },
  {
    name: "Chelsea",
    city: "New York",
    state: "NY",
    lat: 40.7465,
    lon: -74.0014,
    tier: "ELITE",
  },
  {
    name: "Lakeview",
    city: "Chicago",
    state: "IL",
    lat: 41.9436,
    lon: -87.6551,
    tier: "EMERGING",
  },
  {
    name: "Palo Alto",
    city: "Palo Alto",
    state: "CA",
    lat: 37.4419,
    lon: -122.143,
    tier: "ELITE",
  },
  {
    name: "Capitol Hill",
    city: "Seattle",
    state: "WA",
    lat: 47.6253,
    lon: -122.3222,
    tier: "RENTAL HOTSPOT",
  },
];

const PARAM_DEFS = [
  { key: "aqi", label: "Air Quality (AQI)", unit: "AQI" },
  { key: "walkability", label: "Walkability", unit: "/100" },
  { key: "flood", label: "Flood Risk", unit: "risk" },
  { key: "crime", label: "Safety Score", unit: "/100" },
  { key: "noise", label: "Noise Pollution", unit: "dB" },
  { key: "metro", label: "Metro Proximity", unit: "km" },
  { key: "schools", label: "School Rating", unit: "/10" },
  { key: "hospitals", label: "Hospital Access", unit: "/100" },
  { key: "green", label: "Green Cover", unit: "%" },
  { key: "internet", label: "Internet Velocity", unit: "Mbps" },
  { key: "power", label: "Power Reliability", unit: "%" },
];

function scoreToStatus(score) {
  if (score >= 80) return "excellent";
  if (score >= 65) return "good";
  if (score >= 45) return "moderate";
  return "poor";
}

function buildParameters(seed) {
  return PARAM_DEFS.map((p, i) => {
    const score = Math.floor(50 + ((seed * (i + 3)) % 50));
    return {
      key: p.key,
      label: p.label,
      score,
      unit: p.unit,
      status: scoreToStatus(score),
      detail: faker.lorem.sentence(),
    };
  });
}

export const LOCATIONS = LOCATION_SEEDS.map((loc, idx) => {
  const parameters = buildParameters(idx + 7);
  const overall = Math.round(
    parameters.reduce((a, b) => a + b.score, 0) / parameters.length,
  );
  return {
    ...loc,
    id: loc.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    overallScore: overall,
    parameters,
    pros: [
      "Strong transit connectivity",
      "High-quality educational institutions nearby",
      "Low reported crime index",
      "Abundant green spaces and parks",
    ],
    cons: [
      "Rising rental costs",
      "Peak-hour traffic congestion",
      "Limited parking availability",
    ],
  };
});

export function findLocation(query) {
  if (!query) return undefined;
  const q = query.toLowerCase();
  return LOCATIONS.find(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.id === q ||
      l.city.toLowerCase().includes(q),
  );
}

const LISTING_SEEDS = [
  {
    title: "Skyline Vista Penthouse",
    price: 4500,
    verification: "Platinum",
    trustScore: 98,
    bhk: 3,
    area: 1820,
  },
  {
    title: "Industrial Loft Space",
    price: 3200,
    verification: "Silver",
    trustScore: 78,
    bhk: 2,
    area: 1100,
  },
  {
    title: "Upper East Side Suite",
    price: 6800,
    verification: "Platinum",
    trustScore: 95,
    bhk: 2,
    area: 1340,
  },
  {
    title: "Skyline Loft Residence",
    price: 3450,
    verification: "Gold",
    trustScore: 92,
    bhk: 2,
    area: 1240,
  },
  {
    title: "Midtown Garden Flat",
    price: 2750,
    verification: "Gold",
    trustScore: 88,
    bhk: 2,
    area: 980,
  },
  {
    title: "Brickworks Studio",
    price: 1850,
    verification: "Bronze",
    trustScore: 64,
    bhk: 1,
    area: 620,
  },
  {
    title: "Harbor Point Residence",
    price: 5100,
    verification: "Platinum",
    trustScore: 96,
    bhk: 3,
    area: 1680,
  },
  {
    title: "Riverside Compact Home",
    price: 1400,
    verification: "Silver",
    trustScore: 72,
    bhk: 1,
    area: 540,
  },
  {
    title: "Union Square Apartment",
    price: 3900,
    verification: "Gold",
    trustScore: 86,
    bhk: 2,
    area: 1080,
  },
  {
    title: "The Crescent Penthouse",
    price: 8200,
    verification: "Platinum",
    trustScore: 99,
    bhk: 4,
    area: 2400,
  },
  {
    title: "Parkside Terrace",
    price: 2600,
    verification: "Gold",
    trustScore: 84,
    bhk: 2,
    area: 940,
  },
  {
    title: "Bayview Tower Unit",
    price: 4100,
    verification: "Platinum",
    trustScore: 93,
    bhk: 3,
    area: 1520,
  },
  {
    title: "The Ivy Court",
    price: 2200,
    verification: "Silver",
    trustScore: 70,
    bhk: 1,
    area: 680,
  },
  {
    title: "Greenwich Loft",
    price: 5500,
    verification: "Platinum",
    trustScore: 97,
    bhk: 2,
    area: 1410,
  },
  {
    title: "Cedar Lane Cottage",
    price: 1750,
    verification: "Bronze",
    trustScore: 60,
    bhk: 1,
    area: 580,
  },
  {
    title: "Hilltop Residences",
    price: 3300,
    verification: "Gold",
    trustScore: 87,
    bhk: 2,
    area: 1150,
  },
  {
    title: "Orchid Gardens",
    price: 2900,
    verification: "Gold",
    trustScore: 82,
    bhk: 2,
    area: 1020,
  },
  {
    title: "Eastern Quarter Flat",
    price: 2050,
    verification: "Silver",
    trustScore: 74,
    bhk: 1,
    area: 720,
  },
  {
    title: "Monarch Heights",
    price: 6200,
    verification: "Platinum",
    trustScore: 94,
    bhk: 3,
    area: 1770,
  },
  {
    title: "Atlas Garden Home",
    price: 3800,
    verification: "Gold",
    trustScore: 89,
    bhk: 3,
    area: 1390,
  },
];

const BROKERS = [
  "Marcus Thorne",
  "Alexandra Reyes",
  "Sarah Jenkins",
  "David Lee",
  "Priya Raman",
  "Jonathan Pierce",
  "Isabella Moreno",
  "Kenji Tanaka",
];

const CITIES = [
  "New York",
  "Chicago",
  "Los Angeles",
  "San Francisco",
  "Miami",
  "Seattle",
  "Bengaluru",
  "Mumbai",
];

const TAG_POOL = [
  "Pet Friendly",
  "Tech Hub",
  "High Safety",
  "Quiet Nights",
  "Near Metro",
  "Rooftop",
  "Gym",
  "Parking",
];

function rentHistory(base) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months.map((m, i) => ({
    month: m,
    value: Math.round(base * (0.9 + Math.sin(i / 2) * 0.06 + i * 0.008)),
  }));
}

export const LISTINGS = LISTING_SEEDS.map((l, i) => {
  const city = CITIES[i % CITIES.length];
  return {
    id: `lst-${1000 + i}`,
    title: l.title,
    address: `${faker.number.int({ min: 10, max: 9999 })} ${faker.location.street()}, ${city}`,
    city,
    price: l.price,
    bhk: l.bhk ?? 2,
    bath: l.bhk && l.bhk >= 3 ? 3 : 2,
    area: l.area ?? 1000,
    furnishing:
      i % 3 === 0
        ? "Furnished"
        : i % 3 === 1
          ? "Semi-furnished"
          : "Unfurnished",
    imageColor: ["#1e3a5f", "#2d4a6b", "#0f2744", "#3b5a7d", "#162d4a"][i % 5],
    verification: l.verification,
    trustScore: l.trustScore,
    brokerName: BROKERS[i % BROKERS.length],
    brokerRating: 4.4 + ((i * 13) % 6) / 10,
    brokerReviews: 40 + ((i * 37) % 180),
    walkScore: 70 + ((i * 11) % 30),
    transitScore: 68 + ((i * 17) % 32),
    tags: [
      TAG_POOL[i % TAG_POOL.length],
      TAG_POOL[(i + 2) % TAG_POOL.length],
      TAG_POOL[(i + 4) % TAG_POOL.length],
    ],
    lat: 40.7 + ((i * 0.013) % 0.3),
    lon: -74 + ((i * 0.021) % 0.3),
    rentHistory: rentHistory(l.price),
  };
});

export const SAVED_REPORTS = [
  {
    id: "lincoln-park",
    location: "Lincoln Park",
    city: "Chicago",
    savedAt: "2d ago",
    badge: "LUXURY TIER",
    overallScore: 88,
    summary: "Strong transit, elite schools, and premium green cover.",
  },
  {
    id: "west-hollywood",
    location: "West Hollywood",
    city: "Los Angeles",
    savedAt: "5d ago",
    badge: "RENTAL HOTSPOT",
    overallScore: 82,
    summary: "Walkable neighborhood with high rental demand.",
  },
  {
    id: "chelsea",
    location: "Chelsea",
    city: "New York",
    savedAt: "1w ago",
    badge: "ELITE ADVISOR PICK",
    overallScore: 91,
    summary: "Premium enclave with institutional-grade infrastructure.",
  },
];

export const FLAGGED_LISTINGS = [
  {
    id: "f-882",
    address: "882 Westview Ave",
    listedBy: "Prime Estates",
    reportedBy: "jdoe_42",
    reason: "DUPLICATE LISTING",
    risk: 85,
    submittedAt: "2h ago",
  },
  {
    id: "f-012",
    address: "12 Skyview Terr",
    listedBy: "CityRentals",
    reportedBy: "Anonymous",
    reason: "INCORRECT PHOTOS",
    risk: 15,
    submittedAt: "6h ago",
  },
];

export const VERIFICATION_QUEUE = [
  { id: "v-1", name: "Alex Sterling", tier: "Platinum", submittedAt: "2h ago" },
  { id: "v-2", name: "Sarah Jenkins", tier: "Gold", submittedAt: "5h ago" },
  { id: "v-3", name: "Michael Chen", tier: "Silver", submittedAt: "1d ago" },
];

export const FAKE_CITY_TREND = [
  { city: "NY", actual: 182, prior: 210 },
  { city: "SF", actual: 96, prior: 128 },
  { city: "LA", actual: 141, prior: 160 },
  { city: "CHI", actual: 74, prior: 88 },
  { city: "MIA", actual: 112, prior: 132 },
];

export const BROKER_MONTHLY = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
].map((m, i) => ({
  month: m,
  views: 400 + ((i * 73) % 600),
  requests: 60 + ((i * 29) % 120),
  contacts: 28 + ((i * 17) % 60),
}));

export const TESTIMONIALS = [
  {
    name: "Sarah Kendrick",
    role: "Relocating to Chicago",
    quote:
      "HomeTrust's reports caught a neighborhood noise issue we would have missed. Saved us from a regret move.",
    stars: 5,
  },
  {
    name: "Marcus Jones",
    role: "First-time renter",
    quote:
      "The verification badges actually mean something. I felt safe signing my lease without the usual scam anxiety.",
    stars: 5,
  },
  {
    name: "David Lee",
    role: "Institutional analyst",
    quote:
      "Genuinely institutional-grade data – comparable to what we pay six figures for at the fund.",
    stars: 5,
  },
];

export function delay(value, ms = 500) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
