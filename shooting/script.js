const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
  x: 50,
  y: canvas.height / 2 - 25,
  width: 50,
  height: 50,
  color: 'blue',
  speed: 5,
};

let bullets = [];

const enemy = {
  x: canvas.width - 70,
  y: canvas.height / 2 - 25,
  width: 50,
  height: 50,
  color: 'red',
  speed: 2,
};

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawEnemy() {
  ctx.fillStyle = enemy.color;
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}

function drawBullets() {
  ctx.fillStyle = 'black';
  for (const bullet of bullets) {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }
}


function moveBullets() {
  for (const bullet of bullets) {
    bullet.x += 5;
  }
  bullets = bullets.filter(bullet => bullet.x < canvas.width);
}

function collisionDetection() {
  for (const bullet of bullets) {
    if (
      bullet.x < enemy.x + enemy.width && 
      bullet.x + bullet.width > enemy.x &&
      bullet.y < enemy.y + enemy.height &&
      bullet.y + bullet.height > enemy.y
    ) {
      alert('You Win!');
      resetGame();
    }
  }
}

function resetGame() {
  player.y = canvas.height / 2 - 25;
  enemy.x = canvas.width - 70;
  bullets.length = 0;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawEnemy();
  drawBullets();
  moveBullets();
  collisionDetection();

  if (player.y < 0 || player.y + player.height > canvas.height) {
    resetGame();
  }

  requestAnimationFrame(gameLoop);
}

function handleKeyDown(event) {
  if (event.key === 'ArrowUp' && player.y > 0) {
    player.y -= player.speed;
  } else if (event.key === 'ArrowDown' && player.y + player.height < canvas.height) {
    player.y += player.speed;
  } else if (event.key === ' ' || event.key === 'Spacebar') {
    bullets.push({
      x: player.x + player.width,
      y: player.y + player.height / 2 - 2.5,
      width: 5,
      height: 5,
    });
  }
}

document.addEventListener('keydown', handleKeyDown);
gameLoop();