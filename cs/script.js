const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  width: 20,
  height: 20,
  color: '#00F',
  speed: 0,
  acceleration: 0.01,
  mass: 1,
};

const minions = [];
const minionCount = 7;

for (let i = 0; i < minionCount; i++) {
  minions.push({
    x: canvas.width - 50 - i * 30,
    y: canvas.height - 30,
    width: 20,
    height: 20,
    color: '#F00',
    speed: 2,
    mass: 1,
  });
}

let isMousePressed = false;
let targetX = canvas.width / 2;
let targetY = canvas.height - 30;

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
}

function drawMinions() {
  for (const minion of minions) {
    ctx.fillStyle = minion.color;
    ctx.fillRect(minion.x - minion.width / 2, minion.y - minion.height / 2, minion.width, minion.height);
  }
  
}

function update() {

  player.speed += (targetX - player.x) * player.acceleration;
  player.x += player.speed;

  for (const minion of minions) {
    minion.x -= minion.speed;
  }

  for (const minion of minions) {
    const dx = player.x - minion.x;
    const dy = player.y - minion.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const combinedRadius = (player.width + minion.width) / 2;

    if (distance < combinedRadius) {
      const angle = Math.atan2(dy, dx);
      const overlap = combinedRadius - distance;

      player.x += overlap * Math.cos(angle);
      minion.x -= overlap * Math.cos(angle);

      const relativeVelocity = player.speed - minion.speed;
      const impulse = 2 * relativeVelocity / (player.mass + minion.mass);

      player.speed -= impulse * minion.mass;
      minion.speed += impulse * player.mass;
    }
  }

  for (const minion of minions) {
    if (minion.x <= 0) {
      resetMinions();
      break;
    }
  }
  
}

function resetMinions() {
  for (let i = 0; i < minionCount; i++) {
    minions[i].x = canvas.width - 50 - i * 30;
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawMinions();

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