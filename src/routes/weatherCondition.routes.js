const express = require("express");
const ConditionControllerClass = require("../controllers/WeatherConditionsController");

const weatherConditionRouter = express.Router();
let conditionControl = new ConditionControllerClass();

weatherConditionRouter.get("/", conditionControl.list);
weatherConditionRouter.get("/:external_id", conditionControl.getByExternalId);
weatherConditionRouter.post("/", conditionControl.save);
weatherConditionRouter.put("/", conditionControl.modify);

module.exports = weatherConditionRouter;
