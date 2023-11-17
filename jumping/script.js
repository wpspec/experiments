const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
  x: 50,
  y: canvas.height - 30,
  width: 30,
  height: 30,
  color: "green",
  jumping: false,
  jumpHeight: 100,
  jumpCount: 0,
};

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
  ctx.fill();
}

function handleKeyPress(event) {
  if (event.code === "Space" && !player.jumping) {
    player.jumping = true;
  }
}

function update() {
  if (player.jumping) {
    player.y -= 5;
    player.jumpCount += 5;

    if (player.jumpCount >= player.jumpHeight) {
      player.jumping = false;
      player.jumpCount = 0;
    }
  } else if (player.y < canvas.height - player.height) {
    player.y += 5;
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  update();

  requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", handleKeyPress);

gameLoop();