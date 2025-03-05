const {ApiError} = require("../middleware/catchingErrors/apiError");
const {WHITELIST_DOMAINS, STATUS_RESPONSE} = require("../utils/constants");

const corsOptions = {
  origin: function (origin, callback) {
    // postman --  && env.BUILD_MODE === "dev"
    if (!origin) {
      return callback(null, true);
    }

    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new ApiError(
        STATUS_RESPONSE.BAD_REQUEST,
        `${origin} not allowed by our CORS Policy.`
      )
    );
  },

  optionsSuccessStatus: 200,

  credentials: true,
};

module.exports = {
  corsOptions,
};
