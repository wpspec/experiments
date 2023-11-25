let player = {
  name: "Player",
  health: 100,
  experience: 0,
  level: 1
};

function explore() {
  let randomNumber = Math.random();

  if (randomNumber < 0.5) {
    player.experience += 10;
    document.getElementById("result").innerHTML = "You found a treasure! +10 experience.";  
  } else {
    document.getElementById("result").innerHTML  = "You encounter a monster!";
    document.getElementById("button-container").style.display = "block";
    document.getElementBYId("exploreButton").style.display = "none";
  }

  updateStats();
}

function fight() {
  simulateBattle();
  document.getElementById("button-container").style.display = "none";
  checkGameOver();
  checkLevelUp();
}

function runAway() {
  player.health -= 10;
  document.getElementById("result").innerHTML += "<br>You ran away but got injured. -10 health.";
  document.getElementById("button-container").style.display = "none";
  updateStats();
  checkGameOver();
  checkLevelUp();
}

function simulateBattle() {
  let playerAttack = Math.floor(Math.random() * (20 + player.level)) + 1;
  let enemyAttack = Math.floor(Math.random() * 20) + 1;

  if (playerAttack > enemyAttack) {
    player.experience += 20;
    document.getElementById("result").innerHTML += "<br>You defeated the monster! +20 experience.";
  } else {
    player.health -= 15;
    document.getElementById("result").innerHTML += "<br>You were defeated. -15 health.";
  }

  updateStats();
}

function updateStats() {
  document.getElementById("result").innerHTML += "<br>" + 
    "Player Stats: " + 
    "Name: " + player.name + 
    ", Health: " + player.health + 
    ", Experience: " + player.experience +
    ", Level: " + player.level;
}

function checkGameOver() {
  if (player.health <= 0) {
    document.getElementById("result").innerHTML += "<br>Game Over! Your health reached 0.";
    document.getElementById("exploreButton").style.display = "none";
  }
}

function checkLevelUp() {
  if (player.experience >= player.level * 100 && player.level < 100) {
    player.level++;
    player.health += 5;
    document.getElementById("result").innerHTML += "<br>Congratulations! You leveled up to level " + 
    player.level + ". +5 health.";
  }
}