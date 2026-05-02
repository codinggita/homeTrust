# HomeTrust – Institutional‑Grade Real Estate Intelligence Platform

**HomeTrust** is a free, dual‑module platform that solves two critical problems in the Indian real estate market:

1. **Homebuyers lack standardized neighborhood quality data** – making multi‑crore investment decisions without comprehensive, data‑driven insights into AQI, walkability, crime, flood risk, transit, schools, hospitals, green cover, internet speed, and power reliability.
2. **Half of rental listings are fake broker clickbait** – prospective tenants waste time on fraudulent ads with fake photos, unavailable properties, and bait‑and‑switch tactics designed only to capture contact information.

HomeTrust provides **institutional‑grade, unbiased data** for any locality and a **scam‑free, verified rental marketplace** with broker KYC, trust badges, AI‑assisted scam detection, and a transparent moderation system – all completely free.

---

## 📌 Table of Contents

- [Problem Statements](#problem-statements)
- [Solution Overview](#solution-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [External APIs](#external-apis)
- [Future Scope](#future-scope)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

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

## 💡 Solution Overview

HomeTrust is a **React (frontend) + Node.js (backend)** application that offers:

- **Free, unlimited neighborhood reports** with 11 livability parameters across all 30,000+ Indian pincodes.
- **Verified rental listings** – only brokers who pass KYC and document verification can list properties.
- **Trust badges & trust scores** (Bronze, Silver, Gold, Platinum) – visible on every listing card.
- **Admin dashboard** to moderate reported listings, approve high‑tier badge upgrades, and monitor scam trends.
- **Broker dashboard** with performance metrics, listing management, and a multi‑step listing wizard.
- **User profiles** to save reports, manage alert preferences, and export data.
- **Rent vs Buy Analyzer** – financial comparison tool.

All data is **mocked** for the MVP, but the architecture is ready to plug into real APIs (OpenWeatherMap, Overpass API, NCRB crime data, etc.).

---

## 🧩 Features

### Module 1: Neighborhood Quality Reports

| Feature | Description |
|---------|-------------|
| **Search by pincode** | Autocomplete, popular localities, pan‑India coverage map. |
| **11‑parameter scoring** | AQI, Walkability, Flood risk, Crime, Noise, Metro proximity, School rating, Hospital access, Green cover, Internet speed, Power reliability. |
| **Expandable details** | Each parameter shows detailed data (e.g., for AQI: PM2.5, PM10, NO2, hourly forecast). |
| **Overall livability gauge** | Circular gauge (0–100) with grade (A–E). |
| **Strengths & concerns** | Auto‑generated lists from scores. |
| **Comparison to city average** | Bar chart. |
| **1km radius map** | Amenity icons (hospitals, schools, parks, grocery, metro). |
| **PDF export** | One‑click download (mock). |
| **Save reports** | Unlimited saved reports per user. |
| **Compare localities** | Side‑by‑side table (up to 3 pincodes), export CSV. |

### Module 2: Verified Rental Listings

| Feature | Description |
|---------|-------------|
| **Trusted Only toggle** | Hides all unverified listings by default. |
| **Advanced filters** | Price range, BHK, verification level (Platinum/Gold/Silver/Bronze), min trust score slider. |
| **Listing cards** | Image, price, address, trust badge, trust score circle, broker name, “Report fake” icon. |
| **Listing detail page** | Image gallery, verification progress bar, trust score breakdown, property specs, rent history chart, neighborhood snapshot, broker profile. |
| **Request Visit** | Generates mock QR code for gate access. |
| **Report Fake Listing** | Submit with reason – goes to admin queue. |
| **Broker Dashboard** | Stats (listings, views, contacts, strikes), add listing wizard (6 steps), listing management table, performance charts. |
| **Admin Dashboard** | Reported listings queue, verification queue, AI flagged queue, fake trends by city, top offending brokers. |

### Shared & User Features

- **Authentication** – Signup/login with role selection (buyer, broker, admin). JWT based.
- **User Profile** – Edit personal info, saved locations, notification preferences, data export (JSON).
- **Notifications** – In‑app toast + bell icon with mock alerts.
- **Rent vs Buy Analyzer** – Compare long‑term costs of renting vs buying (property appreciation, rent increases, net equity).

---

## 🏗️ Tech Stack

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

### Backend (Node.js + Express)

| Technology | Purpose |
|------------|---------|
| **Node.js + Express** | REST API server. |
| **MongoDB Atlas** | Database (free tier). |
| **Mongoose** | ODM for MongoDB. |
| **JWT + bcrypt** | Authentication. |
| **Multer + Cloudinary** | File uploads (listing photos, documents). |
| **Axios** | External API calls (OpenWeatherMap, Overpass, Open‑Elevation). |
| **express-rate-limit** | Rate limiting. |
| **Joi** | Request validation. |
| **winston + morgan** | Logging. |
| **helmet + cors + xss-clean** | Security. |

---

## 🧱 Architecture
