const Account = require("../models/Account");
const Sensor = require("../models/Sensor");
const Node = require("../models/Node");
const Rol = require("../models/Rol");

module.exports = {
  getNodeById: async (req, res) => {
    const { external_id } = req.params;

    const results = await Node.findOne({ external_id });

    if (!results) {
      return res.status(404).json({
        msg: "No se encontro el nodo especificado",
      });
    }

    return res.status(200).json({
      msg: "OK",
      results,
    });
  },

  deleteNodeById: async (req, res) => {
    const { external_id } = req.params;

    const results = await Node.deleteOne({ external_id });

    if (!results?.deletedCount) {
      return res.status(404).json({
        msg: "No se encontro el nodo especificado",
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

      const totalCount = await Node.countDocuments(where);
      const data = await Node.find(where)
        .skip((parseInt(page) - 1) * limit)
        .limit(limit)
        .exec();

      res.status(200);
      return res.json({
        msg: "OK",
        totalCount,
        results: data,
      });
    } catch (error) {
      res.status(400);
      return res.json({ msg: "Algo salió mal", error: error.message });
    }
  },

  createNode: async (req, res) => {
    try {
      const { tag, detail, ip, rol, sensor, estado } = req.body;
      const createdBy = req.me?.id;

      const data = {
        tag: tag,
        detail: detail,
        ip: ip,
        rol: rol,
        sensor: sensor,
        createdBy: createdBy,
        estado,
      };

      if (
        tag === undefined ||
        detail === undefined ||
        ip === undefined ||
        rol === undefined ||
        sensor === undefined
        // createdBy === undefined
      ) {
        return res.status(400).json({
          msg: "Los campos tag, detalle, ip, rol y sensor son requeridos",
        });
      }

      const rolResult = await Rol.findOne({ external_id: rol });

      if (!rolResult) {
        return res.status(404).json({
          msg: "El registro especificado (rol) no existe",
        });
      }

      const sensorResult = await Sensor.findOne({ external_id: sensor });

      if (!sensorResult) {
        return res.status(404).json({
          msg: "El registro especificado (sensor) no existe",
        });
      }

      // const accountResult = await Account.findOne({ external_id: createdBy });

      // if (!accountResult) {
      //   return res.status(404).json({
      //     msg: "El registro especificado (createdBy) no existe",
      //   });
      // }

      const results = await Node.create(data);

      await rolResult.refreshExternal();
      await sensorResult.refreshExternal();
      // await accountResult.refreshExternal();

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

  updateNode: async (req, res) => {
    try {
      const { external_id } = req.params;
      const { tag, detail, ip, rol, sensor, estado } = req.body;

      const nodeResult = await Node.findOne({ external_id: external_id });

      if (!nodeResult) {
        return res.status(404).json({
          msg: "Nodo no encontrado",
        });
      }

      //talvez recuperar primero el nodo y sobre ese trabajar la actualización de data
      const data = {
        tag: tag,
        detail: detail,
        ip: ip,
        rol: rol,
        sensor: sensor,
        estado,
      };

      if (rol) {
        const rolResult = await Rol.findOne({ external_id: rol });

        if (!rolResult) {
          return res.status(404).json({
            msg: "El registro especificado (rol) no existe",
          });
        }

        // await rolResult.refreshExternal();
      }

      if (sensor) {
        const sensorResult = await Sensor.findOne({ external_id: sensor });

        if (!sensorResult) {
          return res.status(404).json({
            msg: "El registro especificado (sensor) no existe",
          });
        }

        // await sensorResult.refreshExternal();
      }

      //   const accountResult = await Account.findOne({ external_id: createdBy });

      //   if (!accountResult) {
      //     return res.status(404).json({
      //       msg: "El registro especificado (createdBy) no existe",
      //     });
      //   }

      const results = await Node.findOneAndUpdate({ external_id }, data);

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
