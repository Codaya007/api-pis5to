const WeatherConditions = require("../models/weatherConditions");

const getWeatherConditionsByParameters = async (temperature, humidity, pressure) =>{
    // TODO: agregar la presion
    return result = await WeatherConditions.findOne({
        "temperatureRange.from": { $lte: temperature },
        "temperatureRange.to": { $gte: temperature },
        "humidityRange.from": { $lte: humidity },
        "humidityRange.to": { $gte: humidity },
        // "pressureRange.from": { $lte: pressure },
        // "pressureRange.to": { $gte: pressure }
      });

}

module.exports = {
    getWeatherConditionsByParameters
};