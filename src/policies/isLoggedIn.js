const { tokenValidation } = require("../helpers/validateToken");

module.exports = async (req, res, next) => {
  try {
    //! NO CAMBIAR ESTE NOMBRE DEL HEADER: https://developer.mozilla.org/es/docs/Web/HTTP/Headers/Authorization
    const bearerToken = req.header("Authorization");

    console.log({ bearerToken });

    const user = await tokenValidation(bearerToken);

    if (user.deletedAt) {
      return next({
        status: 403,
        msg: "Su usuario fue dado de baja, contáctese con el administrador.",
      });
    }

    if (user.state == "BLOQUEADA") {
      return next({
        status: 403,
        msg: "Usuario bloqueado, contáctese con el administrador.",
      });
    }

    req.user = user;
    req.me = user;

    return next();
  } catch (error) {
    console.log({ error });

    next({
      status: 401,
      msg: error.msg,
    });
  }
};
