const pronosticServices = require("../services/pronosticServices");
const weatherConditionsServices = require("../services/weatherConditionsServices");
const Pronostic = require("../models/Pronostic");
const WeatherData = require("../models/WeatherData");

const moment = require("moment-timezone");
const WeatherConditions = require("../models/weatherConditions");
moment.tz.setDefault("America/Bogota");

const HORAS_DIA = 23;

module.exports = {
    createPronostic: async (req, res) => {
        try {
            // Variable para trabajar con fechas
            let dateTime = moment();

            // Se recupera todos los datos climáticos hasta la fecha
            const weatherDataResult = await WeatherData.find();

            // Se valida que los datos climáticos
            if (!weatherDataResult || weatherDataResult.length == 0) {
                return res.status(400).json({
                    msg: "Hubo un error al recuperar los datos climáticos o no se recupero ninguno",
                });
            }

            // Ordena las fechas desde la fecha más antigua hasta la más actual. (Siendo la más antigua la última)
            weatherDataResult.sort((a, b) => b.dateTime - a.dateTime);

            // Mapeamos la data y solo extraemos los datos importantes
            let arrayDatos = weatherDataResult.map(element => {
                return {
                    windSpeed: element.windSpeed,
                    temperature: element.temperature,
                    humidity: element.humidity,
                    barometricPressure: element.barometricPressure
                }
            });

            let arrayPronosticos = [];

            // Se obtiene la hora del día y se la resta por 24 horas para obtener las horas faltantes, que serán igual al número de pronosticos que se realizarán
            const limite = parseInt(dateTime.startOf('hour').format('HH:mm').split(':')[0]);
            console.log({ limite });
            for (let index = 0; index < (HORAS_DIA - limite); index++) {
                // Generación del pronóstico, con la data recibida
                const pronostic = await pronosticServices.generatePronostic(arrayDatos);
                // Array que se va a actualizar para generar los demás arrays
                arrayDatos.push(pronostic);
                // Array que se va a utilizar para crear o actualizar pronosticos en bd
                arrayPronosticos.push(pronostic);
            }

            // Se llena el array para las condiciones climaticas
            let arrayWeatherConditions = [];
            for (let index = 0; index < arrayPronosticos.length; index++) {
                // Todo añadir a la función, los demás parametros que faltan (velodicada del viento, presion)
                // todo añadir una forma de arreglar, si no entra en ningun parametro
                const weatherConditionsResult = await weatherConditionsServices.getWeatherConditionsByParameters(arrayPronosticos[index].temperature, arrayPronosticos[index].humidity, arrayPronosticos[index].pressure);
                // if (!weatherConditionsResult) {
                //     return res.status(404).json({
                //         msg: "Ninguna condición climática corresponde al pronóstico",
                //     });
                // }
                arrayWeatherConditions.push(weatherConditionsResult._id);
            }

            let pronosticos = [];
            for (let index = 0; index < arrayPronosticos.length; index++) {
                // Reiniciamos el tiempo
                dateTime = moment();
                dateTime = dateTime.startOf('hour').add((index + 1), 'hour');
                // dateTime = dateTime.format(); // Para formatear a formato local

                // Construimos el array de pronosticos a crear o modificar
                pronosticos.push({
                    dateTime,
                    windSpeed: arrayPronosticos[index].windSpeed,
                    temperature: arrayPronosticos[index].temperature,
                    humidity: arrayPronosticos[index].humidity,
                    barometricPressure: arrayPronosticos[index].barometricPressure,
                    pronostic: arrayWeatherConditions[index]
                })
            }

            //! Eliminar despues
            // Promise.all(pronosticos.map(pronostico => Pronostic.create(pronostico)))
            //     .catch(error => {
            //         console.error("Error insertar:", error);
            //     });

            if (HORAS_DIA + 1 == (HORAS_DIA + 1 - limite)) {
                // Creamos pronósticos porque es un nuevo día
                Promise.all(pronosticos.map(pronostico => Pronostic.create(pronostico)))
                    .catch(error => {
                        console.error("Error insertar:", error);
                    });
            } else {
                // Se los actualiza
                Promise.all(pronosticos.map(async (pronostico) => {
                    const filtro = { dateTime: pronostico.dateTime };
                    const actualizacion = {
                        $set: {
                            windSpeed: pronostico.windSpeed,
                            temperature: pronostico.temperature,
                            humidity: pronostico.humidity,
                            barometricPressure: pronostico.barometricPressure,
                            pronostic: pronostico.pronostic,
                        }
                    };

                    await Pronostic.updateOne(filtro, actualizacion);
                }))
                    .catch((error) => {
                        console.error("Error:", error);
                    });
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

    list: async (req, res) => {
        const { page = 1, limit = 10, populate = false, ...where } = req.query;

        let weatherConditionsResult = null;

        where.deletedAt = null;

        const totalCount = await Pronostic.countDocuments(where);
        let data = await Pronostic.find(where)
            .skip((parseInt(page) - 1) * limit)
            .limit(limit)
            .exec();

        if (populate) {
            data = await Promise.all(data.map(async (element) => {
                weatherConditionsResult = await WeatherConditions.findOne({ _id: element.pronostic });
                element.pronostic = weatherConditionsResult;
                return element;
            }));
        }

        data.sort((a, b) => b.dateTime - a.dateTime);

        res.status(200);
        res.json({
            msg: "OK",
            totalCount,
            data,
        });
    },

    getPronosticById: async (req, res) => {
        const { populate = false } = req.query;
        const { external_id } = req.params;

        let data = await Pronostic.findOne({ external_id })

        if (!data) {
            return res.status(404).json({
                msg: "No se encontro el registro especificado"
            })
        }

        if (populate) {
            const weatherConditionsResult = await WeatherConditions.findOne({ _id: data.pronostic });
            if (!weatherConditionsResult) {
                return res.status(404).json({
                    msg: "No se encontro una condición climática"
                })
            }
            data.pronostic = weatherConditionsResult;
        }

        res.status(200).json({
            msg: "OK",
            data,
        });
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

        //! probar funcionalidad
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
        // const fechaFin = moment(endDate);

        where.deletedAt = null;
        where.dateTime = {
            $gte: fechaInicio.format(),
            $lte: fechaFin.format(),
        };

        const totalCount = await Pronostic.countDocuments(where);
        let data = await Pronostic.find(where)
            .skip((parseInt(page) - 1) * limit)
            .limit(limit)
            .exec();

        data.sort((a, b) => b.dateTime - a.dateTime);

        if (populate) {
            data = await Promise.all(data.map(async (element) => {
                const weatherConditionsResult = await WeatherConditions.findOne({ _id: element.pronostic });
                element.pronostic = weatherConditionsResult;
                return element;
            }));
        }

        res.status(200);
        res.json({
            msg: "OK",
            totalCount,
            data,
        });
    },

    // Se genera un pronóstico, pero no se guarda en base de datos. Para casos donde se envie un reporte y se quiera saber el pronóstico
    getGeneratePronosticByDate: async (req, res) => {
        //* Agregar campo 'p' en caso de seguir el modelo de Hots Winter
        // todo deberia de considerarse el de hots winters
        try {
            // Variable para trabajar con fechas
            let dateTime = moment();

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

            // Validar que endDate no sea mayor que la fecha actual
            const currentDate = moment();
            const endDateMoment = moment(endDate);

            if (endDateMoment.isAfter(currentDate)) {
                return res.status(400).json({
                    msg: "La fecha límite no puede ser mayor que la fecha actual",
                });
            }

            // Se formatea las fechas para poder trabajar con ellas
            const fechaInicio = moment(initDate);
            const fechaFin = moment(endDate).startOf('day').add(1, 'day');

            // Se recupera los datos climáticos dentro del rango de fechas
            const weatherDataResult = await WeatherData.find({
                dateTime: {
                    $gte: fechaInicio.format(),
                    $lte: fechaFin.format(),
                },
            });

            // Se valida que los datos climáticos
            if (!weatherDataResult || weatherDataResult.length == 0) {
                return res.status(400).json({
                    msg: "Hubo un error al recuperar los datos climáticos o no se recupero ninguno",
                });
            }

            // Ordena las fechas desde la fecha más antigua hasta la más actual. (Siendo la más antigua la última)
            weatherDataResult.sort((a, b) => b.dateTime - a.dateTime);

            // Mapeamos la data y solo extraemos los datos importantes
            let arrayDatos = weatherDataResult.map(element => {
                return {
                    windSpeed: element.windSpeed,
                    temperature: element.temperature,
                    humidity: element.humidity,
                    barometricPressure: element.barometricPressure
                }
            });

            let arrayPronosticos = [];

            // Se obtiene la hora del día y se la resta por 24 horas para obtener las horas faltantes, que serán igual al número de pronosticos que se realizarán
            const limite = parseInt(dateTime.startOf('hour').format('HH:mm').split(':')[0]);
            console.log({ limite });
            for (let index = 0; index < (HORAS_DIA - limite); index++) {
                // Generación del pronóstico, con la data recibida
                const pronostic = await pronosticServices.generatePronostic(arrayDatos);
                // Array que se va a actualizar para generar los demás arrays
                arrayDatos.push(pronostic);
                // Array que se va a utilizar para crear o actualizar pronosticos en bd
                arrayPronosticos.push(pronostic);
            }

            // Se llena el array para las condicoines climaticas
            let arrayWeatherConditions = [];
            for (let index = 0; index < arrayPronosticos.length; index++) {
                // Todo añadir a la función, los demás parametros que faltan (velodicada del viento, presion)
                // todo añadir una forma de arreglar, si no entra en ningun parametro
                const weatherConditionsResult = await weatherConditionsServices.getWeatherConditionsByParameters(arrayPronosticos[index].temperature, arrayPronosticos[index].humidity, arrayPronosticos[index].pressure);
                // if (!weatherConditionsResult) {
                //     return res.status(404).json({
                //         msg: "Ninguna condición climática corresponde al pronóstico",
                //     });
                // }
                arrayWeatherConditions.push(weatherConditionsResult._id);
            }

            let pronosticos = [];
            for (let index = 0; index < arrayPronosticos.length; index++) {
                // Reiniciamos el tiempo
                dateTime = moment();
                dateTime = dateTime.startOf('hour').add((index + 1), 'hour');
                dateTime = dateTime.format(); // Para formatear a formato local

                // Construimos el array de pronosticos a crear o modificar
                pronosticos.push({
                    dateTime,
                    windSpeed: arrayPronosticos[index].windSpeed,
                    temperature: arrayPronosticos[index].temperature,
                    humidity: arrayPronosticos[index].humidity,
                    barometricPressure: arrayPronosticos[index].barometricPressure,
                    pronostic: arrayWeatherConditions[index]
                })
            }

            if (populate) {
                pronosticos = await Promise.all(pronosticos.map(async (element) => {
                    const weatherConditionsResult = await WeatherConditions.findOne({ _id: element.pronostic });
                    element.pronostic = weatherConditionsResult;
                    return element;
                }));
            }


            res.status(201).json({
                msg: "OK",
                pronosticos,
            });
        } catch (error) {
            res.status(400).json({
                msg: "Algo salió mal",
                error: error.message,
            });
        }
    },

};