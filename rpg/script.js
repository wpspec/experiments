let player = {
  name: "Player",
  currentHealth: 100,
  maxHealth: 100,
  experience: 0,
  level: 1,
  gold: 0,
  agility: 20,
  damage: 15,
  strikePotionActive: true
};

let currentMonster = null;
let playerDefeatedCurrentMonster = false;

let enemies = [
  { name: "Slime 🤢", health: 40, currentHealth: 40, damage: 15, agility: 1 },
  { name: "Goblin 👹", health: 60, currentHealth: 60, damage: 30, agility: 5 },
  { name: "Orc 💀", health: 80, currentHealth: 80, damage: 50, agility: 7 }
];


function getRandomEnemy() {
  let randomIndex = Math.floor(Math.random() * enemies.length);
  return enemies[randomIndex];
}

function explore() {
  let randomNumber = Math.random();

  if (randomNumber < 0.5) {
    player.gold += 10;
    document.getElementById("result").innerHTML = "You found a treasure! +10 gold.";
    currentMonster = null;
  } else {
    currentMonster = getRandomEnemy();
    document.getElementById("result").innerHTML = "You encountered a/an " + currentMonster.name + "!";
  }

  // Always display the buttons after exploration
  // document.getElementById("exploreButton").style.display = "none";
  document.getElementById("button-container").style.display = "block";

  updateStats();
}


function buyHealthPotion() {
  if (player.gold >= 10) {
    player.gold -= 10;
    player.currentHealth += 25;
    if (player.currentHealth > player.maxHealth) {
      player.currentHealth = player.maxHealth;
    }
    document.getElementById("result").innerHTML = "You bought a Health Potion for 10 gold. +25 health.";
  } else {
    document.getElementById("result").innerHTML = "You don't have enough gold to buy a Health Potion.";
  }

  updateStats();
}

function buyStrikePotion() {
  if (player.gold >= 20) {
    player.gold -= 10;

    player.strikePotionActive = true;
    document.getElementById("result").innerHTML = "You bought a Strike Potion for 10 gold. Your next attack will deal 200% damage!";
  } else {
    document.getElementById("result").innerHTML = "You don't have enough gold to buy a Strike Potion.";
  }

  updateStats();
}

function fight() {
  if (currentMonster) {
    if (player.agility >= currentMonster.agility) {
      simulateBattle(player, currentMonster);
    } else {
      simulateBattle(currentMonster, player);
    }

    checkGameOver();
    checkLevelUp();

    if (currentMonster && currentMonster.currentHealth > 0) {
      document.getElementById("exploreButton").style.display = "none";
      document.getElementById("button-container").style.display = "block";
    }

    player.strikePotionActive = false;
  }
}


function runAway() {
  if (currentMonster) {
    player.currentHealth -= 10;
    if (player.currentHealth < 0) {
      player.currentHealth = 0;
    }
    document.getElementById("result").innerHTML += "<br>You ran away but got injured. -10 health.";
    updateStats();
    checkGameOver();
    checkLevelUp();
  }
}

function simulateBattle(attacker, defender = {}) {
  let damage = attacker.damage;

  if (attacker === player && player.strikePotionActive) {
    damage *= 2;
  }

  let firstStriker = attacker.agility >= defender.agility ? attacker : defender;
  let secondStriker = firstStriker === attacker ? defender : attacker;

  if (defender.currentHealth <= 0) {
    if (playerDefeatedCurrentMonster) {
      document.getElementById("result").innerHTML += `<br>${attacker.name} struck first! ${defender.name} is already defeated.`;
      currentMonster = null;
      playerDefeatedCurrentMonster = true;
      return;
    }
  }

  secondStriker.currentHealth -= damage;

  if (secondStriker.currentHealth < 0) {
    secondStriker.currentHealth = 0;
  }

  document.getElementById("result").innerHTML += `<br>${firstStriker.name} struck first! ${secondStriker.name} took ${damage} damage. ${secondStriker.name}'s health: ${secondStriker.currentHealth}.`;

  updateStats();

  if (secondStriker.currentHealth <= 0) {
	  currentMonster.currentHealth += currentMonster.health;
    currentMonster = null;
    player.gold += 10;
    player.experience += 15;

    document.getElementById("result").innerHTML += `<br>You defeated the ${defender.name}. You earned 10 gold & 15 experience!`;

    document.getElementById("exploreButton").style.display = "inline-block";
    document.getElementById("button-container").style.display = "none";
  } else {
    enemyStrikeBack(secondStriker, firstStriker);
  }
}

function enemyStrikeBack(attacker, defender) {
  let damage = attacker.damage;

  let evasionChance = (player.agility * 0.01);
  let isEvaded = Math.random() < evasionChance;

  if (isEvaded){
    document.getElementById("result").innerHTML += `<br>${defender.name} evaded ${attacker.name}'s attack! No damage taken.`;
  } else {
    defender.currentHealth -= damage;
    document.getElementById("result").innerHTML += `<br>${attacker.name} strikes back! ${defender.name} took ${damage} damage. ${defender.name}'s health: ${defender.currentHealth}.`;
  }

  updateStats();

  if (player.currentHealth <= 0) {
    currentMonster = null;
    document.getElementById("exploreButton").style.display = "inline-block";
    document.getElementById("button-container").style.display = "none";
  }
}

function updateStats() {
  let playerStatsElement = document.getElementById("player-stats");

  playerStatsElement.innerHTML = `Player Stats: 
    Name: ${player.name}, 
    Current Health: ${player.currentHealth}/${player.maxHealth}, 
    Experience: ${player.experience}, 
    Level: ${player.level}, 
    Gold: ${player.gold}, 
    Agility: ${player.agility}`;

  if (currentMonster && player.currentHealth > 0) {
    document.getElementById("button-container").style.display = "block";
  } else {
    document.getElementById("button-container").style.display = "none";
  }
}

function checkGameOver() {
  if (player.currentHealth <= 0) {
    document.getElementById("result").innerHTML += "<br>Game Over! Your health reached 0.";
    document.getElementById("exploreButton").style.display = "none";
  }
}

function checkLevelUp() {
  if (player.experience >= player.level * 100 && player.level < 100) {
    player.level++;
    player.maxHealth += 5;
    player.currentHealth = player.maxHealth;
    player.agility += 5;
    player.experience = 0;
    document.getElementById("result").innerHTML += `<br>Congratulations! You leveled up to level ${player.level}. Maximum health increased to ${player.maxHealth}.`;
  }
}
