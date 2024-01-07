const express = require("express");
const userRouter = require("./users");
const pronosticRouter = require("./pronosticRouter");
// const climateDataRouter = require("./climateDataRouter");
const weatherDataRouter = require("./weatherData.routes");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

router.use("/users", userRouter);
router.use("/pronostic", pronosticRouter);
// router.use("/climatedata", climateDataRouter);
router.use("/weatherdata", weatherDataRouter);

module.exports = router;
