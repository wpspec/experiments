let playerAgility = 5;
let playerHealth = 10;

const enemies = [
  { name: "Slime", agility: 1, damage: 1 }, 
  { name: "Goblin", agility: 5, damage: 2 }, 
  { name: "Orc", agility: 10, damage: 5}
];

function startHunt() {
  console.log("startHunt function called");
  let randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
  displayMessage(`You encountered a ${randomEnemy.name} with agility ${randomEnemy.agility}`);

  let fightButton = document.createElement("button");
  fightButton.innerText = "FIGHT";
  fightButton.onclick = () => fight(randomEnemy);

  let runAwayButton = document.createElement("button");
  runAwayButton.innerText = "RUN AWAY";
  runAwayButton.onclick = () => runAway(randomEnemy);

  document.getElementById("message").innerHTML = "";
  document.getElementById("message").appendChild(fightButton);
  document.getElementById("message").appendChild(runAwayButton);  
}

function fight(enemy) {
  if (playerAgility < enemy.agility) {
    playerHealth -= enemy.damage;
    displayMessage(`You took ${enemy.damage} damage! Your health: ${playerHealth}`);
  } else {
    displayMessage(`You defeated the ${enemy.name}!`);
  }
  resetGame();
}

function runAway(enemy) {
  if (playerAgility < enemy.agility) {
    playerHealth -= 1;
    displayMessage(`You tried to run away but took 1 damage! Your health: ${playerHealth}`);    
  } else {
    displayMessage(`You successfully ran away from the ${enemy.name}!`);
  }
  resetGame();
}

function displayMessage(message) {
  let messageDiv = document.getElementById("message");
  messageDiv.textContent = message;
}

function resetGame() {
  if (playerHealth <= 0) {
    displayMessage("Game Over! You ran out of health.");
  } else {
    document.getElementById("message").innerHTML = '<button onclick="startHunt()">HUNT</button>';
  }
}