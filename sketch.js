// sketch.js
let enemies = [];
let bullets = [];
let score = 0;
let gameOver = false;
let gameStarted = false;
let bgStars = [];
let powerReady = false;
let shotsFired = 0;
let evolutionLevel = 1;
let specialBeam = null;
let playerHealth = 3;

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
  for (let i = 0; i < 100; i++) {
    bgStars.push({ x: random(width), y: random(height), size: random(1, 3) });
  }
}

function draw() {
  background(10, 10, 30);
  drawStars();

  if (!gameStarted) {
    fill(0, 255, 255);
    textSize(36);
    text("AstroManRunners", width / 2, height / 2 - 40);
    textSize(18);
    text("Clique para começar", width / 2, height / 2);
    return;
  }

  if (gameOver) {
    fill(255, 0, 0);
    textSize(40);
    text("Game Over", width / 2, height / 2);
    textSize(20);
    text("Pontuação: " + score, width / 2, height / 2 + 40);
    return;
  }

  fill(255);
  textSize(16);
  text("Pontuação: " + score, 60, 20);
  text("Evolução: Lv " + evolutionLevel, width - 100, 20);
  text("Vida: " + playerHealth, width / 2, 50);

  if (powerReady) {
    fill(0, 255, 255);
    text("Poder Especial Pronto! (Pressione ESPAÇO)", width / 2, 30);
  } else {
    fill(180);
    text("Poder: " + shotsFired + "/10", width / 2, 30);
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();
    enemies[i].show();

    if (enemies[i].x >= width - 50) {
      enemies.splice(i, 1);
      playerHealth--;
      if (playerHealth <= 0) {
        gameOver = true;
      }
    }
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].show();

    for (let j = enemies.length - 1; j >= 0; j--) {
      if (bullets[i] && bullets[i].hits(enemies[j])) {
        enemies.splice(j, 1);
        bullets.splice(i, 1);
        score++;
        if (score % 10 === 0) evolutionLevel++;
        break;
      }
    }
  }

  if (specialBeam) {
    specialBeam.update();
    specialBeam.show();
    for (let i = enemies.length - 1; i >= 0; i--) {
      if (specialBeam.hits(enemies[i])) {
        enemies.splice(i, 1);
        score++;
      }
    }
    if (specialBeam.finished()) {
      specialBeam = null;
    }
  }

  drawPlayer();
}

function drawStars() {
  fill(255);
  noStroke();
  for (let s of bgStars) {
    ellipse(s.x, s.y, s.size);
  }
}

function drawPlayer() {
  push();
  translate(width - 40, mouseY);
  fill(0, 200 + 20 * evolutionLevel, 255);
  beginShape();
  vertex(-20, -20);
  vertex(10, 0);
  vertex(-20, 20);
  vertex(-10, 0);
  endShape(CLOSE);
  fill(255);
  ellipse(-10, -10, 5);
  ellipse(-10, 10, 5);
  pop();
}

function mousePressed() {
  if (!gameStarted) {
    gameStarted = true;
    setInterval(spawnEnemy, 1000);
    return;
  }

  bullets.push(new Bullet(width - 40, mouseY));
  shotsFired++;
  if (shotsFired >= 10) {
    powerReady = true;
  }
}

function keyPressed() {
  if (key === ' ' && powerReady) {
    specialBeam = new SpecialBeam(width - 40, mouseY);
    powerReady = false;
    shotsFired = 0;
  }
}

function spawnEnemy() {
  enemies.push(new Enemy());
}

class Enemy {
  constructor() {
    this.x = 0;
    this.y = random(30, height - 30);
    this.r = 20;
    this.speed = 1.5 + random(1.5);
    this.color = color(random(200,255), random(50,100), random(50));
  }

  update() {
    this.x += this.speed;
  }

  show() {
    push();
    translate(this.x, this.y);
    fill(this.color);
    beginShape();
    vertex(-20, -10);
    vertex(0, -20);
    vertex(20, -10);
    vertex(0, 20);
    endShape(CLOSE);
    fill(0);
    ellipse(-5, -5, 5);
    ellipse(5, -5, 5);
    pop();
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 5;
    this.speed = 7 + evolutionLevel;
  }

  update() {
    this.x -= this.speed;
  }

  show() {
    fill(255, 255, 0);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }

  hits(enemy) {
    let d = dist(this.x, this.y, enemy.x, enemy.y);
    return d < this.r + enemy.r;
  }
}

class SpecialBeam {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.duration = 30;
    this.frames = 0;
  }

  update() {
    this.frames++;
  }

  show() {
    push();
    noStroke();
    fill(0, 255, 255, 180);
    rect(0, this.y - 20, this.x, 40);
    pop();
  }

  hits(enemy) {
    return enemy.y > this.y - 20 && enemy.y < this.y + 20;
  }

  finished() {
    return this.frames > this.duration;
  }
}
