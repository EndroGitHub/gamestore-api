const mongoose = require("mongoose");

const userGamesSchema = new mongoose.Schema({
  username: String,
  gameName: String,
});

module.exports = mongoose.model("userGames", userGamesSchema, "userGames");
