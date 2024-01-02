const express = require("express");
const userRouter = require("./users");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

router.use("/users", userRouter);

module.exports = router;
