const mongoose = require("mongoose");
const softDeletePlugin = require("../plugins/softDelete");
const manageExternalId = require("../plugins/manageExternalId");

const WeatherDataSchema = new mongoose.Schema(
  {
    // id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    // },
    dateTime: {
      type: Date,
      required: true,
    },
    windSpeed: {
      type: Number,
      // required: true,
      default: null,
      min: 0,
      max: 200,
    },
    temperature: {
      type: Number,
      required: true,
      min: -100,
      max: 100,
    },
    humidity: {
      type: Number,
      required: true,
      min: 0,
      max: 200,
    },
    barometricPressure: {
      type: Number,
      required: true,
      min: 0,
      max: 2000,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WeatherConditions",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

WeatherDataSchema.plugin(softDeletePlugin);
WeatherDataSchema.plugin(manageExternalId);

const WeatherData = mongoose.model("WeatherData", WeatherDataSchema);

module.exports = WeatherData;
