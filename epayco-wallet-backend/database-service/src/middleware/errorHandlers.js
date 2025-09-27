const { buildResponse } = require("../utils/responseBuilder");
const AppError = require("../utils/appError");

const notFoundHandler = (req, res) => {
  res.status(404).json(
    buildResponse({
      success: false,
      code: "NOT_FOUND",
      message: "Recurso no encontrado",
    })
  );
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      buildResponse({
        success: false,
        code: err.code,
        message: err.message,
        data: err.meta,
      })
    );
  }

  res.status(500).json(
    buildResponse({
      success: false,
      code: "INTERNAL_ERROR",
      message: "Ha ocurrido un error inesperado",
    })
  );
};

module.exports = { notFoundHandler, errorHandler };
