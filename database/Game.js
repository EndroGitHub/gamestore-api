const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
  offerPercentage: Number,
  category: [String],
  dateAddedMil: Number,
});

module.exports = mongoose.model("games", gameSchema, "games");
