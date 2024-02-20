const WeatherConditions = require("../models/weatherConditions");

const getWeatherConditionsByParameters = async (temperature, humidity, pressure) => {
    try {
        const sunnyData = await WeatherConditions.findOne({ weatherType: "SOLEADO" });
        // console.log(sunnyData);
        const cloudyData = await WeatherConditions.findOne({ weatherType: "NUBLADO" });
        // console.log(cloudyData);
        const rainyData = await WeatherConditions.findOne({ weatherType: "LLUVIOSO" });
        // console.log(rainyData);
        let weatherState;
        // Comparación para Soleado
        if (
            (temperature >= sunnyData.temperatureRange.from &&
                humidity <= sunnyData.humidityRange.to) ||
            (temperature >= sunnyData.temperatureRange.from &&
                pressure >= sunnyData.pressureRange.from)
        ) {
            weatherState = sunnyData;
        }
        // Comparación para Nublado
        else if (
            (temperature >= cloudyData.temperatureRange.from &&
                temperature <= cloudyData.temperatureRange.to &&
                humidity >= cloudyData.humidityRange.from &&
                humidity <= cloudyData.humidityRange.to) ||
            (temperature >= cloudyData.temperatureRange.from &&
                temperature <= cloudyData.temperatureRange.to &&
                pressure >= cloudyData.pressureRange.from &&
                pressure <= cloudyData.pressureRange.to)
        ) {
            weatherState = cloudyData;
        }
        // Comparación para Lluvioso
        else if (
            (temperature <= rainyData.temperatureRange.to &&
                humidity >= rainyData.humidityRange.from &&
                humidity <= rainyData.humidityRange.to) ||
            (temperature <= rainyData.temperatureRange.to &&
                pressure <= rainyData.pressureRange.to)
        ) {
            weatherState = rainyData;
        }
        // console.log({weatherState});

        return weatherState

    } catch (error) {
        console.error('Error al determinar el estado climático:', error);
    }

}

module.exports = {
    getWeatherConditionsByParameters
};