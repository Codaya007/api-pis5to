'use strict';
const WeatherConditions = require('../models/weatherConditions');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

class WeatherConditionsController {
    async determineWeatherState(req, res) {
        try {
            let errors = validationResult(req);
            if (errors.isEmpty()) {
                const { temperature, humidity, pressure } = req.body;
                const sunnyData = await WeatherConditions.findOne({ weatherType: "SOLEADO" });
                // console.log(sunnyData);
                const cloudyData = await WeatherConditions.findOne({ weatherType: "NUBLADO" });
                // console.log(cloudyData);
                const rainyData = await WeatherConditions.findOne({ weatherType: "LLUVIOSO" });
                // console.log(rainyData);
                let weatherState;
                // Comparación para Soleado
                if (
                    (temperature >= sunnyData.temperatureRange.from &&
                        humidity <= sunnyData.humidityRange.to) ||
                    (temperature >= sunnyData.temperatureRange.from &&
                        pressure >= sunnyData.pressureRange.from)
                ) {
                    weatherState = sunnyData;
                }
                // Comparación para Nublado
                else if (
                    (temperature >= cloudyData.temperatureRange.from &&
                        temperature <= cloudyData.temperatureRange.to &&
                        humidity >= cloudyData.humidityRange.from &&
                        humidity <= cloudyData.humidityRange.to) ||
                    (temperature >= cloudyData.temperatureRange.from &&
                        temperature <= cloudyData.temperatureRange.to &&
                        pressure >= cloudyData.pressureRange.from &&
                        pressure <= cloudyData.pressureRange.to)
                ) {
                    weatherState = cloudyData;
                }
                // Comparación para Lluvioso
                else if (
                    (temperature <= rainyData.temperatureRange.to &&
                        humidity >= rainyData.humidityRange.from &&
                        humidity <= rainyData.humidityRange.to) ||
                    (temperature <= rainyData.temperatureRange.to &&
                        pressure <= rainyData.pressureRange.to)
                ) {
                    weatherState = rainyData;
                }
                res.json({
                    weatherState
                });
            } else {
                res.status(400).json({ msg: "Datos faltantes", code: 400, errors: errors.array() });
            }
        } catch (error) {
            console.error('Error al determinar el estado climático:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async save(req, res) {
                try {
                    let errors = validationResult(req);
                    if (req.body.hasOwnProperty('weatherType') && req.body.hasOwnProperty('description')) {
                        if (errors.isEmpty()) {
                            const data = {
                                weatherType: req.body.weatherType,
                                description: req.body.description,
                                pressureRange: {
                                    from: req.body.pressureFrom,
                                    to: req.body.pressureTo
                                },
                                temperatureRange: {
                                    from: req.body.temperatureFrom,
                                    to: req.body.temperatureTo
                                },
                                humidityRange: {
                                    from: req.body.humidityFrom,
                                    to: req.body.humidityTo
                                }
                            };

                            const weatherConditions = new WeatherConditions(data);
                            await weatherConditions.save();

                            res.json({ msg: "Se han registrado los datos", code: 200 });
                        } else {
                            res.status(400).json({ msg: "Datos faltantes", code: 400, errors: errors.array() });
                        }
                    } else {
                        res.status(400).json({ msg: "Datos faltantes", code: 400, errors: "weatherType y description son obligatorios" });
                    }
                } catch (error) {
                    res.status(500).json({ msg: "Error interno del servidor", code: 500, error: error.message });
                }
            }

    async list(req, res) {
                try {
                    const weatherConditions = await WeatherConditions.find({}, { __v: 0 });

                    res.json({ msg: 'OK!', code: 200, info: weatherConditions });
                } catch (error) {
                    console.error('Error al listar condiciones climáticas:', error);
                    res.status(500).json({ msg: 'Error interno del servidor', code: 500 });
                }
            }

    async getByExternalId(req, res) {
                try {
                    const externalId = req.params.external_id;

                    // Busca un documento por su external_id
                    const weatherCondition = await WeatherConditions.findOne({ external_id: externalId }, { __v: 0 });

                    if (weatherCondition) {
                        res.json({ msg: 'OK!', code: 200, info: weatherCondition });
                    } else {
                        res.status(404).json({ msg: 'Documento no encontrado', code: 404 });
                    }
                } catch (error) {
                    console.error('Error al obtener la condición climática:', error);
                    res.status(500).json({ msg: 'Error interno del servidor', code: 500 });
                }
            }

    async modify(req, res) {
                try {
                    const externalId = req.body.external_id;

                    // Encuentra y actualiza la condición climática por su external_id
                    const result = await WeatherConditions.findOneAndUpdate(
                        { external_id: externalId },
                        {
                            weatherType: req.body.weatherType,
                            description: req.body.description,
                            pressureRange: {
                                from: req.body.pressureFrom,
                                to: req.body.pressureTo
                            },
                            temperatureRange: {
                                from: req.body.temperatureFrom,
                                to: req.body.temperatureTo
                            },
                            humidityRange: {
                                from: req.body.humidityFrom,
                                to: req.body.humidityTo
                            },
                            external_id: uuidv4(), // Asigna un nuevo external_id (opcional)
                        },
                        { new: true } // Devuelve el documento actualizado
                    );

                    if (result) {
                        res.status(200).json({ msg: 'Se ha modificado la condición climática', code: 200, info: result });
                    } else {
                        res.status(400).json({ msg: 'No se han guardado los cambios', code: 400 });
                    }
                } catch (error) {
                    console.error('Error al modificar condición climática:', error);
                    res.status(500).json({ msg: 'Error interno del servidor', code: 500 });
                }
            }

        }

        module.exports = WeatherConditionsController;