const { isValidObjectId } = require("mongoose");
// const ValidationError = require("")
const Cuenta = require("../models/Account");
const ApiCustomError = require("../errors/ApiError");
const { hashPassword } = require("../helpers/hashPassword");
const ValidationError = require("../errors/ValidationError");
const uuidv4 = require("uuid").v4;

const getAllCuentas = async (where = {}, skip = 10, limit = 10) => {
  const allCuentas = await Cuenta.find(where).skip(skip).limit(limit);

  return allCuentas;
};

const getCuentaByExternalId = async (external_id) => {
  console.log(external_id);
  const cuenta = await Cuenta.findOne({ external_id });
  console.log(cuenta);
  // if (!cuenta) throw new ValidationError("There is not account");

  return cuenta;
};

const createCuenta = async ({ password, ...newUser }) => {
  const cuentaExist = await Cuenta.findOne({ email: newUser.email });
  const hashedPassword = await hashPassword(password);
  newUser.password = hashedPassword;

  if (cuentaExist) {
    throw new ValidationError("There is an account");
  }

  const cuenta = await Cuenta.create({
    ...newUser,
  });

  return cuenta;
};

const updateCuenta = async (external_id, newInfo) => {
  let cuenta = await getCuentaByExternalId(external_id);
  if (newInfo.password) {
    newInfo.password = await hashPassword(newInfo.password);
  }
  newInfo.external_id = uuidv4();
  cuenta = await Cuenta.findOneAndUpdate({ external_id }, newInfo, {
    new: true,
  });
  return cuenta;
};

const deleteCuenta = async (external_id) => {
  // const accountA = await getCuentaByExternalId(external_id);
  // if (!accountA) throw new ValidationError("There is not account");
  const toDelete = await updateCuenta(external_id, {
    email: null,
    external_id: uuidv4(),
    deletedAt: new Date(),
  });
  console.log(toDelete);
  // const deleted = await toDelete.softDelete();
  return toDelete;
};

const getCountCuentas = async (where = {}) => {
  where.deletedAt = null;
  return await Cuenta.countDocuments(where);
};

module.exports = {
  getAllCuentas,
  getCuentaByExternalId,
  updateCuenta,
  deleteCuenta,
  createCuenta,
  getCountCuentas,
};
