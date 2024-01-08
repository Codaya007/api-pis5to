const jwt = require("jsonwebtoken");
const Account = require("../models/Account");
const ApiCustomError = require("../errors/ApiError");
const { JWT_SECRET } = process.env;

const tokenValidation = async (tokenReceived) => {
  const [_, token] = tokenReceived?.split(" ") || [];
  if (!token) {
    throw new ApiCustomError("No existe token", null, 400);
  }
  const decoded = jwt.verify(token, JWT_SECRET);
  const _id = decoded.id;
  const account = await Account.findOne({ _id });
  console.log(account);
  if (!account) {
    throw new ApiCustomError("Token no valido", null, 400);
  }

  return account;
};

module.exports = { tokenValidation };
