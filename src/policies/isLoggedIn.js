// const { validateToken } = require("../helpers/tokenCreation");

module.exports = async (req, res, next) => {
  try {
    const bearerToken = req.header("Authorization");

    if (!bearerToken) {
      return res.status(403).json({
        errorMessage: "Sin autenticación presente",
        details: "'Authorization' header is not present",
      });
    }

    // const user = await validateToken(bearerToken);

    // if (user.deletedAt) {
    //   return next({
    //     status: 403,
    //     errorMessage:
    //       "Su usuario fue dado de baja, contáctese con el administrador.",
    //   });
    // }

    // if (user.bloqued) {
    //   return next({
    //     status: 403,
    //     errorMessage: "Usuario bloqueado, contáctese con el administrador.",
    //   });
    // }

    // req.user = user;

    return next();
  } catch (error) {
    next({
      status: 401,
      message: error.message,
      details: error.message,
    });
  }
};
