const mongoose = require("mongoose");
const manageExternalId = require("../plugins/manageExternalId");
const Schema = mongoose.Schema;

const sensorSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 50,
    unique: true,
  },
  unitMeasurement: {
    type: String,
    required: true,
    maxLength: 10,
  },
});

sensorSchema.plugin(manageExternalId);

const Sensor = mongoose.model("sensor", sensorSchema);

module.exports = Sensor;
