const pronosticServices = require("../services/pronosticServices");
const weatherConditionsServices = require("../services/weatherConditionsServices");
const Pronostic = require("../models/Pronostic");
const WeatherData = require("../models/WeatherData");

const moment = require("moment-timezone");


module.exports = {
    createPronostic: async (req, res) => {
        try {
            // Se obtiene el rango de fechas
            const { initDate, endDate } = req.params;

            // Se valida que el rango de fechas sea válido
            if (
                initDate === undefined || initDate === "" ||
                endDate === undefined || endDate === ""
            ) {
                return res.status(400).json({
                    msg: "Falta especificar el rango de fechas",
                });
            }

            // Se recupera los datos climáticos dentro del rango de fechas
            const weatherDataResult = await WeatherData.find({
                dateTime: {
                    $gte: initDate,
                    $lte: endDate,
                },
            });

            console.log({ weatherDataResult });

            // Se valida que los datos climáticos
            if (!weatherDataResult || weatherDataResult.length == 0) {
                return res.status(400).json({
                    msg: "Hubo un error al recuperar los datos climáticos o no se recupero ninguno",
                });
            }

            // Se llama al modelo matemático para generar el pronostico
            //? Debe enviar el pronostico sobre temperatura, humedad y velocidad del viento (cambiar en caso )
            const pronositc = await pronosticServices.generatePronostic(weatherDataResult);

            // Se busca la condición climática para que coincida con el pronóstico
            const weatherConditionsResult = await weatherConditionsServices.getWeatherConditionsByParameters(pronositc.temperature, pronositc.humidity, pronositc.pressure);

            if (!weatherConditionsResult) {
                return res.status(404).json({
                    msg: "Ninguna condición climática corresponde al pronóstico",
                });
            }

            moment.tz.setDefault("America/Bogota");
            let dateTime = moment();
            dateTime = dateTime.startOf('hour').add(1, 'hour');
            dateTime = dateTime.toDate();

            console.log({ dateTime });

            const result = await Pronostic.create({ dateTime, pronostic: weatherConditionsResult._id, weatherData: weatherDataResult.map((data) => data._id), image: `http://localhost:3000/${weatherConditionsResult.image}` });

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

    // Se genera un pronóstico, pero no se guarda en base de datos. Para casos donde se envie un reporte y se quiera saber el pronóstico
    getGeneratePronosticByDate: async (req, res) => {
        //* Agregar campo 'p' en caso de seguir el modelo de Hots Winter

        try {
            // Se obtiene el rango de fechas
            const { initDate, endDate } = req.params;
            const { populate = false } = req.query;

            // Se valida que el rango de fechas sea válido
            if (
                initDate === undefined || initDate === "" ||
                endDate === undefined || endDate === ""
            ) {
                return res.status(400).json({
                    msg: "Falta especificar el rango de fechas",
                });
            }

            // Se recupera los datos climáticos dentro del rango de fechas
            const weatherDataResult = await WeatherData.find({
                dateTime: {
                    $gte: initDate,
                    $lte: endDate,
                },
            });

            // Se valida que los datos climáticos
            if (!weatherDataResult || weatherDataResult.length == 0) {
                return res.status(400).json({
                    msg: "Hubo un error al recuperar los datos climáticos o no se recupero ninguno",
                });
            }

            // Se llama al modelo matemático para generar el pronostico
            //? Debe enviar el pronostico sobre temperatura, humedad y velocidad del viento (cambiar en caso )
            const pronositc = await pronosticServices.generatePronostic(weatherDataResult);

            // Se busca la condición climática para que coincida con el pronóstico
            const weatherConditionsResult = await weatherConditionsServices.getWeatherConditionsByParameters(pronositc.temperature, pronositc.humidity, pronositc.pressure);

            if (!weatherConditionsResult) {
                return res.status(404).json({
                    msg: "Ninguna condición climática corresponde al pronóstico",
                });
            }

            moment.tz.setDefault("America/Bogota");
            let dateTime = moment();
            dateTime = dateTime.startOf('hour').add(1, 'hour');
            dateTime = dateTime.toDate();

            console.log({ dateTime });

            const result = { dateTime, pronostic: populate ? weatherConditionsResult : weatherConditionsResult.external_id, weatherData: weatherDataResult.map((data) => data._id), image: `http://localhost:3000/${weatherConditionsResult.image}` };

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

};