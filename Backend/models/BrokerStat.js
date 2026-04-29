'use strict';
/**
 * models/BrokerStat.js – denormalised broker performance stats
 * Updated by controller middleware on key events.
 */

const mongoose = require('mongoose');

const weeklyViewSchema = new mongoose.Schema({
  day  : { type: String },  // e.g. 'Mon', 'Tue'
  count: { type: Number, default: 0 },
}, { _id: false });

const brokerStatSchema = new mongoose.Schema({
  brokerId: {
    type    : mongoose.Schema.Types.ObjectId,
    ref     : 'User',
    required: true,
    unique  : true,
    index   : true,
  },
  totalListings  : { type: Number, default: 0 },
  activeListings : { type: Number, default: 0 },
  totalViews     : { type: Number, default: 0 },
  totalContacts  : { type: Number, default: 0 },
  weeklyViews    : { type: [weeklyViewSchema], default: () => buildDefaultWeekly() },
  updatedAt      : { type: Date, default: Date.now },
}, {
  timestamps: false,
});

function buildDefaultWeekly() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days.map(day => ({ day, count: 0 }));
}

module.exports = mongoose.model('BrokerStat', brokerStatSchema);
