const cuentaService = require("../services/cuentaService");

module.exports = {
  getAllAcounts: async (req, res) => {
    const { skip = 0, limit = 10, ...where } = req.query;
    const results = await cuentaService.getAllCuentas(where, skip, limit);
    const totalCount = await cuentaService.getCountCuentas(where);

    res.json({ totalCount, results });
  },

  getCuentaByExternalId: async (req, res, next) => {
    const { external } = req.params;
    const cuenta = await cuentaService.getCuentaByExternalId(external);
    return res.json(cuenta);
  },

  updateCuenta: async (req, res, next) => {
    const { external } = req.params;
    const cuenta = await cuentaService.updateCuenta(external, req.body);
    return res.json(cuenta);
  },

  createCuenta: async (req, res) => {
    const cuenta = await cuentaService.createCuenta(req.body);
    return res.json(cuenta);
  },

  deleteCuenta: async (req, res) => {
    console.log(req.params.external);
    const deletedCuenta = await cuentaService.deleteCuenta(req.params.external);
    return res.json(deletedCuenta);
  },
};
