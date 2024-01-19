const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const manageExternalId = require("../plugins/manageExternalId");
// const softDeletePlugin = require("../plugins/softDelete");

const accountSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 25,
    },
    lastname: {
      type: String,
      required: true,
      min: 3,
      max: 25,
    },
    email: {
      type: String,
      required: true,
      min: 5,
      max: 40,
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 61,
    },
    avatar: {
      type: String,
      required: false,
      default: null,
    },
    state: {
      type: String,
      maxLength: 30,
      isIn: ["ACTIVA", "BLOQUEADA", "INACTIVA"],
      default: "ACTIVA",
    },
    deletedAt: {
      type: Date,
      required: false,
    },
    token: {
      type: String,
      required: false,
    },
    tokenExpiresAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

accountSchema.plugin(manageExternalId);
// accountSchema.plugin(softDeletePlugin);

const Account = mongoose.model("accounts", accountSchema);

module.exports = Account;
