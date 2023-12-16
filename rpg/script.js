let player = {
  name: "Player",
  currentHealth: 100,
  maxHealth: 100,
  experience: 0,
  level: 1,
  gold: 500,
  agility: 17,
  damage: 15,
  defense: 10,
  strikePotionActive: false,
  ironSwordBought: false,
  slingshotAmmo: 99,
};

let inventory = [];

let ironSwordUpgrades = {
  doubleStrike: false,
  lifesteal: false,
  midasTouch: false
};

let currentMonster = null;
let playerDefeatedCurrentMonster = false;

let enemies = [
  { name: "Slime 🤢", health: 40, currentHealth: 40, damage: 15, agility: 1, defense: 5, hiddenAbility: "Dissolve" },
  { name: "Goblin 👹", health: 60, currentHealth: 60, damage: 30, agility: 5, defense: 8 },
  { name: "Orc 💀", health: 80, currentHealth: 80, damage: 50, agility: 7, defense: 12 }
];

window.addEventListener('load', (event) => {
  document.getElementById("exploreButton").addEventListener("click", updateInventoryDisplay);
  updateInventoryDisplay();
});

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

function buyIronSword() {
  if (!player.ironSwordBought) {
    if (player.gold >= 50) {
      player.gold -= 50;
      player.damage += 10;

      player.ironSwordBought = true;

      document.getElementById("result").innerHTML = "You bought an Iron Sword for 50 gold. Your damage increased by 10.";
      updateStats();
    } else {
      document.getElementById("result").innerHTML = "You don't have enough gold to buy an Iron Sword.";
    }
  } else {
    document.getElementById("result").innerHTML = "You already bought an Iron Sword.";
  }
}

function upgradeIronSword(upgradeType) {
  switch (upgradeType) {
    case 'doubleStrike':
      buyIronSwordUpgrade(50, 'doubleStrike', 'You upgraded your Iron Sword. Double Strike unlocked!');
      ironSwordUpgrades.doubleStrike = true;
      break;
    case 'lifesteal':
      buyIronSwordUpgrade(100, 'lifesteal', 'You upgraded your Iron Sword. Lifesteal unlocked!');
      ironSwordUpgrades.lifesteal = true;
      break;
    case 'midasTouch':
      buyIronSwordUpgrade(150, 'midasTouch', 'You upgraded your Iron Sword. Midas Touch unlocked!');
      ironSwordUpgrades.midasTouch = true;
      break;
    default:
      break;
  }
}

function buyIronSwordUpgrade(cost, upgradeType, successMessage) {
  if (player.gold >= cost && !player[upgradeType]) {
    player.gold -= cost;
    player[upgradeType] = true;
    document.getElementById("result").innerHTML = successMessage;
    updateStats();
  } else if (player[upgradeType]) {
    document.getElementById("result").innerHTML = `You already have the ${upgradeType} upgrade.`;
  } else {
    document.getElementById("result").innerHTML = `You don't have enough gold to buy the ${upgradeType} upgrade.`;
  }
}

function craftDefensePotion() {
  const requiredSlimeCores = 3;

  if(countItemInInventory("Slime Core") >= requiredSlimeCores) {
    for (let i = 0; i < requiredSlimeCores; i++) {
      removeItemInInventory("Slime Core");
    }

    inventory.push("Defense Up Potion");

    updateInventoryDisplay();

    document.getElementById("result").innerHTML = "Crafted Defense Up Potion successfully.";
  } else {
    document.getElementById("result").innerHTML = "Not enough Slime Cores to craft Defense Up Potion.";
  }
}

function craftSlingshot() {
  if (countItemInInventory("Shabby Cloth") >= 2 && countItemInInventory("Slime Core") >= 1) {
    removeItemInInventory("Shabby Cloth");
    removeItemInInventory("Shabby Cloth");
    removeItemInInventory("Slime Core");

    inventory.push("Slingshot");

    updateInventoryDisplay();

    document.getElementById("result").innerHTML = "Crafted a Slingshot!";
  } else {
    document.getElementById("result").innerHTML = "Not enough ingredients to craft a Slingshot.";
  }
}

function craftSlingshotAmmo() {
  if (countItemInInventory("Slime Core") >= 2) {
    removeItemInInventory("Slime Core");
    removeItemInInventory("Slime Core");

    inventory.push("Slingshot Ammo");

    updateInventoryDisplay();

    document.getElementById("result").innerHTML = "Crafted a Slingshot!";
  } else {
    document.getElementById("result").innerHTML = "Not enough ingredients to craft a Slingshot Ammo!.";
  }
}

function countItemInInventory(item) {
  return inventory.filter((i) => i === item).length;
}

function removeItemInInventory(item) {
  const index = inventory.indexOf(item);
  if (index !== -1) {
    inventory.splice(index, 1);
  }
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

function shoot() {
  if (player.slingshotAmmo > 0) {
    const damageDealt = 5;

    player.slingshotAmmo -= 1;

    currentMonster.currentHealth -= damageDealt;

    document.getElementById("result").innerHTML += `<br>You dealt 5 damage to the enemy! Enemy's health: ${currentMonster.currentHealth}`;

    updateStats();
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

function applyLifesteal(damage) {
  if (ironSwordUpgrades.lifesteal) {
    let lifestealAmount = Math.floor(0.25 * damage);
    console.log(lifestealAmount);
    player.currentHealth += lifestealAmount;
    document.getElementById("result").innerHTML += `<br>Lifesteal! You healed for ${lifestealAmount}.`;
    if (player.currentHealth > player.maxHealth) {
      player.currentHealth = player.maxHealth;
    }
  }
}

function simulateDoubleStrike(attacker, defender) {
  let damage = Math.max(attacker.damage - defender.defense, 0);

  if (attacker === player && ironSwordUpgrades.doubleStrike) {
    document.getElementById("result").innerHTML += `<br>Player strikes again for ${damage} damage.`;

    applyLifesteal(damage);
    applyLifesteal(damage);

    defender.currentHealth -= damage;
  } else {
    defender.currentHealth -= damage;

    applyLifesteal(damage);
  }

  if (defender.hiddenAbility) {
    activateHiddenAbility(attacker, defender);
  }

  updateStats();
}
function simulateBattle(attacker, defender = {}) {

  let damage = attacker.damage;
  
  if (attacker === player && player.strikePotionActive) {
    damage *= 2;
  }

  damage = Math.max(damage - defender.defense, 0);


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
  applyLifesteal(damage);
  simulateDoubleStrike(attacker, defender);

  if (attacker === player && ironSwordUpgrades.midasTouch) {
    let randomNumber = Math.random();
    if (randomNumber < 0.25) {
      defender.currentHealth -= defender.health;
      document.getElementById("result").innerHTML += `<br>Enemy turned to gold! You earned ${defender.health}.`;
      player.gold += defender.health;
    }
  }


  if (defender.hiddenAbility) {
    activateHiddenAbility(attacker, defender);
  }


  updateStats();

  if (secondStriker.currentHealth <= 0) {
    currentMonster.currentHealth += currentMonster.health;
    currentMonster = null;

    let experienceReward = 0;
    if (defender.name === "Slime 🤢") {
      experienceReward = 5;
    } else if (defender.name === "Goblin 👹") {
      experienceReward = 10;
    } else if (defender.name === "Orc 💀") {
      experienceReward = 20;
    }

    player.experience += experienceReward;


    document.getElementById("result").innerHTML += `<br>You defeated the ${defender.name}. You earned ${experienceReward} experience!`;

    let dropChance = Math.random();
    if (dropChance < 0.35) {
      let item = getEnemySpecificItem(defender.name);
      inventory.push(item);
      document.getElementById("result").innerHTML += `<br>${defender.name} dropped ${item}!`;
    }

    document.getElementById("exploreButton").style.display = "inline-block";
    document.getElementById("button-container").style.display = "none";

    updateInventoryDisplay();
  } else {
    enemyStrikeBack(secondStriker, firstStriker);
  }
}

function activateHiddenAbility(attacker, enemy) {
  switch (enemy.hiddenAbility) {
    case "Dissolve":
      if (attacker === player && player.ironSwordBought) {
	let dissolveChance = Math.random();
	if (dissolveChance < 0.25) {
	  player.ironSwordBought = false;
	  player.damage -= 10;
	  document.getElementById("result").innerHTML += "<br>The Slime dissolved your Iron Sword!";
	}
      }
      break;
  }
}

function getEnemySpecificItem(enemyType) {
  switch (enemyType) {
    case "Slime 🤢":
      return "Slime Core";
    case "Goblin 👹":
      return "Shabby Cloth";
    case "Orc 💀":
      return "Orc Bones";
    default:
      return "Unknown Item";
  }
}

function updateInventoryDisplay() {
  let inventoryListElement = document.getElementById("inventory-list");
  inventoryListElement.innerHTML = " ";

  let itemCounts = {};

  inventory.forEach((item) => {
    itemCounts[item] = (itemCounts[item] || 0) + 1;
  });

  for (let item in itemCounts) {
    let sellButton = `<button onclick="sellItem('${item}')">Sell</button>`;
    let useButton = item.includes("Defense Up Potion") ? `<button onclick="useItem('${item}')">Use</button>` : "";
    useButton = item.includes("Slingshot") ? `<button onclick="useItem('${item}')">Use</button>` : useButton;
    inventoryListElement.innerHTML += `<li>${item} X ${itemCounts[item]} ${useButton} ${sellButton}</li>`;
  }
}

function useItem(item) {
  switch (item) {
    case "Defense Up Potion":
      player.defense += 7;
      removeItemInInventory(item);
      document.getElementById("result").innerHTML = "You used a Defense Up Potion. Your defense increased by 7!";
      break;
    case "Slingshot":
      player.damage += 10;
      removeItemInInventory(item);
      document.getElementById("result").innerHTML = `You used a Slingshot! Your damage is increased to ${player.damage}`;
      break;
    default:
      break;
  }

  updateStats();
  updateInventoryDisplay();
}

function sellItem(item) {
  const index = inventory.indexOf(item);

  if (index !== -1) {
    inventory.splice(index, 1);

    player.gold += getItemSellValue(item);

    updateInventoryDisplay();
    updateStats();
  }
}

function getItemSellValue(item) {
  const sellValues = {
    "Slime Core": 5, 
    "Shabby Cloth": 8, 
    "Orc Bones": 12,
    "Defense Up Potion": 25,
  };

  return sellValues[item] || 0;
}

function enemyStrikeBack(attacker, defender) {
  let damage = Math.max(attacker.damage - player.defense, 0);

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
    Agility: ${player.agility},
    Damage: ${player.damage}, 
    Defense: ${player.defense}, 
    Slingshot Ammo: ${player.slingshotAmmo}`;

  if (currentMonster && player.currentHealth > 0) {
    document.getElementById("button-container").style.display = "block";
  } else {
    document.getElementById("button-container").style.display = "none";
  }

  if (player.ironSwordBought) {
    document.getElementById("ironSwordUpgrades").style.display = "block";
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

window.addEventListener('keydown', (event) => {
  if (event.key === 'e') {
    explore();
  }

  if (event.key === 'f') {
    fight();
  }

  if (event.key === 'd') {
    runAway();
  }

  if (event.key === '1') {
    buyHealthPotion();
  }

  if (event.key === '2') {
    buyStrikePotion();
  }
})
