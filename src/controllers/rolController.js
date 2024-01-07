const Rol = require("../models/Rol");

module.exports = {
    getRolById: async (req, res) => {
        const { external_id } = req.params;

        const result = await Rol.findOne({ external_id })

        if (!result) {
            return res.status(404).json({
                msg: "No se encontro el rol especificado"
            })
        }

        res.status(200).json({
            msg: "OK",
            result,
        });
        return res;
    },

    list: async (req, res) => {
        try {
            const { page = 1, limit = 10, ...where } = req.query;

            const totalCount = await Rol.countDocuments(where);
            const data = await Rol.find(where)
                .skip((parseInt(page) - 1) * limit)
                .limit(limit)
                .exec();

            res.status(200);
            res.json({
                msg: "OK",
                totalCount,
                data,
            });
        } catch (error) {
            res.status(400);
            res.json({ msg: "Algo salió mal", error: error.message });
        }
        return res;
    },

    createRol: async (req, res) => {
        try {
            const { name } = req.body;

            if (name === undefined) {
                return res.status(400).json({
                    msg: "El campo name es requerido",
                });
            }

            const result = await Rol.create({ name });

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

    updateRol: async (req, res) => {
        try {
            const { external_id, name } = req.body;

            const rolResult = await Rol.findOne({ external_id: external_id });

            if (!rolResult) {
                return res.status(404).json({
                    msg: "Rol no encontrado",
                });
            }

            const result = await Rol.findOneAndUpdate({external_id}, {name}, {new: true});

            await result.refreshExternal();

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
    }
}