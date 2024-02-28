const schedule = require("node-schedule");
const axios = require("axios");

// Definir la regla de programación para las 11:50 pm hora de Ecuador (UTC -5)
const rule = new schedule.RecurrenceRule();
rule.hour = 23; // 23 corresponde a las 11 pm en formato de 24 horas
rule.minute = 50; // 50 minutos
rule.tz = "America/Guayaquil"; // Establecer la zona horaria de Ecuador

const callback = async () => {
  try {
    console.log("Ejecutando cronjob de generación de pronósticos");

    let response = await axios.post("https://api-pis5to.fly.dev/pronostics");
    console.log(response?.data);
  } catch (error) {
    console.error(
      "Error al ejecutar el trabajo programado:",
      error?.response?.data || error
    );
  }
};

module.exports = {
  callback,
  rule,
};
