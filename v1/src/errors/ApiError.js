const httpStatus = require("http-status");

class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message = message;
    this.status = statusCode;
  }
  static notFound() {
    this.message = "Not Found";
    this.status = httpStatus.NOT_FOUND;
  }
}

module.exports = ApiError;
