// models/weatherConditions.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const weatherConditionsSchema = new mongoose.Schema({
  weatherType: String,
  description: String,
  pressureRange: {
    from: Number,
    to: Number
  },
  temperatureRange: {
    from: Number,
    to: Number
  },
  humidityRange: {
    from: Number,
    to: Number
  },
  external_id: {
    type: String,
    default: uuidv4
  }
});

const WeatherConditions = mongoose.model('WeatherConditions', weatherConditionsSchema);

module.exports = WeatherConditions;
