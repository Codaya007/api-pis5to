const { isValidObjectId } = require("mongoose");
// const ValidationError = require("")
const Cuenta = require("../models/Account");
const { hashPassword } = require("../helpers/hashPassword");
const uuidv4 = require("uuid").v4;

const getAllCuentas = async (where = {}, skip = 10, limit = 10) => {
  const allCuentas = await Cuenta.find(where).skip(skip).limit(limit);
  return allCuentas;
};

const getCuentaByExternalId = async (external_id) => {
  const cuenta = await Cuenta.findOne({ external_id });
  console.log(cuenta);
  if (!cuenta) {
    res.json({ status: 400, msg: "La cuenta no fue encontrada" });
  }

  return cuenta;
};

const createCuenta = async ({ password, ...newUser }) => {
  const cuentaExist = await Cuenta.findOne({ email: newUser.email });
  const hashedPassword = await hashPassword(password);
  newUser.password = hashedPassword;

  if (cuentaExist) {
    return res.json({ status: 400, msg: "La cuenta ya existe" });
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
  const accountA = await getCuentaByExternalId(external_id);
  if (!accountA) {
    return res.json({ status: 400, msg: "La cuenta no existe" });
  }
  const toDelete = await updateCuenta(external_id, {
    email: null,
    external_id: uuidv4(),
    deletedAt: new Date(),
  });
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
