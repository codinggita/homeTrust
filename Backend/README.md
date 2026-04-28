# HomeTrust Backend

> Production-ready Node.js + Express + MongoDB backend for the HomeTrust real estate platform.

---

## 🏗️ Architecture Overview

```
Backend/
├── server.js                   ← Express app entry point
├── config/
│   ├── db.js                   ← MongoDB Atlas connection
│   ├── cloudinary.js           ← Cloudinary SDK + upload helper
│   ├── logger.js               ← Winston logger
│   └── rateLimiter.js          ← express-rate-limit presets
├── models/                     ← Mongoose schemas
│   ├── User.js
│   ├── Pincode.js              ← read-only (existing Atlas collection)
│   ├── NeighborhoodScore.js    ← TTL cache (24h)
│   ├── Listing.js
│   ├── ReportedListing.js
│   ├── SavedReport.js
│   └── BrokerStat.js
├── services/                   ← Scoring engine (11 metrics)
│   ├── scoringOrchestrator.js
│   ├── aqiService.js
│   ├── walkabilityService.js
│   ├── floodRiskService.js
│   ├── crimeService.js
│   ├── noiseService.js
│   ├── metroService.js
│   ├── schoolRatingService.js
│   ├── hospitalAccessService.js
│   ├── greenCoverService.js
│   ├── internetSpeedService.js
│   └── powerReliabilityService.js
├── controllers/
│   ├── authController.js
│   ├── reportController.js
│   ├── listingController.js
│   ├── brokerController.js
│   └── adminController.js
├── routes/
│   ├── authRoutes.js
│   ├── reportRoutes.js
│   ├── listingRoutes.js
│   ├── brokerRoutes.js
│   └── adminRoutes.js
├── middleware/
│   ├── auth.js                 ← JWT + RBAC
│   ├── errorHandler.js         ← Central error handler
│   ├── validation.js           ← Joi schemas
│   └── upload.js               ← Multer presets
└── utils/
    ├── helpers.js              ← Label map, Haversine, Overpass wrapper
    └── district_crime.json     ← 30-district NCRB sample dataset
```

---

## 🚀 Quick Start

### 1. Prerequisites

- Node.js **v20+** (`node -v`)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- A free [Cloudinary](https://cloudinary.com/) account
- A free [OpenWeatherMap](https://openweathermap.org/api) API key

### 2. Install dependencies

```bash
cd Backend
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Open `.env` and fill in:

| Variable | Where to get it |
|---|---|
| `MONGODB_URI` | Atlas Dashboard → Connect → Drivers |
| `JWT_SECRET` | Run: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `CLOUDINARY_CLOUD_NAME` / `API_KEY` / `API_SECRET` | Cloudinary Dashboard → API Keys |
| `OPENWEATHER_API_KEY` | [openweathermap.org](https://openweathermap.org/) → My API Keys (activation ~2h) |

### 4. Start the dev server

```bash
npm run dev
```

The server starts on `http://localhost:5000`.

**Health check:** `GET http://localhost:5000/health`

---

## 🔐 Authentication

All protected endpoints require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <token_from_login>
```

### Roles
| Role | Capabilities |
|---|---|
| `buyer` | Browse listings, save reports, report listings |
| `broker` | Create/manage listings, upload KYC docs, view dashboard |
| `admin` | Moderate reports, approve verification badges, view analytics |

---

## 📡 API Reference

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | — | Register a new user |
| POST | `/api/auth/login` | — | Login, receive JWT |
| GET | `/api/auth/me` | Any | Get own profile |

**Signup body:**
```json
{
  "email": "user@example.com",
  "password": "securepass123",
  "role": "buyer",
  "fullName": "Arjun Sharma",
  "phone": "9876543210",
  "brokerCompany": "Sharma Realty"
}
```

---

### Neighbourhood Reports

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/report/:pincode` | — | Get scores for a pincode |
| POST | `/api/report/compare` | — | Compare 2-3 pincodes |
| POST | `/api/report/save` | Buyer | Save report snapshot |
| GET | `/api/report/saved` | Buyer | List saved reports |
| DELETE | `/api/report/saved/:id` | Buyer | Delete saved report |

**Compare body:**
```json
{ "pincodes": ["400001", "110001", "560001"] }
```

**Score object structure:**
```json
{
  "aqi": { "value": 80, "label": "Excellent", "unit": "/100", "source": "OpenWeatherMap" },
  "walkability": { "value": 60, "label": "Good", "unit": "/100" },
  ...
  "overallScore": 74,
  "grade": "B"
}
```

**Score labels:**
- `80-100` → Excellent
- `60-79` → Good
- `40-59` → Moderate
- `0-39` → Poor

---

### Listings

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/listings` | — | Browse with filters |
| GET | `/api/listings/:id` | — | Single listing detail |
| POST | `/api/listings` | Broker | Create listing (multipart) |
| PUT | `/api/listings/:id` | Broker | Update own listing |
| DELETE | `/api/listings/:id` | Broker/Admin | Remove listing |
| POST | `/api/listings/:id/report` | Buyer | Report suspicious listing |
| POST | `/api/listings/:id/visit` | Any (auth) | Get visit QR token |

**GET /api/listings query params:**
```
minPrice=5000&maxPrice=30000&bhk=2,3&verificationLevel=gold
&minTrustScore=70&trustedOnly=true&sortBy=reliability
&page=1&limit=20
```

**POST /api/listings** (multipart/form-data):
```
addressFull: "Flat 4B, Sunshine Apts, Bandra"
pincode: 400050
price: 35000
bhk: 2
area: 850
furnishing: fully-furnished
availability: 2025-07-01
amenities: ["gym","parking","power backup"]
photos: [file1, file2, ...]     ← multiple images
```

---

### Broker Dashboard

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/broker/stats` | Broker | Performance stats |
| GET | `/api/broker/listings` | Broker | Own listings table |
| POST | `/api/broker/verify-document` | Broker | Upload KYC / ownership / live_photo / video |

**Verification Badge Progression:**

| Badge | Required Documents |
|---|---|
| 🥉 Bronze | KYC |
| 🥈 Silver | KYC + Ownership proof |
| 🥇 Gold | + Live geo-tagged photo |
| 💎 Platinum | + Video walkthrough |

**POST /api/broker/verify-document** (multipart/form-data):
```
type: kyc          ← kyc | ownership | live_photo | video
file: [file]
```

---

### Admin Moderation

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/reported` | Admin | List reported listings |
| POST | `/api/admin/reported/:id/resolve` | Admin | Remove or dismiss report |
| GET | `/api/admin/verification-queue` | Admin | Listings pending badge upgrade |
| POST | `/api/admin/verify-listing/:id` | Admin | Approve / reject listing badge |
| GET | `/api/admin/analytics` | Admin | Platform analytics |

**Resolve body:**
```json
{ "action": "remove", "strike": true, "note": "Confirmed fake listing" }
```

**Verify listing body:**
```json
{ "approve": true, "verificationLevel": "gold" }
```

---

## 🧠 Scoring Engine

All 11 metrics run in parallel via `Promise.allSettled`. Failed API calls fall back to `{ value: 50, label: "Moderate", error: true }`.

| Metric | Source | Weight |
|---|---|---|
| AQI | OpenWeatherMap | 25% |
| Walkability | Overpass (OSM) | 20% |
| Flood Risk | Open-Elevation + Overpass | 15% |
| Safety (Crime) | NCRB pre-loaded JSON | 20% |
| Noise Pollution | Overpass | ~2.86% |
| Metro Proximity | Overpass | ~2.86% |
| School Rating | Overpass | ~2.86% |
| Hospital Access | Overpass | ~2.86% |
| Green Cover | Overpass | ~2.86% |
| Internet Speed | Tiered fallback | ~2.86% |
| Power Reliability | Tiered fallback | ~2.86% |

**Cache:** Results stored in `NeighborhoodScore` collection with a MongoDB TTL index (`expiresAt`). Automatically deleted after **24 hours**.

---

## 🔒 Security

- **Helmet** – HTTP security headers
- **CORS** – Allowlist via `CORS_ORIGINS` env var
- **express-mongo-sanitize** – NoSQL injection prevention
- **xss-clean** – XSS stripping
- **bcrypt** (rounds=12) – Password hashing
- **Joi** – Input validation on all endpoints
- **Rate limiting** – 100 req/15 min public, 20 req/15 min auth

---

## 📁 Logs

Winston writes to:
- `logs/error.log` – errors only
- `logs/combined.log` – all levels

In development, all logs also print to the console with colour.

---

## 🛠️ Environment Variables Reference

See [`.env.example`](.env.example) for the full list with descriptions.

---

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| `express` | HTTP framework |
| `mongoose` | MongoDB ODM |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT auth |
| `cloudinary` | Photo/video storage |
| `multer` | File upload handling |
| `joi` | Schema validation |
| `helmet` | Security headers |
| `express-rate-limit` | Rate limiting |
| `express-mongo-sanitize` | NoSQL injection prevention |
| `winston` | Structured logging |
| `morgan` | HTTP request logging |
| `axios` | HTTP client for external APIs |
| `uuid` | Visit QR token generation |
