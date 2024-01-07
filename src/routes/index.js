const express = require("express");
const userRouter = require("./users");
const weatherDataRouter = require("./weatherData.routes");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

router.use("/users", userRouter);
router.use("/weatherdata", weatherDataRouter);

module.exports = router;
