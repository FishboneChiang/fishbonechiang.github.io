class Ball {
  constructor() {
    this.radius = 8;
    this.v = 6;
    this.stick = false;
    this.x = paddle.x;
    this.y = paddle.y - paddle.height / 2 - this.radius;
    this.vx = 0;
    this.vy = 0;
    this.atk = 25;
    this.type = "normal";
  }
  show() {
    fill(255);
    ellipse(this.x, this.y, 2 * this.radius, 2 * this.radius);
  }
  move() {
    if (this.stick) {
      this.x = paddle.x;
      this.y = paddle.y - paddle.height / 2 - this.radius;
    } else {
      this.x += this.vx;
      this.y += this.vy;
    }
  }
  checkCollision() {
    // with wall
    if (this.x > width - this.radius) {
      this.x = width - this.radius;
      this.vx = -this.vx;
    }
    if (this.x < this.radius) {
      this.x = this.radius;
      this.vx = -this.vx;
    }
    if (this.y < this.radius) {
      this.y = this.radius;
      this.vy = -this.vy;
    }
    // with paddle
    if (!this.stick) {
      if (this.y + this.radius >= paddle.y - paddle.height / 2 && this.y + this.radius <= paddle.y + paddle.height / 2) {
        if (this.x > paddle.x - paddle.width / 2 - this.radius / 2 && this.x < paddle.x + paddle.width / 2 + this.radius / 2) {
          this.vy = -this.vy;
          this.vx += this.v * (this.x - paddle.x) / paddle.width * paddle.str;
          // let vv = sqrt(pow(this.vx, 2) + pow(this.vy, 2));
          // this.vx = this.v * this.vx / vv;
          // this.vy = this.v * this.vy / vv;
          if (this.vx > 2 * this.v) this.vx = 2 * this.v;
          if (this.vx < -2 * this.v) this.vx = -2 * this.v;
          this.y = -this.radius + paddle.y - paddle.height / 2;
          snd1.play()
        }
      }
    }
    // with bricks
    let [flag, flagX, flagY] = [false, true, true];
    for (let b of brick) {
      if (this.x > b.x - this.radius && this.x < b.x + b.width + this.radius && this.y > b.y - this.radius && this.y < b.y + b.height + this.radius) {
        // document.getElementById("dao").innerHTML += "捯";
        snd.play();
        snd.currentTime = 0;
        flag = true;
        b.hp -= this.atk;
      }
    }
    if (flag) {
      // bounce back in x-direction?
      this.x -= this.vx;
      this.y += this.vy;
      for (let b of brick) {
        if (this.x > b.x - this.radius && this.x < b.x + b.width + this.radius && this.y > b.y - this.radius && this.y < b.y + b.height + this.radius) {
          flagX = false;
        }
      }
      this.x += this.vx;
      this.y -= this.vy;
      // bounce back in y-direction?
      this.x += this.vx;
      this.y -= this.vy;
      for (let b of brick) {
        if (this.x > b.x - this.radius && this.x < b.x + b.width + this.radius && this.y > b.y - this.radius && this.y < b.y + b.height + this.radius) {
          flagY = false;
        }
      }
      this.x -= this.vx;
      this.y += this.vy;
      if (flagX) this.vx = -this.vx;
      if (flagY) this.vy = -this.vy;
    }
  }
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 20;
    this.hp = 100;
  }
  show() {
    fill(map(this.hp, 0, 100, 0, 255));
    if (this.type == 'multiBall') fill(0, map(this.hp, 0, 100, 0, 255), 0);
    rect(this.x, this.y, this.width, this.height, 5);
  }
}

function mousePressed() {
  for (let i = 0; i < ball.length; i++) {
    ball[i].stick = false;
  }
}

function showHP() {
  push();
  translate(width - 100, 0);
  text("HP: ", 0, 20);
  for (let i = 0; i < playerHP; i++) {
    ellipse(40 + 20 * i, 15, 10, 10);
  }
  pop();
}

function reset() {
  ball = [];
  brick = [];
  playerHP = playerMaxHP;
  paddle.x = mouseX;
  paddle.y = height - 20;
  for (let i = 0; i < 1; i++) newBall();
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 4; j++) {
      let k = 4 * i + j;
      brick[k] = new Brick(70 + i * 60, 50 + j * 45);
      if (random(1) < 0.1) brick[k].type = 'multiBall';
    }
  }
  document.getElementById("dao").innerHTML = "很好喔";
  loop();
}

function newBall(stick) {
  let n = ball.length;
  ball[n] = new Ball();
  ball[n].stick = true;
  ball[n].vx = random(-ball[n].v, ball[n].v);
  // ball[n].vy = random(-ball[n].v,0);
  ball[n].vy = -ball[n].v;
}

function checkGame() {
  if (ball.length == 0 && playerHP > 0) return 1; // lose 1 hp
  if (brick.length == 0) return 2; // win
  else return 3;
}