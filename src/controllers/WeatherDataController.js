const WeatherData = require("../models/WeatherData");
const moment = require("moment-timezone");

// En esta colección solo se puede:
// Listar (con paginación)
// Registrar datos climáticos
// Obtener datos climáticos por id
// No se puede: Eliminar, editar
class WeatherDataController {
  async list(req, res) {
    try {
      const { page = 1, limit = 10, since, until, ...where } = req.query;

      where.deletedAt = null;

      moment.tz.setDefault("America/Guayaquil");

      // Las fechas since y until sirven para filtrar por fecha
      const dateTime = {};

      if (since) {
        // Valido since como fecha o fecha y hora
        if (
          !moment(
            since,
            ["YYYY/MM/DD", "YY/MM/DD", moment.ISO_8601],
            true
          ).isValid()
        ) {
          return res.status(400).json({
            msg: "El campo 'since' no es válido, debe estar en formato YYYY/MM/DD, YY/MM/DD o YYYY-MM-DDTHH:mm:ss.sssZ",
          });
        }

        dateTime["$gte"] = moment(since).toDate();
      } else {
        dateTime["$gte"] = moment().startOf("year").toDate();
      }

      if (until) {
        // Validar until como fecha o fecha y hora
        if (
          !moment(
            until,
            ["YYYY/MM/DD", "YY/MM/DD", moment.ISO_8601],
            true
          ).isValid()
        ) {
          return res.status(400).json({
            msg: "El campo 'until' no es válido, debe estar en formato YYYY/MM/DD, YY/MM/DD o YYYY-MM-DDTHH:mm:ss.sssZ",
          });
        }

        dateTime["$lte"] = moment(until).toDate();
      }

      where.dateTime = dateTime;

      console.log({ where });

      const totalCount = await WeatherData.countDocuments(where);
      const data = await WeatherData.find(where)
        .skip((parseInt(page) - 1) * limit)
        .limit(limit)
        .sort("dateTime DESC")
        .exec();

      res.status(200).json({
        msg: "OK",
        totalCount,
        data,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error interno del servidor" });
    }
  }

  async getById(req, res) {
    const { external_id } = req.params;

    const data = await WeatherData.findOne({
      external_id,
    });

    if (!data) {
      return res.status(404).json({
        msg: "El registro especificado no existe",
      });
    }

    // await data.refreshExternal();

    res.status(200).json({
      msg: "OK",
      data,
    });
  }

  async create(req, res) {
    const { windSpeed, temperature, humidity, barometricPressure } = req.body;

    try {
      // if (
      //   // windSpeed === undefined ||
      //   temperature === undefined ||
      //   barometricPressure === undefined ||
      //   humidity === undefined
      // ) {
      //   return res.status(400).json({
      //     msg: "Los campos windSpeed, temperature y humidity son requeridos",
      //   });
      // }

      // // Valido los valores enviado individualmente
      // if (windSpeed && (windSpeed < 0 || windSpeed > 200)) {
      //   return res.status(400).json({
      //     msg: `El valor del viendo debe ir entre 0 y 200 pero se ha enviado ${windSpeed}`,
      //   });
      // }

      // if (temperature < -100 || temperature > 100) {
      //   return res.status(400).json({
      //     msg: `El valor de la temperatura debe ir entre -100 y 100 pero se ha enviado ${temperature}`,
      //   });
      // }

      // if (humidity < 0 || humidity > 200) {
      //   return res.status(400).json({
      //     msg: `El valor de la humedad debe ir entre 0 y 200 pero se ha enviado ${humidity}`,
      //   });
      // }

      // if (barometricPressure < 0 || barometricPressure > 2000) {
      //   return res.status(400).json({
      //     msg: `El valor de la presión atmosférica debe ir entre 0 y 2000 pero se ha enviado ${barometricPressure}`,
      //   });
      // }

      moment.tz.setDefault("America/Bogota");
      const dateTime = moment().toDate();

      const data = await WeatherData.create({
        dateTime,
        windSpeed,
        humidity,
        temperature,
        barometricPressure,
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
