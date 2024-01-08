const mongoose = require("mongoose");
const softDeletePlugin = require("../plugins/softDelete");
const manageExternalId = require("../plugins/manageExternalId");
const Schema = mongoose.Schema;

const pronosticSchema = new Schema({
    dateTime: {
        type: Date,
        required: true,
        default: Date.now()
    },
    weatherData: {
        type: [Schema.Types.ObjectId], // Tipo ObjectId para referencia
        ref: "WeatherData", // Nombre del modelo referenciado
        // required: true,
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