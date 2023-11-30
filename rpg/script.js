let player = {
  name: "Player",
  currentHealth: 100,
  maxHealth: 100,
  experience: 0,
  level: 1,
  gold: 0,
  agility: 5,
  damage: 15
};

let currentMonster = null;

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
    document.getElementById("result").innerHTML = "You bought a potion for 20 gold. +25 health.";
  } else {
    document.getElementById("result").innerHTML = "You don't have enough gold to buy a potion.";
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
  // Check agility to determine who strikes first
  let firstStriker = attacker.agility >= defender.agility ? attacker : defender;
  let secondStriker = firstStriker === attacker ? defender : attacker;

  // Calculate attacks
  let firstStrikerAttack = Math.floor(Math.random() * (20 + firstStriker.level)) + 1;
  let secondStrikerAttack = Math.floor(Math.random() * secondStriker.agility) + 1;

  // Get the damage value from the attacker
  let damage = (firstStriker === attacker ? attacker.damage : defender.damage);

  // Apply damage based on the results of the attacks
  if (firstStrikerAttack > secondStrikerAttack) {
    secondStriker.health -= damage;
    if (secondStriker.health <= 0) {
      secondStriker.health = 0;
      // Enemy defeated, reset state
      currentMonster = null;
      document.getElementById("exploreButton").style.display = "inline-block";
    }
    document.getElementById("result").innerHTML += `<br>${firstStriker.name} struck first! ${secondStriker.name} took ${damage} damage. ${secondStriker.name}'s health: ${secondStriker.health}.`;
  } else {
    firstStriker.health -= damage;
    if (firstStriker.health <= 0) {
      firstStriker.health = 0;
      // Enemy defeated, reset state
      currentMonster = null;
      document.getElementById("exploreButton").style.display = "inline-block";
    }
    document.getElementById("result").innerHTML += `<br>${secondStriker.name} struck first! ${firstStriker.name} took ${damage} damage. ${firstStriker.name}'s health: ${firstStriker.health}.`;
  }

  updateStats();

  // Check if the enemy's health is less than or equal to 0
  if (defender.health <= 0) {
    // Enemy defeated, hide the buttons
    document.getElementById("button-container").style.display = "none";
  } else {
    document.getElementById("button-container").style.display = "block";
  }
}


function updateStats() {
  document.getElementById("result").innerHTML += `<br>Player Stats: Name: ${player.name}, Current Health: ${player.currentHealth}/${player.maxHealth}, Experience: ${player.experience}, Level: ${player.level}, Gold: ${player.gold}, Agility: ${player.agility}`;
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
    player.experience = 0;
    document.getElementById("result").innerHTML += `<br>Congratulations! You leveled up to level ${player.level}. Maximum health increased to ${player.maxHealth}.`;
  }
}

document.addEventListener('keydown', function (event) {
  if (event.key === ' ') {
    explore();
  }
});