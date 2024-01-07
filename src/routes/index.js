const express = require("express");
const userRouter = require("./users");
const pronosticRouter = require("./pronosticRouter");
const weatherDataRouter = require("./weatherData.routes");
const accountRouter = require("./account.routes");
const authRouter = require("./auth.routes");
const imageRouter = require("./image.routes");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/pronostic", pronosticRouter);
router.use("/weatherdata", weatherDataRouter);

router.use("/accounts", accountRouter);
router.use("/images", imageRouter);
module.exports = router;
