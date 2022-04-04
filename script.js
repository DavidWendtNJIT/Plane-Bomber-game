// Use HTML elements for JS functionality
const score = document.querySelector(".score");
const gameArea = document.querySelector(".gameArea");
const gameMessage = document.querySelector(".gameMessage");

// Functionality
document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);
document.addEventListener("click", start);

let player = {
  score: 0,
  speed: 3,
  inplay: false,
};

let keys = {
  space: false,
};

// Function for when the game starts and some default values
function start() {
  if (!player.inplay) {
    makeTarget();
    gameMessage.classList.add("hide"); // Hides the Start Button
    player.inplay = true;
    player.score = 5000; // Starting Score
    player.plane = document.createElement("div"); // Dynamically creates the Plane once Start is clicked
    player.plane.setAttribute("class", "plane");
    gameArea.appendChild(player.plane);
    window.requestAnimationFrame(playGame);
    player.x = player.plane.offsetLeft;
    player.y = player.plane.offsetTop;
  }
}

function makeTarget() {
  player.target = document.createElement("div"); // Creates the Target
  player.target.setAttribute("class", "target");
  player.target.style.width = Math.floor(Math.random() * 250) + 10 + "px"; // Sets the width at random with a minimum of 10px
  player.target.style.height = Math.floor(Math.random()*100)+250+"px"; // Sets the height at random with a minimum of 250px
  player.target.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 200)) + 100 + "px"; // Sets the horizontal position at random within 100px of the edge of the game area
  gameArea.appendChild(player.target);
}

function makeBomb(){
  console.log("bomb");
  if(player.inplay){

  }
}

function playGame() {
  if (player.inplay) {

    if(keys.space){ // Creates a bomb once Space is pressed
      makeBomb();
    }

    // Controls of Plane from keyboard arrows, and sets boundaries
    if (keys.ArrowUp && player.y > 0) {
      player.y -= player.speed;
    }
    if (keys.ArrowDown && player.y < 400) {
      player.y += player.speed;
    }
    if (keys.ArrowLeft && player.x > 0) {
      player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < gameArea.offsetWidth - 275) {
      player.x += player.speed;
    }

    player.x += player.speed * 2;
    if (player.x > gameArea.offsetWidth) {
      player.x = 0;
      player.score -= 100;
    }

    player.score--;
    if (player.score < 0) {
      player.score = 0;
    }
    player.plane.style.left = player.x + "px";
    player.plane.style.top = player.y + "px";
    window.requestAnimationFrame(playGame);
    score.innerHTML = "Score: " + player.score;
  }
}

// Key Stroke Functions
function pressOn(e) {
  e.preventDefault();
  let tempKey = e.key == " " ? "space" : e.key;
  keys[tempKey] = true;
  console.log(keys);
}

function pressOff(e) {
  e.preventDefault();
  let tempKey = e.key == " " ? "space" : e.key;
  keys[tempKey] = false;
  console.log(keys);
}
