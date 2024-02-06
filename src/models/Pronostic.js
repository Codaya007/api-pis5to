const mongoose = require("mongoose");
const softDeletePlugin = require("../plugins/softDelete");
const manageExternalId = require("../plugins/manageExternalId");
const Schema = mongoose.Schema;

const pronosticSchema = new Schema({
    dateTime: {
        type: Date,
        required: true,
        // default: Date.now() //? Realmente es necesario?
    },
    // weatherData: {
    //     type: Schema.Types.ObjectId, // Tipo ObjectId para referencia
    //     ref: "WeatherData", // Nombre del modelo referenciado
    // },
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
    pronostic: {
        type: Schema.Types.ObjectId,
        ref: "WeatherConditions",
    },
});

pronosticSchema.plugin(softDeletePlugin);
pronosticSchema.plugin(manageExternalId);

const Pronostic = mongoose.model("Pronostic", pronosticSchema);

module.exports = Pronostic;