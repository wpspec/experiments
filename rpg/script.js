let player = {
  name: "Player",
  health: 100,
  experience: 0
};

function explore() {
  let randomNumber = Math.random();

  if (randomNumber < 0.5) {
    player.experience += 10;
    document.getElementById("result").innerHTML = "You found a treasure! +10 experience.";  
  } else {
    document.getElementById("result").innerHTML  = "You encounter a monster!";

    let decision = confirm("Do you want to fight the monster?");

    if (decision) {
      simulateBattle();
    } else {
      player.health -= 10;
      document.getElementById("result").innerHTML += "<br>You ran away but got injured. -10 health.";
    }
  }

  updateStats();
}

function simulateBattle() {
  let playerAttack = Math.floor(Math.random() * 20) + 1;
  let enemyAttack = Math.floor(Math.random() * 20) + 1;

  if (playerAttack > enemyAttack) {
    player.experience += 20;
    document.getElementById("result").innerHTML += "<br>You defeated the monster! +20 experience.";
  } else {
    player.health -= 15;
    document.getElementById("result").innerHTML += "<br>You were defeated. -15 health.";
  }
}

function updateStats() {
  document.getElementById("result").innerHTML += "<br>" + 
    "Player Stats: " + 
    "Name: " + player.name + 
    ", Health: " + player.health + 
    ", Experience: " + player.experience;
}