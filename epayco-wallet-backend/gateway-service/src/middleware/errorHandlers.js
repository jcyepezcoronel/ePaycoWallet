const { buildResponse } = require("../utils/responseBuilder");

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
  const status = err.response?.status || err.statusCode || 500;
  const data = err.response?.data;

  if (data?.code && data?.message) {
    return res.status(status).json(data);
  }

  res.status(status).json(
    buildResponse({
      success: false,
      code: status === 500 ? "INTERNAL_ERROR" : "BAD_REQUEST",
      message: err.message || "Ha ocurrido un error inesperado",
    })
  );
};

module.exports = { notFoundHandler, errorHandler };
