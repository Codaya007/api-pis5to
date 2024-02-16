// const cuentaService = require("../services/cuentaService");
const Cuenta = require("../models/Account");
const { hashPassword } = require("../helpers/hashPassword");
const uuidv4 = require("uuid").v4;

module.exports = {
  getAllAcounts: async (req, res) => {
    const { skip = 0, limit = 10, ...where } = req.query;
    where.deletedAt = null;

    const results = await Cuenta.find(where).skip(skip).limit(limit);
    const totalCount = await Cuenta.countDocuments(where);

    res.status(200).json({ totalCount, results });
  },

  getCuentaByExternalId: async (req, res, next) => {
    const external_id = req.params.external;
    const results = await Cuenta.findOne({ external_id });

    if (!results) {
      return next({ status: 400, msg: "La cuenta no fue encontrada" });
    }

    return res.status(200).json({ msg: "OK", results });
  },

  updateCuenta: async (req, res, next) => {
    const external_id = req.params.external;
    let cuenta = await Cuenta.findOne({ external_id });

    if (!cuenta) {
      return next({ status: 400, msg: "La cuenta no fue encontrada" });
    }

    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }

    req.body.external_id = uuidv4();

    cuenta = await Cuenta.findOneAndUpdate({ external_id }, req.body, {
      new: true,
    });

    return res.status(200).json({ msg: "OK", results: cuenta });
  },

  createCuenta: async (req, res, next) => {
    const cuentaExist = await Cuenta.findOne({ email: req.body.email });
    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    if (cuentaExist) {
      return next({ status: 400, msg: "La cuenta ya existe" });
    }

    const cuenta = await Cuenta.create({
      ...req.body,
    });

    return res.status(201).json({ msg: "OK", results: cuenta });
  },

  deleteCuenta: async (req, res, next) => {
    const external_id = req.params.external;
    let cuenta = await Cuenta.findOne({ external_id });

    if (!cuenta) {
      return next({ status: 400, msg: "La cuenta no existe" });
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

    // console.log(deletedCuenta);

    return res.status(200).json({ msg: "OK", results: deletedCuenta });
  },
};
