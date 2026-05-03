# HomeTrust – Institutional‑Grade Real Estate Intelligence Platform

HomeTrust is a free dual‑module platform built to improve trust and transparency in the Indian real estate market.

It solves two major problems:

* **Lack of reliable neighborhood insights** for homebuyers making high‑value property decisions.
* **Fake rental listings and broker clickbait** that waste renters’ time and reduce trust.

HomeTrust combines **data‑driven locality intelligence** with a **verified rental marketplace** to help users make safer and smarter real estate decisions.

---

# 🚀 Key Features

## 1. Neighborhood Quality Reports

Get a complete locality intelligence report using pincode search.

### Features

* Search locality by **pincode**
* **Livability Score (0–100)** with grade system
* 11 quality parameters including:

  * AQI & pollution
  * Walkability
  * Crime level
  * Flood risk
  * Noise pollution
  * Metro/public transport access
  * Schools & hospitals nearby
  * Green cover
  * Internet speed
  * Power reliability
* City average comparison
* Save reports for later
* Compare up to 3 localities
* PDF export support

---

## 2. Verified Rental Marketplace

A scam‑resistant rental platform with broker accountability.

### Features

* Trusted listings filter
* Broker verification badges
* AI‑assisted scam detection
* Fake listing reporting system
* Listing trust score
* Rental filters (price, BHK, trust level)
* Request visit with QR code
* Broker profile & performance metrics

---

# 🧠 Core Idea

HomeTrust creates an **institutional‑style real estate intelligence system** using multiple data layers.

### Data Sources (MVP Ready)

* OpenWeatherMap → AQI & pollution
* OpenStreetMap / Overpass API → Amenities
* Open‑Elevation → Flood risk proxy
* TRAI benchmarks → Internet speed
* ISRO Bhuvan → Green cover analysis

All APIs are mocked for MVP but architecture is designed for real integration.

---

# 🛠️ Tech Stack

## Frontend

* React 18 + Vite
* React Router DOM
* Tailwind CSS
* Zustand
* React Query
* Recharts

## Backend

* Node.js + Express
* MongoDB Atlas
* Mongoose
* JWT Authentication
-

# 🏗️ Project Architecture

```text
React Frontend
      ↓
REST API (Express)
      ↓
MongoDB Atlas
      ↓
External Services & APIs
```

### Main API Modules

* `/api/auth`
* `/api/reports`
* `/api/listings`
* `/api/broker`
* `/api/admin`
* `/api/user`
* `/api/analyzer`

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/your-org/hometrust.git
cd hometrust
```

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 📌 Main User Roles

### Buyer / Renter

* Search locality reports
* Save & compare reports
* Browse verified rentals
* Report fake listings

### Broker

* Upload listings
* Complete verification
* Manage trust score
* Track listing analytics

### Admin

* Review fake reports
* Approve broker verification
* Moderate flagged listings

---

# 🔌 Important API Endpoints

| Method | Endpoint                   | Description           |
| ------ | -------------------------- | --------------------- |
| POST   | `/api/auth/register`       | Register user         |
| POST   | `/api/auth/login`          | Login user            |
| GET    | `/api/reports/:pincode`    | Fetch locality report |
| GET    | `/api/listings`            | Fetch rental listings |
| POST   | `/api/listings`            | Create listing        |
| POST   | `/api/listings/:id/report` | Report fake listing   |
| GET    | `/api/broker/dashboard`    | Broker analytics      |
| GET    | `/api/admin/dashboard`     | Admin analytics       |

---

# 🌍 Live Links

* **Frontend:** [https://home-trust-main.vercel.app/](https://home-trust-main.vercel.app/)
* **Backend API:** [https://hometrust.onrender.com](https://hometrust.onrender.com)
* **Postman Docs:** [https://documenter.getpostman.com/view/50839329/2sBXqKofES](https://documenter.getpostman.com/view/50839329/2sBXqKofES)
* **Figma Design:** [https://www.figma.com/design/PsVdgzJknFFixgqsEJQ78E/Untitled](https://www.figma.com/design/PsVdgzJknFFixgqsEJQ78E/Untitled)
* **YouTube Demo:** [https://youtu.be/V7J295BSAd0](https://youtu.be/V7J295BSAd0)

---

# 🔮 Future Improvements

* Real‑time AQI & weather integration
* User reviews for brokers & apartments
* Rent negotiation assistant
* Property appreciation prediction
* React Native mobile app
* Blockchain‑based verification

---

# 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to GitHub
5. Open a Pull Request

---


---

# ⭐ Why HomeTrust?

HomeTrust focuses on **trust, transparency, and data‑driven real estate decisions**.

Instead of relying only on broker claims or incomplete property portals, users get:

* Verified rental listings
* Reliable locality intelligence
* Scam prevention system
* Institutional‑grade property insights
