const pronosticServices = require("../services/pronosticServices");

module.exports = {

    prueba: async (req, res) => {
        // const user = await authService.register(req.body);

        // const payload = { id: user.id };
        console.log({req});
        const ej = await pronosticServices.prueba("ddf")

        return res.json({ ej });
    },
// next?
    createPronostic: async (req, res) => {
        const ej = await pronosticServices.createPronostic(req.body)

        return res.json({ ej });
    },

    getPronosticById: async (req, res) => {
        const { id } = req.params;
        const result = await pronosticServices.getPronosticById(id)

        return res.json({ result });
    },

    getPronosticByDate: async (req, res) => {
        const { initDate, endDate } = req.params;
        // const { initDate, endDate } = req.query;
        const result = await pronosticServices.getPronosticByDate(initDate, endDate)

        return res.json({ result });
    },

};