const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const resetBtn = document.getElementById("reset");

const width = canvas.width;
const height = canvas.height;
const groundHeight = 40;

let x, y, vx, vy, radius, alive, started, fade;
let startTime = Date.now();
const gravity = 0.5;
const bounceStrength = -10;

const obstacles = [];

function resetGame() {
  x = width / 2;
  y = height / 2;
  vx = 3;
  vy = 0;
  radius = 8;
  fade = 255;
  alive = true;
  started = false;
  startTime = Date.now();
  resetBtn.style.display = "none";
}

class Obstacle {
  constructor(cx, cy, r) {
    this.cx = cx;
    this.cy = cy;
    this.r = r;
    this.dx = Math.random() < 0.5 ? -1 : 1;
    this.dy = Math.random() < 0.5 ? -1 : 1;
  }

  move() {
    this.cx += this.dx;
    this.cy += this.dy;
    if (this.cx - this.r <= 0 || this.cx + this.r >= width) this.dx *= -1;
    if (this.cy - this.r <= 0 || this.cy + this.r >= height - groundHeight) this.dy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.r, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
  }

  collides(px, py, pr) {
    const dist = Math.hypot(this.cx - px, this.cy - py);
    return dist <= this.r + pr;
  }
}

function setupObstacles() {
  obstacles.length = 0;
  obstacles.push(new Obstacle(150, 200, 40));
  obstacles.push(new Obstacle(450, 100, 30));
  obstacles.push(new Obstacle(650, 350, 50));
  obstacles.push(new Obstacle(300, 400, 35));
  obstacles.push(new Obstacle(550, 250, 25));
  obstacles.push(new Obstacle(700, 150, 45));
}

setupObstacles();
resetGame();

canvas.addEventListener("mousedown", () => {
  if (started && alive) vy = bounceStrength;
});

resetBtn.addEventListener("click", () => {
  resetGame();
});

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0078FF";
  ctx.fillRect(0, height - groundHeight, width, groundHeight);

  for (const obs of obstacles) {
    obs.move();
    obs.draw();
  }

  const elapsed = Date.now() - startTime;
  if (elapsed >= 1000) started = true;

  if (started && alive) {
    x += vx;
    vy += gravity;
    y += vy;

    if (x - radius <= 0 || x + radius >= width) vx *= -1;
    if (y - radius <= 0) {
      y = radius;
      vy = 0;
    }
    if (y + radius >= height - groundHeight) {
      y = height - groundHeight - radius;
      alive = false;
      vy = 0;
    }

    for (const obs of obstacles) {
      if (obs.collides(x, y, radius)) {
        alive = false;
        break;
      }
    }

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
  } else if (!alive) {
    if (fade > 0 && radius > 0) {
      fade = Math.max(0, fade - 5);
      radius = Math.max(0, radius - 1);
      ctx.globalAlpha = fade / 255;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.globalAlpha = 1;
    } else {
      resetBtn.style.display = "block";
    }
  } else {
    ctx.fillStyle = "black";
    ctx.font = "64px sans-serif";
    ctx.fillText("get ready ethan huang", width / 2 - 180, height / 2);
  }

  requestAnimationFrame(draw);
}

draw();
