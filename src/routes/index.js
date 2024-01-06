const express = require("express");
const userRouter = require("./users");
const pronosticRouter = require("./pronosticRouter");
// const climateDataRouter = require("./climateDataRouter");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

router.use("/users", userRouter);
router.use("/pronostic", pronosticRouter);
// router.use("/climatedata", climateDataRouter);

module.exports = router;
