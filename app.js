const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const schedule = require("node-schedule");

const routes = require("./src/routes");
const { errorHandler } = require("./src/middlewares");
const notFound = require("./src/middlewares/notFound");
const job = require("./src/services/scheduler");

const app = express();
app.use(cors());

// Iniciar el proceso del planificador después de importar el job
schedule.scheduleJob("generatePronostics", job.rule, job.callback);

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
