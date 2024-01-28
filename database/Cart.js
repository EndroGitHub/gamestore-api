const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  username: String,
  gameName: String,
});

module.exports = mongoose.model("cart", cartSchema, "cart");
