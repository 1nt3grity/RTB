let playerRoll = 0;
let computerRoll = 0;

let score = 0; // bait dollars

// --- rounds / tries ---
let round = 0;
const maxRounds = 7;

let playerWins = 0;
let cpuWins = 0;
let draws = 0;

const btnRollDice = document.querySelector(".btn-roll-dice");

// dice boxes
const playerDiceBox = document.getElementById("player-dice");
const cpuDiceBox = document.getElementById("cpu-dice");

// UI elements
const baitEl = document.getElementById("baitdollars");
const roundEl = document.getElementById("roundCount");
const pWinsEl = document.getElementById("pWins");
const cWinsEl = document.getElementById("cWins");
const drawsEl = document.getElementById("draws");

const playerDisplayEl = document.getElementById("playerDisplay");
const nameInputEl = document.getElementById("player_name");
const formEl = document.getElementById("myform");

function updateScoreboard() {
  baitEl.innerText = score.toFixed(2);
  roundEl.innerText = round;
  pWinsEl.innerText = playerWins;
  cWinsEl.innerText = cpuWins;
  drawsEl.innerText = draws;
}

function createDice(number) {
  const dotPositionMatrix = {
    1: [[50, 50]],
    2: [[20, 20], [80, 80]],
    3: [[20, 20], [50, 50], [80, 80]],
    4: [[20, 20], [20, 80], [80, 20], [80, 80]],
    5: [[20, 20], [20, 80], [50, 50], [80, 20], [80, 80]],
    6: [[20, 20], [20, 80], [50, 20], [50, 80], [80, 20], [80, 80]]
  };

  const dice = document.createElement("div");
  dice.classList.add("dice");

  dotPositionMatrix[number].forEach(([top, left]) => {
    const dot = document.createElement("div");
    dot.classList.add("dice-dot");
    dot.style.setProperty("--top", top + "%");
    dot.style.setProperty("--left", left + "%");
    dice.appendChild(dot);
  });

  return dice;
}

// spins dice during animation
function randomizeDice() {
  playerRoll = Math.floor(Math.random() * 6) + 1;
  computerRoll = Math.floor(Math.random() * 6) + 1;

  // --- manipulated bias (keep it unfair) ---
  const bias = Math.random();
  if (bias < 0.4) {
    computerRoll = Math.min(computerRoll + 1, 6);
  }

  // render into the correct boxes
  playerDiceBox.innerHTML = "";
  cpuDiceBox.innerHTML = "";
  playerDiceBox.appendChild(createDice(playerRoll));
  cpuDiceBox.appendChild(createDice(computerRoll));
}

function applyRoundResult() {
  if (playerRoll < computerRoll) {
    score -= 1;
    cpuWins += 1;
  } else if (playerRoll > computerRoll) {
    score += 1;
    playerWins += 1;
  } else {
    score += 0.05;
    draws += 1;
  }

  updateScoreboard();
}

function endGame(message) {
  btnRollDice.disabled = true;
  btnRollDice.innerText = "GAME OVER";

  alert(
    message +
      "\nFinal Bait Dollars: " + score.toFixed(2) +
      "\nRounds: " + round + "/" + maxRounds +
      "\nYou Wins: " + playerWins +
      "\nPlayer 2 Wins: " + cpuWins +
      "\nDraws: " + draws
  );
}

function decideWinnerMessage() {
  if (playerWins > cpuWins) return "YOU WIN! Best record after 7 rounds.";
  if (cpuWins > playerWins) return "PLAYER 2 WINS! You got rage baited after 7 rounds.";
  return "DRAW SET! Same wins after 7 rounds.";
}

// NAME -> updates HUD display
nameInputEl.addEventListener("input", (e) => {
  const name = e.target.value.trim();
  playerDisplayEl.innerText = name || "ENTER NAME";
});

// Roll Dice button
btnRollDice.addEventListener("click", () => {
  if (round >= maxRounds) return; // only 7 tries total

  round += 1;
  updateScoreboard();

  const interval = setInterval(randomizeDice, 20);

  setTimeout(() => {
    clearInterval(interval);

    // lock in last roll and score it
    applyRoundResult();

    // after round 7, decide winner by MOST wins
    if (round >= maxRounds) {
      endGame(decideWinnerMessage());
    }
  }, 1000);
});

// End Game form submit (manual stop)
formEl.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInputEl.value.trim();
  playerDisplayEl.innerText = name || "ENTER NAME";

  // decide winner at the moment they end it early
  if (playerWins > cpuWins) endGame("You ended early — YOU were leading.");
  else if (cpuWins > playerWins) endGame("You ended early — PLAYER 2 was leading.");
  else endGame("You ended early — it was tied.");
});

// initialize UI
updateScoreboard();