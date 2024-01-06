const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pronosticSchema = new Schema({
    dateTime: {
        type: Date,
        required: true,
        default: Date.now()
    },
    climateDate: {
        type: Schema.Types.ObjectId, // Tipo ObjectId para referencia
        ref: "ClimateDate", // Nombre del modelo referenciado
        // required: true,
    },
    pronostic: {
        type: Schema.Types.ObjectId,
        ref: "Climate",
        // required: true,
    },
    image: {
        type: String,
        required: true,
    },
});

const Pronostic = mongoose.model("Pronostic", pronosticSchema);

module.exports = Pronostic;