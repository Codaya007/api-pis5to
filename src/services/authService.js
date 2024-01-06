const ApiCustomError = require("../errors/ApiError");
const InvalidToken = require("../errors/InvalidToken");
const ValidationError = require("../errors/ValidationError");
const { generateUrlFriendlyToken } = require("../helpers");
const Account = require("../models/Account");
const bcrypt = require("bcrypt");

const login = async (email, password) => {
  const account = await Account.findOne({ email });
  if (!account) throw new ValidationError("Account did not found");
  const compare = bcrypt.compareSync(password, account.password);
  if (!compare) {
    throw new ValidationError("Incorrect credentials");
  }
  return account;
};

const generatePasswordRecoveryToken = async (email) => {
  const account = await Account.findOne({ email });

  if (!account) throw new ApiCustomError("The account is not register");

  const token = generateUrlFriendlyToken();
  account.token = token;
  account.tokenExpiresAt = new Date(Date.now() + 3 * 60 * 60 * 100);
  await account.save();

  return token;
};

const validateTokenAccount = async (token) => {
  const account = await Account.findOne({ token });
  if (!account) {
    throw new ApiCustomError("Token is not valid");
  }

  if (Date.now() > account.tokenExpiresAt) {
    throw new InvalidToken("Token has expired");
  }

  return account;
};
module.exports = {
  login,
  generatePasswordRecoveryToken,
  validateTokenAccount,
};
