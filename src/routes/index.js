const express = require("express");
const userRouter = require("./users");
const pronosticRouter = require("./pronosticRouter");
// const climateDataRouter = require("./climateDataRouter");
const weatherDataRouter = require("./weatherData.routes");
const nodeRouter = require("./node.routes");
const rolRouter = require("./rol.routes");
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
// router.use("/climatedata", climateDataRouter);
router.use("/weatherdata", weatherDataRouter);
router.use("/node", nodeRouter);
router.use("/rol", rolRouter);
router.use("/accounts", accountRouter);
router.use("/images", imageRouter);

module.exports = router;
