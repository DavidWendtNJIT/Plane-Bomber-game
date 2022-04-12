// Using HTML elements for JS functionality
const score = document.querySelector(".score");
const gameArea = document.querySelector(".gameArea");
const gameMessage = document.querySelector(".gameMessage");
const level = document.querySelector(".level");
const song = document.querySelector("#background-audio");
const scoreboard = document.querySelector(".scoreboard");

// Functionality
document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);
document.addEventListener("click", start);

// Global objects
let player = {
  score: 0,
  speed: 3,
  inplay: false,
};

let keys = {
  space: false,
};

// Audio
let playHit = document.getElementById("playHit");
playHit.volume = 0.2;

let planeAudio = document.getElementById("plane-sound");
planeAudio.volume = 0.4;
planeAudio.loop = true;

let backgroundAudio = document.getElementById("background-audio");
backgroundAudio.volume = 0.6;
backgroundAudio.loop = true;
backgroundAudio.classList.add("hide");

function playAudioHit() {
  playHit.play();
}

function playPlaneAudio() {
  planeAudio.play();
}

function pausePlaneAudio() {
  planeAudio.pause();
}

function playBackgroundAudio() {
  backgroundAudio.play();
}

// Function for when the game starts and some default values
function start() {
  if (!player.inplay) {
    gameArea.innerHTML = ""; // Clears the game area when restarting
    player.level = 11;
    playBackgroundAudio();
    playPlaneAudio();
    makeTarget();
    gameMessage.classList.add("hide"); // Hides the Start Button
    score.classList.remove("hide");
    level.classList.remove("hide");
    song.classList.remove("hide");
    player.inplay = true;
    player.score = 4000; // Starting Score
    player.totalBombs = 6; // total bombs allowed on screen
    // player.bombScore = 0;
    player.ready = true;
    player.activeBomb = 0; // sets the starting value of the numbers on the bombs
    player.plane = document.createElement("div"); // Dynamically creates the Plane once Start is clicked
    player.plane.setAttribute("class", "plane");
    gameArea.appendChild(player.plane); // places plane in game area
    // player.button = document.createElement("button");
    // player.button.setAttribute("class", "end-game");
    // gameArea.appendChild(player.button);
    window.requestAnimationFrame(playGame); //requests animation with the function playGame passed into it
    player.x = player.plane.offsetLeft;
    player.y = player.plane.offsetTop;
  }
}

function makeTarget() {
  player.level--;
  if (player.level < 1) {
    endGame(); // End game when there are no more levels
  } else {
    player.target = document.createElement("div"); // Creates the Target
    player.target.setAttribute("class", "target");
    player.target.style.width = Math.floor(Math.random() * 250) + 10 + "px"; // Sets the width at random with a minimum of 10px
    player.target.style.height = Math.floor(Math.random() * 100) + 250 + "px"; // Sets the height at random with a minimum of 250px
    player.target.style.left =
      Math.floor(Math.random() * (gameArea.offsetWidth - 200)) + 200 + "px"; // Sets the horizontal position at random within 100px of the edge of the game area
    gameArea.appendChild(player.target);
  }
}

function makeBomb() {
  if (player.ready && player.activeBomb < player.totalBombs) {
    player.score -= 200; // drops the score for every bomb
    player.activeBomb++; // numbers each bomb
    // player.bombScore++;
    let bomb = document.createElement("div"); // creates the bomb
    bomb.classList.add("bomb");
    // bomb.innerHTML = player.bombScore;
    bomb.y = player.y; // sets the position of the bomb to the position of the plane
    bomb.x = player.x; // sets the position of the bomb to the position of the plane
    bomb.style.left = bomb.x + 175 + "px"; //adjusts the position of the bomb relative to the plane
    bomb.style.top = bomb.y + 50 + "px"; //adjusts the position of the bomb relative to the plane
    gameArea.appendChild(bomb);
    player.ready = false;
    setTimeout(function () {
      player.ready = true; // 0.35 seconds between bomb drops
    }, 350);
  }
}

// Dropping the bombs
function moveBomb() {
  let bombs = document.querySelectorAll(".bomb"); // selecting ALL bombs that drop
  bombs.forEach(function (item) {
    // selecting each bomb
    item.y += 5; // bombs dropped
    item.style.top = item.y + 50 + "px"; //adjusts where the bomb drops from the plane
    if (item.y > window.innerHeight - 100) {
      // bomb dissappears after reaching 1000 pxs
      player.activeBomb--;
      item.parentElement.removeChild(item); // bomb disappears
    }
    if (bombHit(item, player.target)) {
      playAudioHit();
      player.score += 1000; // score increased when target is hit
      player.activeBomb--;
      player.target.parentElement.removeChild(player.target); // target disappears when hit
      item.parentElement.removeChild(item); // bomb disappears when hitting base
      makeTarget();
    }
  });
}

// Collision detection
function bombHit(a, b) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();
  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function playGame() {
  if (player.inplay) {
    //main if statement of playGame
    moveBomb();
    if (keys.space) {
      makeBomb(); // Creates a bomb once Space is pressed
    }

    // Controls of Plane from keyboard arrows, and sets boundaries
    if (keys.ArrowUp && player.y > 125) {
      player.y -= player.speed;
    }
    if (keys.ArrowDown && player.y < 350) {
      player.y += player.speed;
    }
    if (keys.ArrowLeft && player.x > 0) {
      player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < gameArea.offsetWidth - 275) {
      player.x += player.speed;
    }

    player.x += player.speed * 2; // sets the plane speed
    if (player.x > gameArea.offsetWidth) {
      player.x = -200; // resets the plane back to -200 of the start to keep it looping on the screen
      player.score -= 50; // score drops as the plane moves
    }

    player.score--;
    if (player.score < 0) {
      // score can't go into negative numbers
      player.score = 0;
    }
    player.plane.style.left = player.x + "px"; //updating the plane movement using the player.x values
    player.plane.style.top = player.y + "px"; //updating the plane movement using the player.y values
    window.requestAnimationFrame(playGame); //reinitiated the animation to have it loop through the playGame function
    score.innerHTML = "Score: " + player.score;
    level.innerHTML = "Remaining Levels: " + player.level;
  }
}

function endGame() {
  pausePlaneAudio();
  player.inplay = false;
  gameMessage.classList.remove("hide"); // removing the "hide" class to SHOW the start button
  gameArea.scoreboard = document.createElement("div"); // Dynamically creates the Plane once Start is clicked
  gameArea.scoreboard.setAttribute("class", "scoreboard");
  gameArea.appendChild(gameArea.scoreboard);
  gameArea.scoreboard.innerHTML = "High Score = " + player.score;
  score.classList.add("hide");
  level.classList.add("hide");
  song.classList.add("hide");
}

// Key Stroke Functions
function pressOn(e) {
  e.preventDefault();
  let tempKey = e.key == " " ? "space" : e.key;
  keys[tempKey] = true;
}

function pressOff(e) {
  e.preventDefault();
  let tempKey = e.key == " " ? "space" : e.key;
  keys[tempKey] = false;
}
