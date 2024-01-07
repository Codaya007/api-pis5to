const pronosticServices = require("../services/pronosticServices");
const Pronostic = require("../models/Pronostic");
const WeatherData = require("../models/WeatherData");
const WeatherConditions = require("../models/weatherConditions");
const moment = require("moment-timezone");


module.exports = {
    createPronostic: async (req, res) => {
        try {
            const { pronostic, wheatherData, image } = req.body;

            if (
                pronostic === undefined ||
                wheatherData === undefined ||
                image === undefined
            ) {
                return res.status(400).json({
                    msg: "Los campos pronostico, datos del clima e imagen son requeridos",
                });
            }

            // const external_id = wheatherData;
            const wheaterDataResult = await WeatherData.findOne({ external_id: wheatherData, });

            if (!wheaterDataResult) {
                return res.status(404).json({
                    msg: "El registro especificado (wheaterData) no existe",
                });
            }

            const wheaterConditionsResult = await WeatherConditions.findOne({ external_id: pronostic, });

            if (!wheaterConditionsResult) {
                return res.status(404).json({
                    msg: "El registro especificado (pronostic) no existe",
                });
            }

            moment.tz.setDefault("America/Bogota");
            const dateTime = moment().toDate();

            const result = await Pronostic.create({ dateTime, pronostic: wheaterConditionsResult._id, wheatherData: wheaterDataResult._id, image: image }); // TODO, quitar para obtener pronositc


            await wheaterDataResult.refreshExternal();

            console.log({ result });

            res.status(201).json({
                msg: "OK",
                result,
            });
        } catch (error) {
            res.status(400).json({
                msg: "Algo salió mal",
                error: error.message,
            });
        }
    },

    list: async (req, res) => {
        const { page = 1, limit = 10, ...where } = req.query;

        where.deletedAt = null;

        const totalCount = await Pronostic.countDocuments(where);
        const data = await Pronostic.find(where)
            .skip((parseInt(page) - 1) * limit)
            .limit(limit)
            .exec();

        res.status(200);
        res.json({
            msg: "OK",
            totalCount,
            data,
        });
    },

    getPronosticById: async (req, res) => {
        const { external_id } = req.params;

        // const result = await pronosticServices.getPronosticById(id)
        const result = await Pronostic.findOne({ external_id })

        if (!result) {
            return res.status(404).json({
                msg: "No se encontro el registro especificado"
            })
        }

        // await result.refreshExternal();

        res.status(200).json({
            msg: "OK",
            result,
        });
    },

    getPronosticByDate: async (req, res) => {
        const { initDate, endDate } = req.params;
        const { page = 1, limit = 10, ...where } = req.query;

        where.deletedAt = null;
        where.dateTime = {
            $gte: initDate,
            $lte: endDate,
        };

        // const result = await pronosticServices.getPronosticByDate(initDate, endDate)

        const totalCount = await Pronostic.countDocuments(where);
        const result = await Pronostic.find(where)
            .skip((parseInt(page) - 1) * limit)
            .limit(limit)
            .exec();

        res.status(200);
        res.json({
            msg: "OK",
            totalCount,
            result,
        });
    },

};