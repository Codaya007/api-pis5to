var express = require("express");
var router = express.Router();

// const conditionC = require('../controllers/WeatherConditionsController');
// let conditionControl = new conditionC();

const users = [{ name: "Viviana", lastname: "Calva" }];

router.get("/", function (req, res, next) {
  res.json({ totalCount: users.length, results: users });
});

// router.get('/list/weatherCondition', conditionControl.list);
// router.get('/get/weatherCondition/:external_id', conditionControl.getByExternalId);
// router.post('/save/weatherCondition', conditionControl.save);
// router.post('/modify/weatherCondition/:external_id', conditionControl.modify);


module.exports = router;
