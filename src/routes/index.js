const express = require("express");
const pronosticRouter = require("./pronosticRouter");
const weatherDataRouter = require("./weatherData.routes");
const nodeRouter = require("./node.routes");
const rolRouter = require("./rol.routes");
const accountRouter = require("./account.routes");
const authRouter = require("./auth.routes");
const imageRouter = require("./image.routes");
const sensorRouter = require("./sensor.routes");
const weatherConditionsRouter = require("./weatherConditions");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

router.use("/auth", authRouter);
router.use("/weatherconditions", weatherConditionsRouter);
router.use("/pronostic", pronosticRouter);
router.use("/weatherdata", weatherDataRouter);
router.use("/node", nodeRouter);
router.use("/rol", rolRouter);
router.use("/accounts", accountRouter);
router.use("/images", imageRouter);
router.use("/sensor", sensorRouter);

module.exports = router;
