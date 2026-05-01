'use strict';
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Listing = require('./models/Listing');

const MONGODB_URI = process.env.MONGODB_URI;
const BROKER_ID = '69eeec979fc50c6bf96d5a3b'; // Found from previous command

const fakeListings = [
  {
    address: { full: 'Apt 402, Sunshine Residency, Whitefield', pincode: '560066', lat: 12.9698, lon: 77.7499 },
    price: 45000, bhk: 3, area: 1800, furnishing: 'fully-furnished',
    amenities: ['Gym', 'Swimming Pool', 'Security', 'Power Backup'],
    verificationLevel: 'platinum', trustScore: 95, photos: ['https://res.cloudinary.com/demo/image/upload/v1631234567/sample.jpg'],
    status: 'active', views: 120, contacts: 15
  },
  {
    address: { full: 'Flat 12B, Ocean View, Marine Drive', pincode: '400020', lat: 18.9438, lon: 72.8231 },
    price: 125000, bhk: 4, area: 2500, furnishing: 'fully-furnished',
    amenities: ['Sea View', 'Concierge', 'Parking', 'Clubhouse'],
    verificationLevel: 'platinum', trustScore: 98, photos: ['https://res.cloudinary.com/demo/image/upload/v1631234568/sample2.jpg'],
    status: 'active', views: 450, contacts: 42
  },
  {
    address: { full: 'Plot 45, Green Acres, Sector 56', pincode: '122011', lat: 28.4239, lon: 77.0892 },
    price: 35000, bhk: 2, area: 1200, furnishing: 'semi-furnished',
    amenities: ['Garden', 'Parking', 'Security'],
    verificationLevel: 'gold', trustScore: 88, photos: ['https://res.cloudinary.com/demo/image/upload/v1631234569/sample3.jpg'],
    status: 'active', views: 85, contacts: 8
  },
  {
    address: { full: 'Unit 7, Tech Park View, HSR Layout', pincode: '560102', lat: 12.9128, lon: 77.6388 },
    price: 28000, bhk: 1, area: 750, furnishing: 'semi-furnished',
    amenities: ['Lift', 'CCTV', 'Power Backup'],
    verificationLevel: 'silver', trustScore: 75, photos: ['https://res.cloudinary.com/demo/image/upload/v1631234570/sample4.jpg'],
    status: 'active', views: 210, contacts: 25
  },
  {
    address: { full: 'Villa 3, Palm Meadows, Whitefield', pincode: '560066', lat: 12.9698, lon: 77.7499 },
    price: 150000, bhk: 5, area: 4500, furnishing: 'fully-furnished',
    amenities: ['Private Garden', 'Swimming Pool', 'Home Theatre'],
    verificationLevel: 'platinum', trustScore: 99, photos: ['https://res.cloudinary.com/demo/image/upload/v1631234571/sample5.jpg'],
    status: 'active', views: 60, contacts: 2
  }
];

// Helper to generate random listings
const generateRandomListings = (count, brokerId) => {
  const cities = [
    { name: 'Bangalore', pincode: '560001', lat: 12.9716, lon: 77.5946 },
    { name: 'Mumbai', pincode: '400001', lat: 18.9220, lon: 72.8347 },
    { name: 'Delhi', pincode: '110001', lat: 28.6139, lon: 77.2090 },
    { name: 'Hyderabad', pincode: '500001', lat: 17.3850, lon: 78.4867 },
    { name: 'Chennai', pincode: '600001', lat: 13.0827, lon: 80.2707 },
    { name: 'Pune', pincode: '411001', lat: 18.5204, lon: 73.8567 },
    { name: 'Ahmedabad', pincode: '380001', lat: 23.0225, lon: 72.5714 }
  ];
  const furnishings = ['unfurnished', 'semi-furnished', 'fully-furnished'];
  const amenityPool = ['Parking', 'Security', 'Gym', 'Swimming Pool', 'Power Backup', 'Clubhouse', 'Lift', 'CCTV', 'Garden', 'Intercom'];
  const levels = ['bronze', 'silver', 'gold', 'platinum'];

  const results = [];
  for (let i = 0; i < count; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const bhk = Math.floor(Math.random() * 4) + 1;
    const price = (Math.floor(Math.random() * 8) + 2) * 5000 + (bhk * 10000);
    const area = bhk * 600 + Math.floor(Math.random() * 300);
    
    results.push({
      brokerId,
      address: {
        full: `${Math.floor(Math.random() * 900) + 100}, Skyline Towers, ${city.name}`,
        pincode: city.pincode,
        lat: city.lat + (Math.random() - 0.5) * 0.1,
        lon: city.lon + (Math.random() - 0.5) * 0.1
      },
      price,
      bhk,
      area,
      furnishing: furnishings[Math.floor(Math.random() * furnishings.length)],
      amenities: amenityPool.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 5) + 2),
      verificationLevel: levels[Math.floor(Math.random() * levels.length)],
      trustScore: Math.floor(Math.random() * 40) + 60,
      photos: [`https://picsum.photos/seed/${Math.random()}/800/600`],
      status: 'active',
      views: Math.floor(Math.random() * 200),
      contacts: Math.floor(Math.random() * 20),
      geoTag: { type: 'Point', coordinates: [city.lon + (Math.random() - 0.5) * 0.1, city.lat + (Math.random() - 0.5) * 0.1] }
    });
  }
  return results;
};

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Add explicit brokerId to static listings
    const listingsToInsert = [
      ...fakeListings.map(l => ({ ...l, brokerId: BROKER_ID })),
      ...generateRandomListings(25, BROKER_ID)
    ];

    await Listing.insertMany(listingsToInsert);
    console.log(`Successfully seeded ${listingsToInsert.length} rental listings.`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
