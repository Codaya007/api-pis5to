var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var routes = require("./src/routes");
const { errorHandler } = require("./src/middlewares");
const notFound = require("./src/middlewares/notFound");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "upload")));

//! Al añadir cruds no modificar este archivo sino ./routes/index.js
app.use("/", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
