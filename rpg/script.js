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
    player.health -= 10;
    document.getElementById("result").innerHTML = "You encounter a monster! -10 health.";
  }

  updateStats();
}

function updateStats() {
  document.getElementById("result").innerHTML += "<br>" + 
    "Player Stats: " + 
    "Name: " + player.name + 
    ", Health: " + player.health + 
    ", Experience: " + player.experience;
}