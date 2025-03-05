const { STATUS_RESPONSE } = require("../../utils/constants");

const errorHandlingMiddleware = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = STATUS_RESPONSE.NOT_FOUND;

  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode],
    stack: err.stack,
  };

  // if (env.BUILD_MODE !== "dev") 

  res.status(responseError.statusCode).json(responseError);
};

module.exports = {
  errorHandlingMiddleware,
};
