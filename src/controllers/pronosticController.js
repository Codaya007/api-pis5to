const weatherConditionsServices = require("../services/weatherConditionsServices");
const Pronostic = require("../models/Pronostic");
const WeatherConditions = require("../models/weatherConditions");
const axios = require('axios')

const moment = require("moment-timezone");
moment.tz.setDefault("America/Bogota");

const HORAS_DIA = 23;

module.exports = {
    list: async (req, res) => {
        const { page = 1, limit = 10, populate = false, ...where } = req.query;

        let weatherConditionsResult = null;

        where.deletedAt = null;

        const totalCount = await Pronostic.countDocuments(where);
        let results = await Pronostic.find(where)
            .skip((parseInt(page) - 1) * limit)
            .limit(limit)
            .exec();

        if (populate) {
            results = await Promise.all(results.map(async (element) => {
                weatherConditionsResult = await WeatherConditions.findOne({ _id: element.pronostic });
                element.pronostic = weatherConditionsResult;
                return element;
            }));
        }

        results.sort((a, b) => b.dateTime - a.dateTime);

        res.status(200);
        res.json({
            msg: "OK",
            totalCount,
            results,
        })
    },

    getPronosticById: async (req, res) => {
        const { populate = false } = req.query;
        const { external_id } = req.params;

        let results = await Pronostic.findOne({ external_id })

        if (!results) {
            return res.status(404).json({
                msg: "No se encontro el registro especificado"
            })
        }

        if (populate) {
            const weatherConditionsResult = await WeatherConditions.findOne({ _id: results.pronostic });
            if (!weatherConditionsResult) {
                return res.status(404).json({
                    msg: "No se encontro una condición climática"
                })
            }
            results.pronostic = weatherConditionsResult;
        }

        res.status(200).json({
            msg: "OK",
            results,
        });
    },

    createPronostic: async (req, res) => {
        try {

            // TODO descomentar mas tarde cuando todo este listo
            let response = await axios.get('http://127.0.0.1:5000/pronostico');
            response = response.data

            // const response = {
            //     "barometricPressure": {
            //       "2024-02-10T08:19": 1055.5534759018237,
            //       "2024-02-10T09:19": 1055.578407417746,
            //       "2024-02-10T10:19": 1055.608316137896,
            //       "2024-02-10T11:19": 1055.6351727415365
            //     },
            //     "humidity": {
            //       "2024-02-10T08:19": 18.212445967978613,
            //       "2024-02-10T09:19": 18.21101177660765,
            //       "2024-02-10T10:19": 18.211000190979505,
            //       "2024-02-10T11:19": 18.211027849408538
            //     },
            //     "temperature": {
            //       "2024-02-10T08:19": 74.79762054702636,
            //       "2024-02-10T09:19": 74.63749691974127,
            //       "2024-02-10T10:19": 74.47417217595813,
            //       "2024-02-10T11:19": 74.49829894392397
            //     }
            //   }


            formatedPronostics = []
            // Recorremos segun el length de la data interna de cada campo
            for (let i = 0; i < Object.keys(response['barometricPressure']).length; i++) {
                let pronostico = {}

                // Recorremos cada campo
                for (let field in response) {
                    temp = Object.keys(response[field])
                    console.log({ field });
                    console.log({ temp });
                    if (pronostico['dateTime'] == null) {
                        pronostico['dateTime'] = temp[i]
                    }
                    pronostico[field] = response[field][temp[i]]
                }
                // todo: funcion para saber en que condicion climatica estamos
                pronostico['pronostic'] = '65ca89d086b1b420d1c7d385'
                formatedPronostics.push(pronostico)
            }

            // Se guardan los pronosticos en bd
            for (let i = 0; i < formatedPronostics.length; i++) {
                await Pronostic.create(formatedPronostics[i]);
            }

            res.status(201).json({
                msg: "Se crearon los pronosticos satisfactoriamente",
            });
        } catch (error) {
            res.status(400).json({
                msg: "Algo salió mal",
                error: error.message,
            });
        }
    },

    getPronosticByDate: async (req, res) => {
        const { initDate, endDate } = req.params;
        const { page = 1, limit = 10, populate = false, ...where } = req.query;

        if (
            initDate === undefined || initDate === "" ||
            endDate === undefined || endDate === ""
        ) {
            return res.status(400).json({
                msg: "Falta especificar el rango de fechas",
            });
        }

        //? Verificar si las fechas enviadas son válidas
        const isValidInitDate = moment(initDate, 'YYYY-MM-DD', true).isValid();
        const isValidEndDate = moment(endDate, 'YYYY-MM-DD', true).isValid();

        if (!isValidInitDate || !isValidEndDate) {
            return res.status(400).json({
                msg: "Las fechas enviadas no son válidas",
            });
        }

        //* Validar que endDate no sea mayor que la fecha actual
        const currentDate = moment();
        const endDateMoment = moment(endDate);

        if (endDateMoment.isAfter(currentDate)) {
            return res.status(400).json({
                msg: "La fecha límite no puede ser mayor que la fecha actual",
            });
        }

        const fechaInicio = moment(initDate);
        const fechaFin = moment(endDate).startOf('day').add(1, 'day');

        where.deletedAt = null;
        where.dateTime = {
            $gte: fechaInicio.format(),
            $lte: fechaFin.format(),
        };

        const totalCount = await Pronostic.countDocuments(where);
        let results = await Pronostic.find(where)
            .sort({ dateTime: -1 })
            .skip((parseInt(page) - 1) * limit)
            .limit(limit)
            .exec();

        console.log({ results });

        if (populate) {
            results = await Promise.all(results.map(async (element) => {
                const weatherConditionsResult = await WeatherConditions.findOne({ _id: element.pronostic });
                element.pronostic = weatherConditionsResult;
                return element;
            }));
        }

        res.status(200);
        res.json({
            msg: "OK",
            totalCount,
            results,
        });
    },


    //* Se genera un pronóstico, pero no se guarda en base de datos. Para casos donde se envie un reporte y se quiera saber el pronóstico
    getGeneratePronosticByDate: async (req, res) => {
        try {
            const { initDate, endDate } = req.params;
            const { populate = false, ...where } = req.query;

            if (
                initDate === undefined || initDate === "" ||
                endDate === undefined || endDate === ""
            ) {
                return res.status(400).json({
                    msg: "Falta especificar el rango de fechas",
                });
            }

            //? Verificar si las fechas enviadas son válidas
            const isValidInitDate = moment(initDate, 'YYYY-MM-DD', true).isValid();
            const isValidEndDate = moment(endDate, 'YYYY-MM-DD', true).isValid();

            if (!isValidInitDate || !isValidEndDate) {
                return res.status(400).json({
                    msg: "Las fechas enviadas no son válidas",
                });
            }

            //* Validar que endDate no sea mayor que la fecha actual
            const currentDate = moment();
            const endDateMoment = moment(endDate);

            if (endDateMoment.isAfter(currentDate)) {
                return res.status(400).json({
                    msg: "La fecha límite no puede ser mayor que la fecha actual",
                });
            }

            const fechaInicio = moment(initDate);
            const fechaFin = moment(endDate).startOf('day').add(1, 'day');

            console.log({fechaInicio});
            console.log({fechaFin});

            let response = await axios.get(`http://127.0.0.1:5000/pronostico/${fechaInicio}/${fechaFin}`);
            response = response.data


            if (populate) {
                pronosticos = await Promise.all(
                    pronosticos.map(async (element) => {
                        const weatherConditionsResult = await WeatherConditions.findOne({
                            _id: element.pronostic,
                        });
                        element.pronostic = weatherConditionsResult;
                        return element;
                    })
                );
            }

            res.status(201).json({
                msg: "OK",
                results: pronosticos,
            });
        } catch (error) {
            res.status(400).json({
                msg: "Algo salió mal",
                error: error.message,
            });
        }
    },
};
