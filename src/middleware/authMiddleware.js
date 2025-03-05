const jwt = require("jsonwebtoken");
const { verifyToken } = require("../services/JwtService");
const { STATUS_RESPONSE } = require("../utils/constants");

const authMiddleware = async (req, res, next) => {
  if (!req.headers?.authorization) {
    return res.status(404).json({
      status: STATUS_RESPONSE.NOT_FOUND,
      message: "Không có token",
    });
  }

  const accessToken = req.headers.authorization.split(" ")[1];
  
  const user = verifyToken(accessToken, process.env.PRIVATE_KEY);
  
  if (!user) {
    return res.status(400).json({
      status: STATUS_RESPONSE.NOT_FOUND,
      message: "Access Token đã hết hạn",
    });
  }

  req.user = user;
  next();
};

module.exports = { authMiddleware };
