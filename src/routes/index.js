const express = require("express");
const userRouter = require("./users");
const sensorRouter = require("./sensor.routes");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

router.use("/users", userRouter);
router.use("sensor", sensorRouter);

module.exports = router;
