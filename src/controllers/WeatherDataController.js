const WeatherData = require("../models/WeatherData");
const moment = require("moment-timezone");

// En esta colección solo se puede:
// Listar (con paginación)
// Registrar datos climáticos
// Obtener datos climáticos por id
// No se puede: Eliminar, editar
class WeatherDataController {
  async list(req, res) {
    const { page = 1, limit = 10, ...where } = req.query;

    const totalCount = await WeatherData.countDocuments(where);
    const data = await WeatherData.find(where)
      .skip((parseInt(page) - 1) * limit)
      .limit(limit)
      .exec();

    res.status(200);
    res.json({
      msg: "OK",
      totalCount,
      data,
    });
  }

  async getById(req, res) {
    const { external_id } = req.params;

    const data = await WeatherData.findOne({
      where: { external_id },
    });

    if (!data) {
      return res.status(404).json({
        msg: "El registro especificado no existe",
      });
    }

    await data.refreshExternal();

    res.status(200).json({
      msg: "OK",
      data,
    });
  }

  async create(req, res) {
    const { windSpeed, temperature, humidity } = req.body;

    try {
      if (
        windSpeed === undefined ||
        temperature === undefined ||
        humidity === undefined
      ) {
        return res.status(400).json({
          msg: "Los campos windSpeed, temperature y humidity son requeridos",
        });
      }

      // Valido los valores enviado individualmente
      if (windSpeed < 0 || windSpeed > 200) {
        return res.status(400).json({
          msg: `El valor del viendo debe ir entre 0 y 200 pero se ha enviado ${windSpeed}`,
        });
      }

      if (temperature < -100 || temperature > 100) {
        return res.status(400).json({
          msg: `El valor de la temperatura debe ir entre -100 y 100 pero se ha enviado ${temperature}`,
        });
      }

      if (humidity < 0 || humidity > 200) {
        return res.status(400).json({
          msg: `El valor de la humedad debe ir entre 0 y 200 pero se ha enviado ${humidity}`,
        });
      }

      moment.tz.setDefault("America/Bogota");
      const dateTime = moment().toDate();

      const data = await WeatherData.create({
        dateTime,
        windSpeed,
        humidity,
        temperature,
      });

      res.status(201).json({
        msg: "OK",
        data,
      });
    } catch (error) {
      res.json({
        msg: "Algo salió mal",
        error: error.message,
      });
    }
  }
}

module.exports = WeatherDataController;
