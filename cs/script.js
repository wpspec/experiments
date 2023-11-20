const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
  x: 50,
  y: canvas.height - 30,
  width: 20,
  height: 20,
  color: '#00F',
  speed: 0.05,
};

const minion = {
  x: canvas.width - 50,
  y: canvas.height - 30,
  width: 20,
  height: 20,
  color: '#F00',
  speed: 2,
};

let isMousePressed = false;
let targetX = canvas.width / 2;
let targetY = canvas.height - 30;

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
}

function drawMinion() {
  ctx.fillStyle = minion.color;
  ctx.fillRect(minion.x, minion.y, minion.width, minion.height);
}

function update() {

  player.x = lerp(player.x, targetX, player.speed);
  player.y = lerp(player.y, targetY, player.speed);

  minion.x -= minion.speed;

  if (
    player.x - player.width / 2 < minion.x + minion.width &&
    player.x + player.width / 2 > minion.x &&
    player.y - player.height / 2 < minion.y + minion.height &&
    player.y + player.height / 2 > minion.y
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

function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawMinion();

  update();

  requestAnimationFrame(gameLoop);
}

document.addEventListener('mousedown', function () {
  isMousePressed = true;
  targetX = event.clientX;
  targetY = event.clientY;
});

document.addEventListener('mouseup', function () {
  isMousePressed = false;
});

gameLoop();