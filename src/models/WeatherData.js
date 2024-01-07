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
    },
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
    barometricPressure: {
      type: Number,
      required: true,
      min: 0,
      max: 2000,
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
