const Sensor = require("../models/Sensor");

module.exports = {
  getSensorById: async (req, res) => {
    const { external_id } = req.params;

    const results = await Sensor.findOne({ external_id });

    if (!results) {
      return res.status(404).json({
        msg: "No se encontro el sensor especificado",
      });
    }

    return res.status(200).json({
      msg: "OK",
      results,
    });
  },

  deleteById: async (req, res) => {
    const { external_id } = req.params;

    const results = await Sensor.deleteOne({ external_id });

    if (!results?.deletedCount) {
      return res.status(404).json({
        msg: "No se encontro el sensor especificado",
      });
    }

    return res.status(200).json({
      msg: "OK",
      results,
    });
  },

  list: async (req, res) => {
    try {
      const { page = 1, limit = 10, ...where } = req.query;

      const totalCount = await Sensor.countDocuments(where);
      const results = await Sensor.find(where)
        .skip((parseInt(page) - 1) * limit)
        .limit(limit)
        .exec();

      res.status(200);
      return res.json({
        msg: "OK",
        totalCount,
        results,
      });
    } catch (error) {
      res.status(400);
      return res.json({ msg: "Algo salió mal", error: error.message });
    }
  },

  createSensor: async (req, res) => {
    try {
      const { name, unitMeasurement } = req.body;

      if (name === undefined || unitMeasurement === undefined) {
        return res.status(400).json({
          msg: "Los campos name, unitMeasurement son requeridos",
        });
      }

      const results = await Sensor.create({ name, unitMeasurement });

      //   console.log({ results });

      return res.status(201).json({
        msg: "OK",
        results,
      });
    } catch (error) {
      return res.status(400).json({
        msg: "Algo salió mal",
        error: error.message,
      });
    }
  },

  updateSensor: async (req, res) => {
    try {
      const { external_id } = req.params;
      const { name, unitMeasurement } = req.body;

      const sensorResult = await Sensor.findOne({ external_id: external_id });

      if (!sensorResult) {
        return res.status(404).json({
          msg: "Sensor no encontrado",
        });
      }

      const results = await Sensor.findOneAndUpdate(
        { external_id },
        { name, unitMeasurement },
        { new: true }
      );

      await results.refreshExternal();

      //   console.log({ results });

      return res.status(201).json({
        msg: "OK",
        results,
      });
    } catch (error) {
      return res.status(400).json({
        msg: "Algo salió mal",
        error: error.message,
      });
    }
  },
};
