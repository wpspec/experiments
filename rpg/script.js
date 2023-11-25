let player = {
  name: "Player",
  currentHealth: 100,
  maxHealth: 100,
  experience: 0,
  level: 1,
  gold: 0
};

function explore() {
  let randomNumber = Math.random();

  if (randomNumber < 0.5) {
    player.gold += 10;
    document.getElementById("result").innerHTML = "You found a treasure! +10 gold.";  
  } else {
    document.getElementById("result").innerHTML  = "You encounter a monster!";
    document.getElementById("exploreButton").style.display = "none";
    document.getElementById("button-container").style.display = "block";
  }

  updateStats();
}

function buyPotion() {
  if (player.gold >= 20) {
    player.gold -= 20;
    player.currentHealth += 25;
    if (player.currentHealth > player.maxHealth) {
      player.currentHealth = player.maxHealth;
    }
    document.getElementById("result").innerHTML = "You bought a potion for 20 gold. +50 health.";    
  } else {
    document.getElementById("result").innerHTML = "You don't have enough gold to buy a potion.";
  }

  updateStats();
}

function fight() {
  simulateBattle();
  document.getElementById("button-container").style.display = "none";
  document.getElementById("exploreButton").style.display ="inline-block";
  checkGameOver();
  checkLevelUp();
}

function runAway() {
  player.currentHealth -= 10;
  if (player.currentHealth < 0) {
    player.currentHealth = 0;
  }
  document.getElementById("result").innerHTML += "<br>You ran away but got injured. -10 health.";
  document.getElementById("button-container").style.display = "none";
  document.getElementById("exploreButton").style.display = "inline-block"
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
    player.currentHealth -= 15;
    if (player.currentHealth < 0) {
      player.currentHealth = 0;
    }
    document.getElementById("result").innerHTML += "<br>You were defeated. -15 health.";
  }

  updateStats();
}

function updateStats() {
  document.getElementById("result").innerHTML += "<br>" + 
    "Player Stats: " + 
    "Name: " + player.name + 
    ", Health: " + player.currentHealth + 
    "/" + player.maxHealth +
    ", Experience: " + player.experience +
    ", Level: " + player.level +
    ", Gold: " + player.gold;

  document.getElementById("exploreButton").style.backgroundColor = "";
  document.getElementById("exploreButton").disabled = false;
}

function checkGameOver() {
  if (player.currentHealth <= 0) {
    document.getElementById("result").innerHTML += "<br>Game Over! Your health reached 0.";
    document.getElementById("exploreButton").style.display = "none";
    document.getElementById("buyPotionButton").disabled = true;
  }
}

function checkLevelUp() {
  if (player.experience >= player.level * 100 && player.leevel < 100) {
    player.level++;
    player.currentHealth += 5;
    player.currentHealth = player.maxHealth;
    player.experience = 0;
    document.getElementById("result").innerHTML += "<br>Congratulations! You leveled up to level " + 
    player.level + ". Maximum health increased to " + player.maxHealth + ".";
  }
}