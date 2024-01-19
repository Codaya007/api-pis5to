const express = require("express");
const isLoggedIn = require("../policies/isLoggedIn");
const conditionC = require('../controllers/WeatherConditionsController');
let conditionControl = new conditionC();


const router = express.Router();

router.get('/list', conditionControl.list);
router.get('/get/:external_id', conditionControl.getByExternalId);
router.post('/save', conditionControl.save);
router.post('/modify/:external_id', conditionControl.modify);

module.exports = router;
