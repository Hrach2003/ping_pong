const canvas = document.getElementById("pong");
const canvasText = canvas.getContext("2d");
//the user paddle

const is_mobile =
  !!navigator.userAgent.match(/iphone|android|blackberry/gi) || false;
// if (is_mobile) {
//   screen.orientation.lock("landscape");
// }

function openFullscreen() {
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  } else if (canvas.mozRequestFullScreen) {
    /* Firefox */
    canvas.mozRequestFullScreen();
  } else if (canvas.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    canvas.webkitRequestFullscreen();
  } else if (canvas.msRequestFullscreen) {
    /* IE/Edge */
    canvas.msRequestFullscreen();
  }
}
openFullscreen();

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
if (window.innerWidth < window.innerHeight) {
  canvas.height = (window.innerWidth * 2) / 3;
  canvas.width = window.innerWidth;
}
const Rect = {
  width: canvas.width / 75,
  height: canvas.height / 4,
  color: "white",
};
const user = {
  ...Rect,
  x: canvas.width / 200,
  y: canvas.height / 2 - canvas.height / 10,
  score: 0,
};
const com = {
  ...Rect,
  x: canvas.width - canvas.width / 50,
  y: canvas.height / 2 - canvas.height / 10,
  score: 0,
};
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: canvas.height / 75,
  speed: 5,
  velocityX:
    Math.floor(Math.random() * 7 + 01) * (Math.round(Math.random()) ? 1 : -1),
  velocityY: Math.floor(Math.random() * 7),
  color: "white",
};
const net = {
  x: canvas.width / 2 - canvas.width / 400,
  y: 0,
  width: canvas.width / 200,
  height: canvas.height / 25,
  color: "white",
};
//for drawing rectangle
function drawNet() {
  for (let i = 0; i <= canvas.height; i += canvas.height / 15) {
    drawRect(net.x, net.y + i, net.width, net.height, net.color);
  }
}

function drawRect(x, y, w, h, color) {
  canvasText.fillStyle = color;
  canvasText.fillRect(x, y, w, h);
}

//for drawing circle

function drawCircle(x, y, r, color) {
  canvasText.fillStyle = color;
  canvasText.beginPath();
  canvasText.arc(x, y, r, 0, Math.PI * 2, false);
  canvasText.fill();
}

//draw text
function drawText(text, x, y, color) {
  canvasText.fillStyle = color;
  canvasText.font = `${canvas.height / 10}px Arial`;
  canvasText.fillText(text, x, y);
}

function render() {
  //clear the canvas
  drawRect(0, 0, canvas.width, canvas.height, "BLACK");

  //draw net
  drawNet();

  //draw score
  drawText(user.score, canvas.width / 4, canvas.height / 6, "white");
  drawText(com.score, (3 * canvas.width) / 4, canvas.height / 6, "white");

  //draw the user and com paddle
  drawRect(user.x, user.y, user.width, user.height, user.color);
  drawRect(com.x, com.y, com.width, com.height, com.color);

  //draw the ball
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
}
//control the user paddle
canvas.addEventListener("mousemove", movePaddle);
if (is_mobile) {
  canvas.addEventListener("touchmove", movePaddle);
}
function movePaddle(evt) {
  let rect = canvas.getBoundingClientRect();

  user.y = evt.clientY - rect.top - user.height / 2;
}

//collision detection
function collision(b, p) {
  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  return (
    b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom
  );
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;

  ball.speed = 5;
  ball.velocityX =
    Math.floor(Math.random() * 7) * (Math.round(Math.random()) ? 1 : -1);
  ball.velocityY = Math.floor(Math.random() * 7);
}
//update : pos , mov , score
function update() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  //AI to control the com paddle
  let computerLevel = 0.04;
  com.y += (ball.y - (com.y + com.height / 2)) * computerLevel;
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }

  let player = ball.x < canvas.width / 2 ? user : com;
  if (collision(ball, player)) {
    let collidePoint = ball.y - (player.y + player.height / 2);
    collidePoint = collidePoint / (player.height / 2);
    let angleRad = (collidePoint * Math.PI) / 4;

    let direction = ball.x < canvas.width / 2 ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);

    ball.speed += 0.2;
  }
  if (ball.x - ball.radius < 0) {
    com.score++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    user.score++;
    resetBall();
  }
}

//game init
function game() {
  render();
  update();
}
//loop
const framePerSecond = 100; //same as FPS
setInterval(game, 1000 / framePerSecond);
