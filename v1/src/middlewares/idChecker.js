const httpStatus = require("http-status");
const ApiError = require("../errors/ApiError");

const idChecker =
  (field = "id") =>
  (req, res, next) => {
    console.log("IdCHECKER");
    if (!req?.params[field]?.match(/^[0-9a-fA-F]{24}$/)) {
      next(new ApiError("Invalid ID!", httpStatus.BAD_REQUEST));
      return;
    }
    next();
  };
module.exports = idChecker;
