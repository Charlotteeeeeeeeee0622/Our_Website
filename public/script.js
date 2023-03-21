// const { ObjectId } = require('bson-objectid');

const scores = [
  { button: document.querySelector(".My-Score"), display: document.querySelector("#my-score"), id: "playerScore" },
  { button: document.querySelector(".Opponent-Score"), display: document.querySelector("#opponent-score"), id: "opponentScore" }
];

// Fetch the latest scores from the server and update the HTML elements
async function updateScores() {
  try {
    const response = await fetch('/scores');
    const data = await response.json();
    document.getElementById('my-score').textContent = data[0].playerScore;
    document.getElementById('opponent-score').textContent = data[0].opponentScore;
  } catch (err) {
    console.error(err);
  }
}

// Add an event listener to each score button to update the score in the database and update the HTML elements
scores.forEach(score => {
  score.button.addEventListener("click", async () => {
    try {
      const response = await fetch('/scores');
      const data = await response.json();
      // console.log(data[0]._id)
      const res = await fetch(`/scores/${data[0]._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [score.id]: parseInt(score.display.textContent) + 1 })
      });      
      const updatedScore = await res.json();
      score.display.textContent = updatedScore[score.id];
    } catch (err) {
      console.error(err);
    }
  });
});

// Update the scores when the webpage is loaded
updateScores();