const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const routes = require("./src/Routers");
const { errorHandlingMiddleware } = require("./src/middleware/catchingErrors/catchingErrorMiddleware");

const app = express();
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

routes(app);

app.get("*", (req, res) => {
    res.send("Nhập Sai Đường Dẫn! Vui Lòng Nhập Lại >.<");
});

app.use(errorHandlingMiddleware);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    res.status(statusCode).json({
        status: "error",
        code: statusCode,
        message: error.message || "Server Error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
});

module.exports = app;
