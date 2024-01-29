const cron = require("cron");
const https = require("https");

const backendUri = "https://gamestore-api-8t9b.onrender.com";

const job = new cron.CronJob("*/14 * * * *", () => {
  https.get(backendUri, (res) => {
    if (res.statusCode == 200) {
      console.log("Server restarted");
    } else {
      console.error("failed to restart server");
    }
  });
});

module.exports = job;
