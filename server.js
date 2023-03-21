const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

require('dotenv').config();

const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const host = process.env.HOST;
const database = process.env.DATABASE;

// Establish a connection with the Mongo Database
// Get the username, password, host, and databse from the .env file
const mongoDB =
  "mongodb+srv://" +
  username +
  ":" +
  password +
  "@" +
  host +
  "/" +
  database;
mongoose.connect(mongoDB, { useNewUrlParser: true, retryWrites: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//     res.send('Hello, World!');
//   });
// index route
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
  });

const scoreSchema = new mongoose.Schema({
playerScore: { type: Number, default: 0 },
opponentScore: { type: Number, default: 0 },
});

const Score = mongoose.model("Score", scoreSchema);

// Define GET route to retrieve scores
// app.get('/scores', async (req, res) => {
//   try {
//     const scores = await Score.find();
//     res.json(scores);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
app.get('/scores', async (req, res) => {
    try {
      const scores = await Score.find().sort({ _id: -1 }).limit(1);
      res.json(scores);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });  

// Define POST route to create new scores
app.post('/scores', async (req, res) => {
  const score = new Score({
    playerScore: req.body.playerScore,
    opponentScore: req.body.opponentScore
  });
  try {
    const newScore = await score.save();
    res.status(201).json(newScore);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Define PUT route to update existing scores
app.put('/scores/:id', async (req, res) => {
  try {
    const score = await Score.findById(req.params.id);
    if (req.body.playerScore != null) {
      score.playerScore = req.body.playerScore;
    }
    if (req.body.opponentScore != null) {
      score.opponentScore = req.body.opponentScore;
    }
    const updatedScore = await score.save();
    res.json(updatedScore);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.use(express.static('public'));

// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, function () {
    console.log("Your app is listening on port " + listener.address().port);
  });
