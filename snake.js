// Simple "snake" game, will be used to test AI models
// Original code created with teh help of ChatGPT 4o
// TOTALLY unoptimized and unmodular, but this gives
// us a starting point for adding various AI code.
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake;
let apple;
let dx;
let dy;
let score;
let changingDirection;
let gameLoop;

document.addEventListener("keydown", changeDirection);
document.getElementById("startButton").addEventListener("click", startGame);

function startGame() {
  snake = [{ x: 20, y: 20 }];
  apple = { x: 15, y: 15 };
  dx = 1;
  dy = 0;
  score = 0;
  changingDirection = false;
  document.getElementById("score").innerHTML = "Score: " + score;

  clearInterval(gameLoop);
  gameLoop = setInterval(main, 100);
}

function main() {
  if (gameOver()) {
    clearInterval(gameLoop);
    alert("Game Over! Your score was " + score);
    return;
  }

  changingDirection = false;
  clearCanvas();
  drawApple();
  advanceSnake();
  drawSnake();
}

function clearCanvas() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "green";
  snake.forEach((part) =>
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize)
  );
}
// Keep adding a new "head" to the snake and deleting the trailing bit
// of the tail, to make the snake move.
// However, if we've just eaten an apple, don't delete the trailing bit
// of the tail.
function advanceSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    score += 10;
    document.getElementById("score").innerHTML = "Score: " + score;
    generateApple();
  } else {
    snake.pop();
  }
}

function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
}

function changeDirection(event) {
  if (changingDirection) return;
  changingDirection = true;

  const LEFT_KEY = 37;
  const UP_KEY = 38;
  const RIGHT_KEY = 39;
  const DOWN_KEY = 40;

  const keyPressed = event.keyCode;
  const goingUp = dy === -1;
  const goingDown = dy === 1;
  const goingRight = dx === 1;
  const goingLeft = dx === -1;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -1;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -1;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 1;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 1;
  }
}

function generateApple() {
  apple.x = Math.floor(Math.random() * tileCount);
  apple.y = Math.floor(Math.random() * tileCount);
  snake.forEach((part) => {
    const appleIsOnSnake = part.x == apple.x && part.y == apple.y;
    if (appleIsOnSnake) generateApple();
  });
}

function gameOver() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }

  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x >= tileCount;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y >= tileCount;

  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

// Initialize the game when the page loads
startGame();
