const cron = require("cron");
const https = require("https");

const backendUri = "https://gamestore-api-3gln.onrender.com";

const job = new cron.CronJob("*/14 * * * *", () => {
  https.get(backendUri, (res) => {
    if (res.statusCode == 200) {
      console.log("Server restarted");
    } else {
      console.log("failed to restart server");
    }
  });
});

module.exports = job;
