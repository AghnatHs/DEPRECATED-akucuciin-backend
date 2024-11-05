const { TokenExpiredError } = require("jsonwebtoken");
const {
  NotFoundError,
  AuthenticationError,
  AuthorizationError,
  BadRequestError,
} = require("../errors/customError");

module.exports = function (err, req, res, next) {
  if (
    err instanceof NotFoundError ||
    err instanceof AuthenticationError ||
    err instanceof AuthorizationError ||
    err instanceof BadRequestError
  ) {
    return res.status(err.statusCode).send({
      success: false,
      errors: err.message,
    });
  } else if (err instanceof TokenExpiredError) {
    return res.status(500).send({
      success: false,
      errors: "Expired",
    });
  } else {
    return res.status(500).send({
      success: false,
      errors: "An internal server occured",
    });
  }
};
