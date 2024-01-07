const jwt = require("jsonwebtoken");
const Account = require("../models/Account");
const ApiCustomError = require("../errors/ApiError");
const { JWT_SECRET } = process.env;

const tokenValidation = async (tokenReceived) => {
  const [_, token] = tokenReceived?.split(" ") || [];
  if (!token) {
    throw new ApiCustomError("There is not token", null, 400);
  }
  const decoded = jwt.verify(token, JWT_SECRET);
  const _id = decoded.id;
  const account = await Account.findOne({ _id });
  console.log(account);
  if (!account) {
    throw new ApiCustomError("There is not account", null, 400);
  }

  return account;
};

module.exports = { tokenValidation };
