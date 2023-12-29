let player = {
  name: "PLAYER",
  currentHealth: 100,
  maxHealth: 100,
  experience: 0,
  level: 1,
  gold: 500,
  agility: 17,
  damage: 50,
  defense: 10,
  strikePotionActive: false,
};

let inventory = [];

let currentMonster = null;
let playerDefeatedCurrentMonster = false;

let enemies = [
  { name: "SLIME", health: 40, currentHealth: 40, damage: 15, agility: 1, defense: 5 },
  { name: "GOBLIN", health: 60, currentHealth: 60, damage: 30, agility: 5, defense: 8 },
  { name: "ORC", health: 80, currentHealth: 80, damage: 50, agility: 7, defense: 12 }
];

const craftingRecipes = {
  'Defense Up Potion': { ingredients: ['Slime Core', 'Slime Core', 'Slime Core'], result: 'Defense Up Potion' },
};

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

function offerSacrifices() {
  const experienceFromSacrifices = calculateExperienceFromInventory();
  player.experience += experienceFromSacrifices;

  inventory = [];

  document.getElementById("result").innerHTML = `You offered sacrifices and experience 
  gained ${experienceFromSacrifices} experience!`;

  updateStats();
  updateInventoryDisplay();
} 

function calculateExperienceFromInventory() {
  let totalExperience = 0;

  inventory.forEach((item) => {
    const enemyItem = item;
    totalExperience += enemyItem.experienceValue;
  });

  return totalExperience;
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

  if (defender.hiddenAbility) {
    activateHiddenAbility(attacker, defender);
  }


  updateStats();

  if (secondStriker.currentHealth <= 0) {
    currentMonster.currentHealth += currentMonster.health;
    currentMonster = null;

    let experienceReward = 0;
    if (defender.name === "SLIME") {
      experienceReward = 5;
    } else if (defender.name === "GOBLIN") {
      experienceReward = 10;
    } else if (defender.name === "ORC") {
      experienceReward = 20;
    }

    player.experience += experienceReward;

    document.getElementById("result").innerHTML += `<br>You defeated the ${defender.name}. You earned ${experienceReward} experience!`;

    let dropChance = Math.random();
    if (dropChance < 0.75) {
      let item = getEnemySpecificItem(defender.name);
      inventory.push(item);
      document.getElementById("result").innerHTML += `<br>${defender.name} dropped ${item.item}!`;
    }

    document.getElementById("exploreButton").style.display = "inline-block";
    document.getElementById("button-container").style.display = "none";

    updateInventoryDisplay();
  } else {
    enemyStrikeBack(secondStriker, firstStriker);
  }
}

function getEnemySpecificItem(enemyType) {
  switch (enemyType) {
    case "SLIME":
      return { item: "Slime Core", experienceValue: 5 };
    case "GOBLIN":
      return { item: "Shabby Cloth", experienceValue: 10 };
    case "ORC":
      return { item: "Orc Bones", experienceValue: 20 };
    default:
      return { item: "Unknown Item", experienceValue: 0 };
  }
}

function updateInventoryDisplay() {
  let inventoryListElement = document.getElementById("inventory-list");
  inventoryListElement.innerHTML = " ";

  let itemCounts = {};

  inventory.forEach((itemObject) => {
    const itemName = itemObject.item;
    itemCounts[itemName] = (itemCounts[itemName] || 0) + 1;
  });

  for (let itemName in itemCounts) {
    let sellButton = `<button onclick="sellItem('${itemName}')">Sell</button>`;
    inventoryListElement.innerHTML += `<li>${itemName} X ${itemCounts[itemName]} ${sellButton}</li>`;
  }
}

function useItem(item) {
  switch (item) {
    case "Defense Up Potion":
      player.defense += 7;
      removeItemInInventory(item);
      document.getElementById("result").innerHTML = "You used a Defense Up Potion. Your defense increased by 7!";
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

function craftItem(itemName) {
  const recipe = craftingRecipes[itemName];

  if (recipe) {
    if (hasIngredients(recipe.ingredients)) {
      consumeIngredients(recipe.ingredients);

      inventory.push(recipe.result);

      document.getElementById("result").innerHTML = `Crafted ${itemName} successfully.`;

      updateInventoryDisplay();
    } else {
      document.getElementById("result").innerHTML = "Not enough ingredients to craft this item.";
    }
  } else {
    document.getElementById("result").innerHTML = "Crafting recipe not found.";
  }
}

function hasIngredients(ingredients) {
  return ingredients.every((ingredient) => countItemInInventory(ingredient) >= 1);
}

function consumeIngredients(ingredients) {
  ingredients.forEach((ingredient) => removeItemInInventory(ingredient));
}

function enemyStrikeBack(attacker, defender) {
  let damage = Math.max(attacker.damage - player.defense, 0);

  let evasionChance = (player.agility * 0.01);
  let isEvaded = Math.random() < evasionChance;

  let nameColor = defender.name === "PLAYER" ? 'var(--second)' : 'var(--first)';
  let goBold;
  if (defender.name === "PLAYER") {
    goBold = 900;
  }

  if (isEvaded){
    document.getElementById("result").innerHTML += `<br>${defender.name} evaded ${attacker.name}'s attack! No damage taken.`;
  } else {
    defender.currentHealth -= damage;
    document.getElementById("result").innerHTML += `<br>${attacker.name} strikes back! <span style="color: ${nameColor}; font-weight: ${goBold}">${defender.name}</span> took ${damage} damage. <span style="color: ${nameColor} font-weight: ${goBold}">${defender.name}</span>'s health: ${defender.currentHealth}.`;
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

  let healthColor = player.currentHealth <= 40 ? 'red' : 'black';

  playerStatsElement.innerHTML = `Player Stats: 
    Name: ${player.name}, 
    Current Health: <span style="color: ${healthColor}">${player.currentHealth}</span>/${player.maxHealth}, 
    Experience: ${player.experience}, 
    Level: ${player.level}, 
    Gold: ${player.gold}, 
    Agility: ${player.agility},
    Damage: ${player.damage}, 
    Defense: ${player.defense}`;

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

window.addEventListener('keydown', (event) => {
  if (event.key === 'e') {
    explore();
  }

  if (event.key === 'f') {
    fight();
  }

  if (event.key === 's') {
    shoot();
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
