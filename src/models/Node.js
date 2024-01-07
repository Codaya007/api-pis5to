const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const manageExternalId = require("../plugins/manageExternalId");

const nodeSchema = new Schema({
    tag: {
        type: String,
        maxLength: 50,
        required: true
    },
    detail: {
        type: String,
        maxLength: 200,
        required: true
    },
    ip: {
        type: String,
        maxLength: 15,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    },
    rol: {
        type: String,
        required: true
    },
    sensor: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    }
});

nodeSchema.plugin(manageExternalId);

const Node = mongoose.model("node", nodeSchema);

module.exports = Node;