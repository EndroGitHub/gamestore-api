require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./database/config");

const app = express();
app.use(express.json());
app.use(cors());
app.listen(5000);

//Models
const User = require("./database/User");
const Game = require("./database/Game");
const Cart = require("./database/Cart");
const UserGame = require("./database/UserGame");

//---------------------------POST API---------------------------

//API for signup
app.post("/signup", async (req, res) => {
  let find = await User.findOne({ username: req.body.username });
  if (find) {
    res.send({ result: "Username already in use" });
  } else {
    let user = new User(req.body);
    let result = await user.save();
    res.send(result);
  }
});

//API for login
app.post("/login", async (req, res) => {
  let find = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  if (find) {
    let username = find.username;
    let balance = find.balance;
    res.send({ username: username, balance: balance });
  } else {
    res.send({ result: "Wrong credentials" });
  }
});

//API to buy game (add game in UserGames)
app.post("/buy-game", async (req, res) => {
  let find = await UserGame.findOne({
    username: req.body.username,
    gameName: req.body.gameName,
  });
  if (find) {
    res.send({ result: "User have already bought the game" });
  } else {
    let userGame = UserGame(req.body);
    let result = await userGame.save();
    res.send(result);
  }
});

//API to add to cart
app.post("/add-to-cart", async (req, res) => {
  let find1 = await UserGame.findOne({
    username: req.body.username,
    gameName: req.body.gameName,
  });
  if (find1) {
    res.send({ result: "User have already bought the game" });
  } else {
    let find2 = await Cart.findOne({
      username: req.body.username,
      gameName: req.body.gameName,
    });
    if (find2) {
      res.send({ result: "Game already in cart" });
    } else {
      let cart = Cart(req.body);
      let result = await cart.save();
      res.send(result);
    }
  }
});

//API to buy all from cart
app.post("/buy-all-from-cart", async (req, res) => {
  let userGame,
    result,
    results = [],
    index = 0,
    len = req.body.length;
  while (index < len) {
    userGame = UserGame(req.body[index]);
    result = await userGame.save();
    results[index] = result;
    index++;
  }
  res.send(results);
});

//---------------------------GET API---------------------------

//API to get user date from username
app.get("/get-user-data/:param_username", async (req, res) => {
  let find = await User.findOne({ username: req.params.param_username });
  if (find) {
    res.send(find);
  } else {
    res.send({ result: "No user with this name" });
  }
});

app.get("/get-user-datas/:param_username", async (req, res) => {
  let find = await User.findOne({ username: req.params.param_username });
  if (find) {
    res.send(find);
  } else {
    res.send({ result: "No user with this name" });
  }
});

//API to get latest released games
app.get("/get-new-releases", async (req, res) => {
  let find = await Game.find().sort({ dateAddedMil: -1 }).limit(5);
  if (find.length > 0) {
    res.send(find);
  } else {
    res.send({ result: "No new releases" });
  }
});

//API to get discount games
app.get("/get-discount-games", async (req, res) => {
  let find = await Game.find({ offerPercentage: { $gt: 0 } })
    .sort({
      offerPercentage: -1,
    })
    .limit(5);
  if (find.length > 0) {
    res.send(find);
  } else {
    res.send({ result: "No games with discount" });
  }
});

//API to get all discount games
app.get("/get-all-discount/:param_page", async (req, res) => {
  let skipValue = (req.params.param_page - 1) * 10;
  let find1 = await Game.find({ offerPercentage: { $gt: 0 } });
  let find2 = await Game.find({ offerPercentage: { $gt: 0 } })
    .sort({
      offerPercentage: -1,
    })
    .skip(skipValue)
    .limit(10);
  if (find2.length > 0) {
    let remainingResults = find1.length - (skipValue + find2.length);
    let lastPage = remainingResults > 0 ? false : true;
    res.send({ data: find2, lastPage: lastPage });
  } else {
    res.send({ result: "No games found" });
  }
});

//API to get category games
app.get("/get-categoty-games/:param_category/:param_page", async (req, res) => {
  let skipValue = (req.params.param_page - 1) * 10;
  let find1 = await Game.find({ category: req.params.param_category });
  let find2 = await Game.find({ category: req.params.param_category })
    .sort({
      dateAddedMil: -1,
    })
    .skip(skipValue)
    .limit(10);
  if (find2.length > 0) {
    let remainingResults = find1.length - (skipValue + find2.length);
    let lastPage = remainingResults > 0 ? false : true;
    res.send({ data: find2, lastPage: lastPage });
  } else {
    res.send({ result: "No games found in category" });
  }
});

//API to get all games
app.get("/get-all-games/:param_page", async (req, res) => {
  let skipValue = (req.params.param_page - 1) * 10;
  let find1 = await Game.find();
  let find2 = await Game.find()
    .sort({ dateAddedMil: -1 })
    .skip(skipValue)
    .limit(10);
  if (find2.length > 0) {
    let remainingResults = find1.length - (skipValue + find2.length);
    let lastPage = remainingResults > 0 ? false : true;
    res.send({ data: find2, lastPage: lastPage });
  } else {
    res.send({ result: "No games found" });
  }
});

//API to get game data from game title
app.get("/get-game-data/:param_title", async (req, res) => {
  let find = await Game.findOne({ title: req.params.param_title });
  if (find) {
    res.send(find);
  } else {
    res.send({ result: "No game with this title" });
  }
});

//API to get user cart data
app.get("/get-user-cart/:param_username", async (req, res) => {
  let find = await Cart.find({ username: req.params.param_username });
  if (find.length > 0) {
    res.send(find);
  } else {
    res.send({ result: "No games in cart" });
  }
});

//API to check game in cart
app.get(
  "/check-game-in-cart/:param_username/:param_gameName",
  async (req, res) => {
    let find = await Cart.findOne({
      username: req.params.param_username,
      gameName: req.params.param_gameName,
    });
    if (find) {
      res.send(find);
    } else {
      res.send({ result: "Not present in cart" });
    }
  }
);

//API to get user games
app.get("/get-user-games/:param_username", async (req, res) => {
  let find = await UserGame.find({ username: req.params.param_username });
  if (find.length > 0) {
    res.send(find);
  } else {
    res.send({ result: "No games bought by the user" });
  }
});

//API to check game in user games
app.get(
  "/check-game-in-your-games/:param_username/:param_gameName",
  async (req, res) => {
    let find = await UserGame.findOne({
      username: req.params.param_username,
      gameName: req.params.param_gameName,
    });
    if (find) {
      res.send(find);
    } else {
      res.send({ result: "Not present in user games" });
    }
  }
);

//API to show first 5 search results
app.get("/search-game/:param_searchKey", async (req, res) => {
  let find = await Game.find({
    title: { $regex: req.params.param_searchKey, $options: "i" },
  })
    .sort({ title: 1 })
    .limit(5);
  if (find.length > 0) {
    res.send(find);
  } else {
    res.send({ result: "No game found" });
  }
});

//API to search all games
app.get("/search-all-games/:param_searchKey/:param_page", async (req, res) => {
  let skipValue = (req.params.param_page - 1) * 10;
  let find1 = await Game.find({
    title: { $regex: req.params.param_searchKey, $options: "i" },
  }).sort({ title: 1 });
  let find2 = await Game.find({
    title: { $regex: req.params.param_searchKey, $options: "i" },
  })
    .sort({ title: 1 })
    .skip(skipValue)
    .limit(10);
  if (find2.length > 0) {
    let remainingResults = find1.length - (skipValue + find2.length);
    let lastPage = remainingResults > 0 ? false : true;
    res.send({ data: find2, lastPage: lastPage });
  } else {
    res.send({ result: "No game found" });
  }
});

//---------------------------DELETE API---------------------------

//API to remove from cart
app.delete(
  "/remove-from-cart/:param_username/:param_gameName",
  async (req, res) => {
    let result = await Cart.deleteOne({
      username: req.params.param_username,
      gameName: req.params.param_gameName,
    });
    res.send(result);
  }
);

//---------------------------PUT API---------------------------

//API to update user data
app.put("/update-users/:param_username", async (req, res) => {
  let result = await User.updateOne(
    {
      username: req.params.param_username,
    },
    { $set: { balance: req.body.balance } }
  );
  res.send(result);
});

//API to update game data
app.put("/update-game-data/:param_title", async (req, res) => {
  let result = await Game.updateOne(
    { title: req.params.param_title },
    { $set: req.body }
  );
  res.send(result);
});
