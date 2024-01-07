'use strict';
const WeatherConditions = require('../models/weatherConditions');
const mongoose = require('mongoose');
const {validationResult} = require('express-validator');
const { v4: uuidv4 } = require('uuid');

class WeatherConditionsController {
    async initDatabase(req, res) {
        try {
            await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
            const collectionExists = await mongoose.connection.db.listCollections({ name: 'weatherconditions' }).hasNext();

            if (!collectionExists) {
                await mongoose.connection.db.createCollection('weatherconditions');
                res.json({ message: 'Colección creada con éxito.' });
            } else {
                res.json({ message: 'La colección ya existe en la base de datos.' });
            }
        } catch (error) {
            console.error('Error al crear la colección:', error);
        }
    }

    async initializeDatabase() {
        await this.initDatabase();
        console.log('Inicialización de la base de datos completa.');
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