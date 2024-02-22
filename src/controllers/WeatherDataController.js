const { FORMAT_BOOLEAN } = require("../constants");
const WeatherData = require("../models/WeatherData");
const moment = require("moment-timezone");
const {
  getWeatherConditionsByParameters,
} = require("../services/weatherConditionsServices");

// En esta colección solo se puede:
// Listar (con paginación)
// Registrar datos climáticos
// Obtener datos climáticos por id
// No se puede: Eliminar, editar
class WeatherDataController {
  async list(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        since,
        until,
        populate = false,
        ...where
      } = req.query;
      const formatedPopulate = FORMAT_BOOLEAN[populate];

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

      // console.log({ where });

      const totalCount = await WeatherData.countDocuments(where);
      const results = formatedPopulate
        ? await WeatherData.find(where)
            .skip((parseInt(page) - 1) * limit)
            .limit(limit)
            .populate("state", ["weatherType", "image", "description"])
            .sort({ createdAt: -1 })
            .exec()
        : await WeatherData.find(where)
            .skip((parseInt(page) - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .exec();

      res.status(200).json({
        msg: "OK",
        totalCount,
        results,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error interno del servidor" });
    }
  }

  async getById(req, res) {
    const { external_id } = req.params;

    const results = await WeatherData.findOne({
      external_id,
    });

    if (!results) {
      return res.status(404).json({
        msg: "El registro especificado no existe",
      });
    }

    // await results.refreshExternal();

    res.status(200).json({
      msg: "OK",
      results,
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

      const pronostic = await getWeatherConditionsByParameters(
        temperature,
        humidity,
        barometricPressure
      );

      const results = await WeatherData.create({
        dateTime,
        windSpeed,
        humidity,
        temperature,
        barometricPressure,
        state: pronostic.id,
      });

      res.status(201).json({
        msg: "OK",
        results,
      });
    } catch (error) {
      res.json({
        msg: "Algo salió mal",
        error: error.message,
      });
    }
  }

  // Controlador para obtener estadísticas agrupadas por hora
  async getHourlyStatistics(req, res, next) {
    try {
      const { date } = req.query;

      moment.tz.setDefault("America/Guayaquil");
      const sinceDate = moment(date).startOf("day");
      const untilDate = moment(date).endOf("day");
      // console.log({ sinceDate, untilDate });

      const hourlyStatistics = await WeatherData.aggregate([
        {
          $match: {
            dateTime: { $gte: sinceDate.toDate(), $lte: untilDate.toDate() },
          },
        },
        {
          $addFields: {
            hourOfDay: {
              $hour: { date: "$dateTime", timezone: "America/Guayaquil" },
            },
          },
        },
        {
          $group: {
            _id: {
              date: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$dateTime",
                  timezone: "America/Guayaquil",
                },
              },
              hour: "$hourOfDay",
            },
            windSpeed: { $avg: "$windSpeed" },
            temperature: { $avg: "$temperature" },
            humidity: { $avg: "$humidity" },
            barometricPressure: { $avg: "$barometricPressure" },
            count: { $sum: 1 }, // Contador para calcular el total de documentos en el grupo
          },
        },
        {
          $sort: {
            "_id.date": 1,
            "_id.hour": 1,
          },
        },
      ]);

      // Redondear los promedios a 2 decimales
      hourlyStatistics.forEach((stat) => {
        const hour = stat._id?.hour || 0;

        stat.hour = hour;
        stat.label = `${hour}:00 ${stat._id?.hour > 12 ? "pm" : "am"}`;
        stat.windSpeed = stat.windSpeed.toFixed(2);
        stat.temperature = stat.temperature.toFixed(2);
        stat.humidity = stat.humidity.toFixed(2);
        stat.barometricPressure = stat.barometricPressure.toFixed(2);
      });

      // Luego puedes enviar hourlyStatistics como respuesta
      return res.json(hourlyStatistics);
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({ msg: "Error al obtener estadísticas agrupadas por hora" });
    }
  }
}

module.exports = WeatherDataController;
