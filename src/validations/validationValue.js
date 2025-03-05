const Joi = require("joi");
const {ApiError} = require("../middleware/catchingErrors/apiError");
const {password, email} = require("./constant");
const { STATUS_RESPONSE } = require("../utils/constants");

const validationLogin = async (req, res, next) => {
  const correctCondition = Joi.object({
    email,
    password,
  });

  try {
    await correctCondition.validateAsync(req.body, {abortEarly: false});

    next();
  } catch (error) {
    next(new ApiError(STATUS_RESPONSE.NOT_FOUND, new Error(error.message)));
  }
};

const validationSignup = async (req, res, next) => {
  const correctCondition = Joi.object({
    password,
    email,
  });

  try {
    await correctCondition.validateAsync(req.body, {abortEarly: false});
    next();
  } catch (error) {
    next(
      new ApiError(STATUS_RESPONSE.NOT_FOUND, new Error(error.message))
    );
  }
};

module.exports = {
  validationLogin,
  validationSignup,
};
