const WHITELIST_DOMAINS = ["http://www.w3.org", "http://localhost:5173", "https://iot-fe-alpha.vercel.app"];
const STATUS_RESPONSE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
}
module.exports = {
  WHITELIST_DOMAINS,
  STATUS_RESPONSE
};

