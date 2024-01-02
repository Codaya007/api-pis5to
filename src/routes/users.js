var express = require("express");
var router = express.Router();

const users = [{ name: "Viviana", lastname: "Calva" }];

router.get("/", function (req, res, next) {
  res.json({ totalCount: users.length, results: users });
});

module.exports = router;
