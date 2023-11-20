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

let enemies = [];

let score = 0;

let moveEnemyDown = false;

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawEnemies() {
  ctx.fillStyle = 'red';
  for (const enemy of enemies) {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  }
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

function moveEnemies() {
  for (const enemy of enemies) {
    if (moveEnemyDown) {
      enemy.y += enemy.speed;
    } else {
      enemy.x -= enemy.speed;
      if (enemy.x < 0) {
        enemy.x = 0;
      }
    }
  }
  enemies = enemies.filter(enemy => enemy.x + enemy.width > 0);
}

function spawnEnemy() {
  const distanceThreshold = 200;
  const lastEnemy = enemies[enemies.length - 1];

  if (!lastEnemy || (lastEnemy.x + lastEnemy.width) < (canvas.width - distanceThreshold)) {
    const newEnemy = {
      x: canvas.width - 50,
      y: Math.floor(Math.random() * canvas.height - 50),
      width: 50,
      height: 50,
      speed: 2,
    };
    enemies.push(newEnemy);
  }  
}

function collisionDetection() {
  for (const bullet of bullets) {
    for (let i = 0; i < enemies.length; i ++) {
      const enemy = enemies[i];
      if (
        bullet.x < enemy.x + enemy.width && 
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
        ) {
        score++;
        enemies.splice(i, 1);
        i--;
      }
    }
  }
}

function resetGame() {
  player.y = canvas.height / 2 - 25;
  bullets.length = 0;
  enemies.length = 0;
  score = 0;
  moveEnemyDown = false;
}

function displayScore() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawEnemies();
  drawBullets();
  moveBullets();
  moveEnemies();
  collisionDetection();
  displayScore();

  if (player.y < 0 || player.y + player.height > canvas.height) {
    resetGame();
  }

  if (Date.now() % 2000 < 20) {
    moveEnemyDown = !moveEnemyDown;
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

setInterval(() => {
  spawnEnemy();
}, 3000);