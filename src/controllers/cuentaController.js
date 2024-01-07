const cuentaService = require("../services/cuentaService");
const Cuenta = require("../models/Account");
const { hashPassword } = require("../helpers/hashPassword");
const uuidv4 = require("uuid").v4;

module.exports = {
  getAllAcounts: async (req, res) => {
    const { skip = 0, limit = 10, ...where } = req.query;
    // console.log(where);
    const allAccounts = await Cuenta.find(where).skip(skip).limit(limit);
    where.deletedAt = null;
    const numberAccounts = await Cuenta.countDocuments(where);
    res.json({ numberAccounts, allAccounts });
  },

  getCuentaByExternalId: async (req, res, next) => {
    const external_id = req.params.external;
    const cuentaA = await Cuenta.findOne({ external_id });
    if (!cuentaA) {
      return res.json({ status: 400, message: "La cuenta no fue encontrada" });
    }
    return res.json(cuentaA);
  },

  updateCuenta: async (req, res, next) => {
    const external_id = req.params.external;
    let cuenta = await Cuenta.findOne({ external_id });
    if (!cuenta) {
      return res.json({ status: 400, message: "La cuenta no fue encontrada" });
    }
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }
    req.body.external_id = uuidv4();
    cuenta = await Cuenta.findOneAndUpdate({ external_id }, req.body, {
      new: true,
    });
    return res.json(cuenta);
  },

  createCuenta: async (req, res) => {
    // const cuenta = await cuentaService.createCuenta(req.body);
    const cuentaExist = await Cuenta.findOne({ email: req.body.email });
    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    if (cuentaExist) {
      return res.json({ status: 400, message: "La cuenta ya existe" });
    }

    const cuenta = await Cuenta.create({
      ...req.body,
    });
    return res.json(cuenta);
  },

  deleteCuenta: async (req, res) => {
    const external_id = req.params.external;
    let cuenta = await Cuenta.findOne({ external_id });
    if (!cuenta) {
      return res.json({ status: 400, message: "La cuenta no existe" });
    }
    const deletedCuenta = await Cuenta.findOneAndUpdate(
      { external_id },
      {
        email: null,
        external_id: uuidv4(),
        deletedAt: new Date(),
        state: "INACTIVA",
      },
      { new: true }
    );
    // const deletedCuenta = await cuentaService.deleteCuenta(req.params.external);
    return res.json(deletedCuenta);
  },
};
