const User = require("../Model/User");
const bcrypt = require("bcrypt");
const {
  generalAccessToken,
  generalRefreshToken,
  createTokenPair
} = require("../services/JwtService");
const { generateKeyPair } = require("../utils/generateKeyPair");
const { STATUS_RESPONSE } = require("../utils/constants");
const { helper } = require("../utils/fun");
const { triggerWs } = require("../websocket");

const createUser = newUser => {
  return new Promise(async (resolve, reject) => {
    const {  email, password} = newUser;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser !== null) {
        reject({
          status: STATUS_RESPONSE.BAD_REQUEST,
          message: "Email đã sử dụng",
        });
      }
      const hashPassword = bcrypt.hashSync(password, 10);
      const createdUser = await User.create({
        email,
        password: hashPassword,
      });
    
      if (createdUser) {
        resolve({
          status: STATUS_RESPONSE.OK,
          message: "SUCCESS",
          data: {
            id: createdUser.id,
            email: createdUser.email,
            createdAt: createdUser.createdAt,
          },
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginUser = userLogin => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;
    try {
      const checkUser = await User.findOne({
        email: email,
      });

      if (checkUser === null) {
        reject({
          status: STATUS_RESPONSE.NOT_FOUND,
          message: "Tài khoản không tồn tại",
        });
      }
      const comparePassword = bcrypt.compareSync(password, checkUser.password);

      if (!comparePassword) {
        reject({
          status: STATUS_RESPONSE.NOT_FOUND,
          message: "Vui lòng kiểm tra lại mật khẩu",
        });
      }

      const tokens = await createTokenPair({
        id: checkUser.id,
        email: checkUser.email
      }, process.env.PRIVATE_KEY);
      const soketi = process.env.SOKETI_CHANNEL;
      console.log("chanel::", soketi);
      
      resolve({
        status: STATUS_RESPONSE.OK,
        message: "SUCCESS",
        tokens,
        data: {
          id: checkUser.id,
          email: checkUser.email,
          createdAt: checkUser.createdAt,
        },
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });
      if (checkUser === null) {
        resolve({
          status: STATUS_RESPONSE.NOT_FOUND,
          message: "Tài khoản không tồn tại",
        });
      }
      if (data?.password || data?.email) {
        return reject("Chưa cập nhập tính năng thay đổi hai trường này!!")
      }
      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: STATUS_RESPONSE.OK,
        message: `"Cập nhật ${updatedUser.username} thành công"`,
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          phone: updatedUser.phone,
          createdAt: updatedUser.createdAt,
        },
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = id => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });
      if (checkUser === null) {
        resolve({
          status: STATUS_RESPONSE.NOT_FOUND,
          message: "Tài khoản không tồn tại",
        });
      }

      await User.findByIdAndDelete(id);
      resolve({
        status: STATUS_RESPONSE.OK,
        message: "Xóa tài khoản thành công",
        data: checkUser
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyUser = ids => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.deleteMany({ _id: ids });
      resolve({
        status: STATUS_RESPONSE.OK,
        message: "Xóa tài khoản thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = (page, limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      const skip = (page - 1) * limit;

      const allUser = await User.find()
        .sort({ createdAt: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil((await User.countDocuments()) / limit);

      resolve({
        status: STATUS_RESPONSE.OK,
        message: "Success",
        data: allUser,
        total: allUser.length,
        page: page,
        limit: limit,
        totalPages: totalPages,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsUser = id => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById({
        _id: helper.getMongoId(id),
      });
      if (user === null) {
        resolve({
          status: STATUS_RESPONSE.NOT_FOUND,
          message: "Tài khoản không tồn tại",
        });
      }
      resolve({
        status: STATUS_RESPONSE.OK,
        message: "Success",
        data: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } catch (e) {
      reject(e);
    }
  });
};

const checkEmailInData = email => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        email: email,
      });

      if (user === null) {
        resolve({
          status: STATUS_RESPONSE.NOT_FOUND,
          message: "Tài khoản không tồn tại",
        });
      }
      const access_token = await generalAccessToken({
        email: user.email,
      });

      const refresh_token = await generalRefreshToken({
        email: user.email,
      });

      resolve({
        status: 200,
        message: "Success",
        data: { refresh_token, access_token, user },
      });
    } catch (e) {
      reject(e);
    }
  });
};
const findUserById = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    throw error;
  }
};



module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  deleteManyUser,
  checkEmailInData,
  findUserById
};
