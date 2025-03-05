const Joi = require("joi");

const password = Joi.string()
  .required()
  .min(6)
  .max(50)
  .trim()
  .strict()
  .messages({
    "required": "Vui lòng nhập mật khẩu",
    "string.max": "Mật khẩu tối đa 50 kí tự",
    "string.min": "Mật khẩu tối thiểu 6 kí tự",
  });

const email = Joi.string().required().email().trim().strict().messages({
  "required": `Vui lòng nhập email`,
  "string.email": "Vui lòng nhập đúng email",
});
const username = Joi.string().required().trim().strict().messages({
  "required": "Vui lòng nhập người dùng",
});
const phone = Joi.string().required().min(9).max(12).trim().strict().messages({
  "required": "Vui lòng nhập số điện thoại",
  "string.max": "Số điện thoại tối đa 12 kí tự",
  "string.min": "Số điện thoại tối thiểu 9 kí tự",
});
const productName = Joi.string().required().trim().strict().messages({
  "required": "Vui lòng nhập tên",
});
const countInStock = Joi.number().required().strict().messages({
  "required": "Vui lòng nhập số lượng",
});
const price = Joi.number().required().strict().messages({
  "required": "Vui lòng nhập giá",
});
const description = Joi.string().required().strict().messages({
  "required": "Vui lòng nhập mô tả",
});

const size = Joi.array().required().strict().messages({
  "required": "Vui lòng nhập kích thước",
});
const color = Joi.array().required().strict().messages({
  "required": "Vui lòng nhập màu sắc",
});
const type = Joi.array().required().strict().messages({
  "required": "Vui lòng nhập màu sắc",
});
const images = Joi.array().required().strict().messages({
  "required": "Vui lòng chọn images",
});

// name product
const fullName = Joi.string().required().trim().strict().messages({
  "required": "Vui lòng nhập đầy đủ thông tin địa chỉ",
});

const validPaymentMethods = ['bank', 'delivery', 'zalopay'];

const paymentMethod = Joi.string().valid(...validPaymentMethods).required().trim().strict().messages({
  "any.only": `phương thức thanh toán phải là một trong các giá trị: ${validPaymentMethods.join(', ')}`,
  "required": "Vui lòng nhập tên người nhận",
});

const totalPrice = Joi.number().required().strict().messages({
  "required": "Vui lòng nhập giá",
});
const shippingPrice = Joi.number().required().strict().messages({
  "required": "Vui lòng nhập giá ship",
});
const address = Joi.string().required().strict().messages({
  "required": "Vui lòng nhập địa chỉ",
});
const commune = Joi.string().required().strict().messages({
  "required": "Vui lòng nhập xã",
});
const province = Joi.string().required().strict().messages({
  "required": "Vui lòng nhập tỉnh/thành phố",
});
const district = Joi.string().required().strict().messages({
  "required": "Vui lòng nhập huyện/quận",
});

const validShippingMethods = ['ghtk', 'viettelpost', 'xpress'];

const shippingMethod = Joi.string().required().valid(...validShippingMethods).strict().messages({
  "any.only": `vận chuyển đơn hàng phải là một trong các giá trị: ${validShippingMethods.join(', ')}`,
  "required": "Thiếu giá trị shippingMethod",
});
const orderItems = Joi.array().required()
// id user
const userId = Joi.string().required().strict().messages({
  "required": "Vui lòng nhập id user",
});

// allow('', null).optional()

const selled = Joi.number();
const discount = Joi.number();
const isStatus = Joi.boolean();


module.exports = {
  province, district, userId,
  fullName,
  paymentMethod,
  totalPrice,
  shippingPrice,
  address,
  shippingMethod,
  commune,
  password,
  email,
  username,
  phone,
  orderItems,
  productName,
  countInStock,
  price,
  description,
  size,
  color,
  type,
  images,
  selled,
  discount,
  isStatus,
};
