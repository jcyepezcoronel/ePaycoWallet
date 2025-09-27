class AppError extends Error {
  constructor({ message, statusCode = 400, code = "BAD_REQUEST", meta }) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.meta = meta;
  }
}

module.exports = AppError;
