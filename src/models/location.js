// location.js
// Import mongoose using ES6 import
import mongoose from 'mongoose';

// Import Advertisement using ES6 import
import Advertisement from './advertisement.js';

const locationSchema = new mongoose.Schema({
  coordinates: {
    x:Number,
    y:Number,
  },
  ward: String,
  district: String,
  numberOfAds: Number,
  ads: [Advertisement.schema], // Sử dụng schema của Advertisement làm một phần của schema này
  address: String,
  detail: String,
  type: String,
  condition: Number,
});

const Location = mongoose.model('Location', locationSchema);

export default Location;
