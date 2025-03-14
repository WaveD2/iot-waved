const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");
const { STATUS_RESPONSE } = require("../utils/constants");

const createUser = async (req, res) => {
  try {
    const response = await UserService.createUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      status: STATUS_RESPONSE.NOT_FOUND,
      data: e,
    });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const data = await UserService.loginUser(req.body);

    // set cookie
    res.cookie("refresh_token", data.tokens.refreshToken.refresh, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });

    if (!data) return res.status(404).json({ message: "Bad Request" });
    return res.status(200).json(
      {
        status: STATUS_RESPONSE.OK,
        data
      }
    );
  } catch (err) {
    return next(err);
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const data = req.body;
    if (!userId) {
      return res.status(403).json({
        status: STATUS_RESPONSE.NOT_FOUND,
        message: "Lỗi thông tin ID người dùng",
      });
    }
    const response = await UserService.updateUser(userId, data);
    return res.status(200).json({
      status: STATUS_RESPONSE.OK,
      data: response,
    });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.query.id;

    if (!userId || typeof userId !== 'string') {
      return res.status(403).json({
        status: STATUS_RESPONSE.NOT_FOUND,
        message: "Kiểm tra lại thông tin",
      });
    }
    const response = await UserService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      status: STATUS_RESPONSE.NOT_FOUND,
      message: e,
    });
  }
};

const deleteMany = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(403).json({
        status: STATUS_RESPONSE.NOT_FOUND,
        message: "Lỗi thông tin người dùng",
      });
    }
    const response = await UserService.deleteManyUser(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const page = req.body.page || 1;
    const limit = req.body.limit || 6;
    const response = await UserService.getAllUser(page, limit);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(403).json({
        status: STATUS_RESPONSE.NOT_FOUND,
        message: "Lỗi thông tin người dùng",
      });
    }
    const response = await UserService.getDetailsUser(userId);
    return res.status(200).json({
      status: STATUS_RESPONSE.OK,
      data: response,
    });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    // refreshToken
    let refresh_token = req.headers.cookie.split("=")[1];
    if (!refresh_token) {
      return res.status(403).json({
        status: STATUS_RESPONSE.NOT_FOUND,
        message: "The token is required",
      });
    }
    const response = await JwtService.refreshTokenJwtService(refresh_token);
    return res.status(200).json({
      status: STATUS_RESPONSE.OK,
      data: response,
      tokens: response.tokens
    });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    triggerWs('user', `${req.user.id}`, JSON.stringify({
      title: 'logout',
      type: 'iot'
    }));
    
    res.clearCookie("refresh_token");
    return res.status(200).json({
      status: STATUS_RESPONSE.OK,
      message: "Đăng xuất thành công",
    });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  refreshToken,
  logoutUser,
  deleteMany,
};
