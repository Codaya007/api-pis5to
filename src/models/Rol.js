const mongoose = require("mongoose");
const manageExternalId = require("../plugins/manageExternalId");
// const softDeletePlugin = require("../plugins/softDelete");
const Schema = mongoose.Schema;

const rolSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 50,
  },
});

rolSchema.plugin(manageExternalId);
// rolSchema.plugin(softDeletePlugin);

const Rol = mongoose.model("rol", rolSchema);

module.exports = Rol;
