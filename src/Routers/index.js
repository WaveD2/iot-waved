const UserRouter = require("./UserRouter");
const SensorRouter = require("./SensorRoutes");
const HealthRouter = require("./HealthRoutes");

const routes = app => {
  app.use("/api/user", UserRouter);
  app.use("/api/heart", HealthRouter);
  app.use("/api/sensor", SensorRouter);
};

module.exports = routes;
