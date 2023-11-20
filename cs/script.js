const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
  x: 50,
  y: canvas.height - 30,
  width: 20,
  height: 20,
  color: '#00F',
  speed: 5,
};

const minion = {
  x: canvas.width - 50,
  y: canvas.height - 30,
  width: 20,
  height: 20,
  color: '#F00',
  speed: 2,
};

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawMinion() {
  ctx.fillStyle = minion.color;
  ctx.fillRect(minion.x, minion.y, minion.width, minion.height);
}

function update() {
  minion.x -= minion.speed;

  if (
    player.x < minion.x + minion.width &&
    player.x + player.width > minion.x &&
    player.y < minion.y + minion.height &&
    player.y + player.height > minion.y
  ) {
    alert('Minion caught! You got it!');
    resetMinion();
  }

  if (minion.x <= 0) {
    alert('Minion escaped! You missed the last hit!');
    resetMinion();
  }
}

function resetMinion() {
  minion.x = canvas.width - 50;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawMinion();

  update();

  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowRight' && player.x + player.width < canvas.width) {
    player.x += player.speed;
  } else if (event.key === 'ArrowLeft' && player.x > 0) {
    player.x -= player.speed;
  }
});

gameLoop();