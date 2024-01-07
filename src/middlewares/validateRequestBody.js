const validateRequestBody = (validationSchema) => async (req, res, next) => {
  try {
    const context = { id: req.params.id };
    const options = { abortEarly: false, context };
    const fieldsToValidate = { ...req.body, ...req.query, ...req.params };

    await validationSchema.validateAsync(fieldsToValidate, options);

    return next();
  } catch (error) {
    // console.log({ error });

    if (error) {
      const errorsMessages = error.details
        ? error.details?.map(
            (detail) => detail.context?.message || detail.message
          )
        : [error.message];

      const message = `Se han encontrado algunos errores: ${errorsMessages.join(
        ". "
      )}`;

      // Si se hallaron errores, lanzo el error al middleware de manejo de errores
      return next({ ...error, valid: false, message, status: 400 });
    }
  }
};

module.exports = validateRequestBody;
