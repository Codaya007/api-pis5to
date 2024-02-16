// models/weatherConditions.js
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const weatherConditionsSchema = new mongoose.Schema({
  weatherType: { type: String, unique: true },
  description: String,
  pressureRange: {
    from: Number,
    to: Number,
  },
  temperatureRange: {
    from: Number,
    to: Number,
  },
  humidityRange: {
    from: Number,
    to: Number,
  },
  windSpeed: {
    from: Number,
<<<<<<< HEAD
    to: Number
  },
  image: String,
=======
    to: Number,
  },
  image: { type: String, required: true },
>>>>>>> 25023719067eb7abf7c9c5c21913394bb2ce3615
  external_id: {
    type: String,
    default: uuidv4,
  },
});

const WeatherConditions = mongoose.model(
  "WeatherConditions",
  weatherConditionsSchema
);

module.exports = WeatherConditions;