// RAGE THE BAIT — main.js (copy/paste whole file)

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

// -------------------- UI helpers --------------------
function updateScoreboard() {
  if (baitEl) baitEl.innerText = score.toFixed(2);
  if (roundEl) roundEl.innerText = round;
  if (pWinsEl) pWinsEl.innerText = playerWins;
  if (cWinsEl) cWinsEl.innerText = cpuWins;
  if (drawsEl) drawsEl.innerText = draws;
}

function resetGame() {
  // reset state
  playerRoll = 0;
  computerRoll = 0;

  score = 0;
  round = 0;

  playerWins = 0;
  cpuWins = 0;
  draws = 0;

  // reset UI
  updateScoreboard();

  // clear dice
  if (playerDiceBox) playerDiceBox.innerHTML = "";
  if (cpuDiceBox) cpuDiceBox.innerHTML = "";

  // re-enable play button
  if (btnRollDice) {
    btnRollDice.disabled = false;
    btnRollDice.innerText = "Roll Dice";
  }
}

// -------------------- dice math thingy--------------------
function createDice(number) {
  const dotPositionMatrix = {
    1: [[50, 50]],
    2: [[20, 20], [80, 80]],
    3: [[20, 20], [50, 50], [80, 80]],
    4: [[20, 20], [20, 80], [80, 20], [80, 80]],
    5: [[20, 20], [20, 80], [50, 50], [80, 20], [80, 80]],
    6: [[20, 20], [20, 80], [50, 20], [50, 80], [80, 20], [80, 80]],
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

// spins thingy it looks cute
function randomizeDice() {
  playerRoll = Math.floor(Math.random() * 6) + 1;
  computerRoll = Math.floor(Math.random() * 6) + 1;

  // --- secret sauce !evil laughs!
  const bias = Math.random();
  if (bias < 0.4) {
    computerRoll = Math.min(computerRoll + 1, 6);
  }

  // rendering of dice
  if (playerDiceBox) playerDiceBox.innerHTML = "";
  if (cpuDiceBox) cpuDiceBox.innerHTML = "";

  if (playerDiceBox) playerDiceBox.appendChild(createDice(playerRoll));
  if (cpuDiceBox) cpuDiceBox.appendChild(createDice(computerRoll));
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

// -------------------- game end messaging yk --------------------
function decideWinnerMessage() {
  if (playerWins > cpuWins) return "YOU WIN! Best record after 7 rounds.";
  if (cpuWins > playerWins) return "PLAYER 2 WINS! You got rage baited after 7 rounds.";
  return "DRAW SET! Same wins after 7 rounds.";
}

function endGame(message) {
  if (btnRollDice) {
    btnRollDice.disabled = true;
    btnRollDice.innerText = "GAME OVER";
  }

  // popup thing
  const again = confirm(
    message +
      "\n\nFinal Bait Dollars: " + score.toFixed(2) +
      "\nRounds: " + round + "/" + maxRounds +
      "\nYour Wins: " + playerWins +
      "\nPlayer 2 Wins: " + cpuWins +
      "\nDraws: " + draws +
      "\n\nPlay again?"
  );

  if (again) resetGame();
}

// -------------------- events --------------------

// NAME -> updates HUD display sigh
if (nameInputEl) {
  nameInputEl.addEventListener("input", (e) => {
    const name = e.target.value.trim();
    if (playerDisplayEl) playerDisplayEl.innerText = name || "ENTER NAME";
  });
}

// Roll Dice button
if (btnRollDice) {
  btnRollDice.addEventListener("click", () => {
    if (round >= maxRounds) return; // only 7 rounds total

    // lock button during animation so it can't be spammed
    btnRollDice.disabled = true;

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
      } else {
        // unlock for next round
        btnRollDice.disabled = false;
      }
    }, 1000);
  });
}

// End Game form submit whoop
if (formEl) {
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInputEl ? nameInputEl.value.trim() : "";
    if (playerDisplayEl) playerDisplayEl.innerText = name || "ENTER NAME";

    // prevent ending before playing
    if (round === 0) {
      alert("You haven't played a round yet.");
      return;
    }

    let message;
    if (playerWins > cpuWins) message = "You ended early — YOU were leading.";
    else if (cpuWins > playerWins) message = "You ended early — PLAYER 2 was leading.";
    else message = "You ended early — it was tied.";

    endGame(message);
  });
}

// init of the board
updateScoreboard();
