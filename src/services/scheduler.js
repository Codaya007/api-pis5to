const schedule = require('node-schedule');
const axios = require('axios')

// ? A las 23:59:59 se crean los pronosticos
const job = schedule.scheduleJob('59 59 23 * * *', async function () {
    let response = await axios.post('https://api-pis5to.fly.dev/pronostics');
    console.log(response);
});

module.exports = {
    job
};