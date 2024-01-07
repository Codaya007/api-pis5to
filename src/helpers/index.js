const { Types } = require("mongoose");
const crypto = require("crypto");

/**
 * Valida si un string es un objectId válido
 * @param {String} string Id
 * @return {Boolean} Es valido
 */
const isValidObjectId = Types.ObjectId.isValid;

/**
 * Genera un string urlFriendly, que puede servir como token
 * @return {String} Devuelve token
 */
const generateUrlFriendlyToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

module.exports = {
  isValidObjectId,
  generateUrlFriendlyToken,
};
