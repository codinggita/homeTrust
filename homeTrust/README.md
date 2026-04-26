# HomeTrust – Institutional‑Grade Real Estate Intelligence Platform

**HomeTrust** is a free, dual‑module platform that solves two critical problems in the Indian real estate market:

1. **Homebuyers lack standardized neighborhood quality data** – making multi‑crore investment decisions without comprehensive, data‑driven insights into AQI, walkability, crime, flood risk, transit, schools, hospitals, green cover, internet speed, and power reliability.
2. **Half of rental listings are fake broker clickbait** – prospective tenants waste time on fraudulent ads with fake photos, unavailable properties, and bait‑and‑switch tactics designed only to capture contact information.

HomeTrust provides **institutional‑grade, unbiased data** for any locality and a **scam‑free, verified rental marketplace** with broker KYC, trust badges, AI‑assisted scam detection, and a transparent moderation system – all completely free.

---

## 📌 Table of Contents

- [Problem Statements](#problem-statements)
- [Approach & Methodology](#approach--methodology)
- [Solution Overview](#solution-overview)
- [Modules & Features](#modules--features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [Database Schema (Conceptual)](#database-schema-conceptual)
- [Future Scope](#future-scope)
- [Contributing](#contributing)
- [License](#license)

---

## 🔍 Problem Statements

### Problem 1: No Standardized Neighborhood Quality Data
> *Homebuyers making multi‑crore investment decisions lack comprehensive, data‑driven information about neighborhood characteristics like school quality, crime statistics, air quality indices, water availability, power outage frequency, and future infrastructure plans that would inform purchasing choices beyond individual property inspection.*

**Consequences:**
- Buyers rely on biased broker opinions or random online forums.
- Critical factors (flood risk, noise pollution, actual commute times) are ignored until after purchase.
- No objective way to compare localities side‑by‑side.

### Problem 2: Fake Rental Listings (Broker Clickbait)
> *Prospective tenants searching for rental homes discover that half of attractive listings on property portals are fraudulent advertisements posted by brokers using fake photos, unavailable properties, or significantly different actual offerings designed purely to capture contact information and generate commission‑based inquiries.*

**Consequences:**
- Tenants waste weeks chasing non‑existent properties.
- Legitimate brokers lose trust and business.
- No accountability or strike system for repeat offenders.

---

## 🧠 Approach & Methodology

### For Neighborhood Reports
- **Data Aggregation:** Gather data from multiple free/open sources (OpenWeatherMap AQI, Overpass API for amenities, OSM for walkability, government crime/flood records, etc.).
- **Scoring Engine:** Normalize raw data into 0–100 scores, apply weighted averaging (AQI 25%, Walkability 20%, Flood 15%, Crime 20%, Amenities 20%), and generate an overall livability score.
- **User Experience:** Interactive map search, one‑click report generation, expandable parameter details, PDF export, and side‑by‑side locality comparison.
- **Caching:** Store reports for 24 hours to reduce API calls and improve speed.

### For Verified Rental Listings
- **Multi‑Layer Verification:**
  - **Broker KYC:** Mandatory ID upload (Aadhaar/PAN) for listing.
  - **Document Verification:** Ownership proof, rent agreement draft.
  - **Live Geo‑tagged Photos:** Camera‑forced upload with timestamp and location.
  - **Video Walkthrough** (optional for Platinum badge).
- **AI‑Assisted Scam Detection:** Reverse image search, price anomaly detection, duplicate listing cross‑check, address validation.
- **Trust Badges:** Bronze → Silver → Gold → Platinum, each requiring progressively more verification.
- **Strike System:** 3 strikes lead to account suspension.
- **Admin Moderation Queue:** Reported listings, verification requests, AI‑flagged suspicious listings.

---

## 💡 Solution Overview

HomeTrust is a **React‑based web application** (Vite + Tailwind + shadcn/ui) that offers:

- **Free, unlimited neighborhood reports** with 11 livability parameters.
- **Verified rental listings** – only brokers who pass KYC and document verification can list.
- **Trust badges & trust scores** – visible on every listing card.
- **Admin dashboard** to moderate reported listings, approve high‑tier badges, and monitor scam trends.
- **Broker dashboard** with performance metrics, listing management, and a multi‑step listing wizard.
- **User profiles** to save reports, manage alert preferences, and export data.

All data is **mocked** for the MVP, but the architecture is ready to plug into real APIs (OpenWeatherMap, Google Places, etc.).

---

## 🧩 Modules & Features

### Module 1: Neighborhood Quality Reports

| Feature | Description |
|---------|-------------|
| **Search by location** | Autocomplete, interactive map (draggable pin), geolocation. |
| **11‑parameter scoring** | AQI, Walkability, Flood risk, Crime, Noise, Metro, Schools, Hospitals, Green cover, Internet, Power. |
| **Expandable details** | For AQI: PM2.5, PM10, NO2, hourly forecast. For Walkability: list of amenities with distances. etc. |
| **Overall livability gauge** | Circular gauge (0–100) with color coding. |
| **Pros & Cons** | Auto‑generated from scores. |
| **City comparison** | Bar chart comparing each parameter to city average. |
| **1km radius map** | Amenity icons (hospitals, schools, parks, grocery, metro). |
| **PDF export** | One‑click mock PDF download. |
| **Save reports** | Unlimited saved reports per user. |
| **Compare localities** | Side‑by‑side table (up to 3 localities), export CSV. |

### Module 2: Verified Rental Listings

| Feature | Description |
|---------|-------------|
| **Trusted Only toggle** | Hides all unverified listings by default. |
| **Advanced filters** | Price, BHK, verification level (Platinum/Gold/Silver), min trust score. |
| **Listing cards** | Image, price, address, trust badge, trust score circle, broker name, report icon. |
| **Listing detail page** | Image gallery, verification progress bar, trust score breakdown, property specs, rent history chart, neighborhood snapshot, broker profile. |
| **Request Visit** | Generates mock QR code for gate access. |
| **Report Fake Listing** | Submit with reason – goes to admin queue. |
| **Broker Dashboard** | Stats (listings, views, contacts, strikes), add listing wizard, listing management table, performance charts. |
| **Admin Dashboard** | Reported listings queue, verification queue, AI flagged queue, fake trends by city, top offending brokers. |

### Shared & User Features

- **Authentication** – Login/signup with role selection (buyer, broker, admin).
- **User Profile** – Edit personal info, saved locations, notification preferences, data export (JSON).
- **Notifications** – In‑app toast + bell icon with mock alerts.
- **Dark Mode** – Toggle between light and dark themes.

---

## 🏗️ Architecture & Tech Stack

### Frontend (React JS only)

| Technology | Purpose |
|------------|---------|
| **React 18 + Vite** | Core framework & build tool. |
| **React Router DOM v6** | Routing & protected routes. |
| **Tailwind CSS** | Utility‑first styling. |
| **shadcn/ui** | Pre‑built accessible components (buttons, modals, toasts, sheets). |
| **Zustand** | Global state management (auth, reports, listings, notifications). |
| **React Query** | Data fetching & caching (mock APIs). |
| **react‑leaflet** | Interactive maps. |
| **Recharts** | Charts (sparklines, bar charts, line charts). |
| **react‑circular‑progressbar** | Livability score gauge. |
| **qrcode.react** | QR code generation for visitor visits. |
| **html2pdf.js** | Mock PDF export. |
| **@faker-js/faker** | Mock data generation. |

### Backend (Planned for future – currently all mock)

- Node.js + Express (REST API)
- PostgreSQL (with PostGIS for geospatial queries)
- Redis (caching)
- JWT authentication

### External APIs (to be integrated later)

- OpenWeatherMap Air Pollution API (AQI)
- Overpass API / OpenStreetMap (amenities, walkability)
- Google Places API (schools, hospitals)
- OSRM (routing & isochrones)
- DigiLocker / Signzy (KYC verification)

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

Figma Link :- https://www.figma.com/design/PsVdgzJknFFixgqsEJQ78E/Untitled?node-id=0-1&m=dev&t=N2MY0jxdtTEsMqIA-1

### Steps



1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hometrust.git
   cd hometrust
