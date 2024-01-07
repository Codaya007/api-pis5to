const mongoose = require('mongoose');
const manageExternalId = require('../plugins/manageExternalId');
const Schema = mongoose.Schema;

const rolSchema = new Schema ({
    name: {
        type: String,
        required: true,
        maxLength: 50
    }
});

rolSchema.plugin(manageExternalId);
const Rol = mongoose.model("rol", rolSchema);

module.exports = Rol;