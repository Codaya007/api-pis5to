const jwt = require("jsonwebtoken");

module.exports = function autenticar(req, res, next) {
  const token = req.headers["Autentication"];
  if (token === undefined) {
    res.status(400);
    res.json({
      msg: "ERROR",
      tag: "Falta token",
      code: 400,
    });
  } else {
    require("dotenv").config();
    const key = process.env.KEY_JWT;
    jwt.verify(token, key, async (err, dec) => {
      if (err) {
        res.status(401);
        res.json({
          msg: "ERROR",
          code: 401,
          error_msg: "Token no valido o expirado",
        });
      } else {
        const models = require("../app/models");
        const cuenta = models.cuenta;
        const aux = await cuenta.findOne({
          where: {
            external_id: dec.external_id,
          },
        });

        if (aux == null) {
          res.status(401);
          res.json({
            msg: "ERROR",
            code: 400,
            error_msg: "Cuenta no encontrada",
          });
        } else {
          next();
        }
      }
    });
  }
};
