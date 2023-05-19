let ball = [];
let paddle = {
  width: 100,
  height: 10,
  x: undefined,
  y: undefined,
  str: 2.5,
  show: function() {
    fill(255);
    rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
  }
};
let brick = [];
let playerHP, playerMaxHP = 3;
let snd = document.getElementById('snd');
let snd1 = document.getElementById('snd1');
let tunak = document.getElementById('tunak');

function setup() {
  let cvs = createCanvas(600, 600, P2D);
  cvs.parent("game");
  background(0);
  // initialize
  reset();
}

function draw() {
  background(0);
  fill(255);
  textSize(15);
  text("fps = " + nf(frameRate(), 0, 0), 10, 20);
  // text(mouseX+","+mouseY,mouseX,mouseY);

  // Check game status
  switch (checkGame()) {
    case 1:
      playerHP--;
      showHP();
      if (playerHP > 0) {
        newBall();
      } else {
        document.getElementById("dao").innerHTML += " Game over!";
        noLoop();
      }
      break;
    case 2:
      document.getElementById("dao").innerHTML += " You win!";
      showHP();
      tunak.play();
      textSize(100);
      textAlign(CENTER, CENTER);
      fill(255,255,0);
      text("YOU WIN!", width/2, height/2);
      noLoop();
      break;
    case 3:
      showHP();
  }

  // Update balls & bricks
  for (let i = ball.length - 1; i >= 0; i--) {
    ball[i].show();
    ball[i].move();
    ball[i].checkCollision();
    if (ball[i].y > height) {
      ball.splice(i, 1);
    }
  }
  for (let i = 0; i < brick.length; i++) {
    brick[i].show();
    if (brick[i].hp <= 0) {
      // drop special ability
      if (brick[i].type == "multiBall") {
        // document.getElementById("dao").innerHTML += " Wow!";
        newBall();
        newBall();
        let nb = ball[ball.length-1];
        nb.stick = false;
        let nb2 = ball[ball.length-2];
        nb2.stick = false;
        nb.x = brick[i].x+brick[i].width/2;
        nb.y = brick[i].y+brick[i].height/2;
        nb2.x = brick[i].x+brick[i].width/2;
        nb2.y = brick[i].y+brick[i].height/2;
      }
      // remove brick
      brick.splice(i, 1);
    }
  }

  // Update paddle
  if (mouseX < paddle.width / 2) paddle.x = paddle.width / 2;
  else if (mouseX > width - paddle.width / 2) paddle.x = width - paddle.width / 2;
  else paddle.x = mouseX;
  paddle.show();
}