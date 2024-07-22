//Board Dimension
let board;
let boardheight = 500;
let boardwidth = 500;
let context;

//player Dimension
let playerWidth = 80;
let playerHeight = 10;
let playerVelocityx = 15;

let score = 0;
let gameOver = false;

//defining player
let player = {
  x: boardheight / 2 - playerWidth / 2,
  y: boardheight - playerHeight - 5,
  width: playerWidth,
  height: playerHeight,
  velocityx: playerVelocityx,
};

//ball dimensions

let ballWidth = 10;
let ballHeight = 10;
let ballvelocityx = 1;
let ballvelocityy = 3;

//defining the ball

let ball = {
  x: boardwidth / 2,
  y: boardheight / 2,
  width: ballWidth,
  height: ballHeight,
  velocityx: ballvelocityx,
  velocityy: ballvelocityy,
};

//blocks
let bockarray = [];
let blockWidth = 50;
let blockheight = 10;
let blockColumn = 8;
let blockRow = 3;
let blockMaxRows = 10;
let blockCount = 0;

//starting block corners top left
let blockx = 15;
let blocky = 45;

//main function

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardheight;
  board.width = boardwidth;
  context = board.getContext("2d");

  //darw the player
  context.fillStyle = "red";
  context.fillRect(player.x, player.y, player.width, player.height);

  requestAnimationFrame(update);
  document.addEventListener("keydown", movePlayer);

  createblocks();
};

//loop movement of the player

function update() {
  if (gameOver == true) {
    return;
  }
  requestAnimationFrame(update);

  context.clearRect(0, 0, boardwidth, boardheight); // clear the board
  // draw the player
  context.fillStyle = "red";
  context.fillRect(player.x, player.y, player.width, player.height);

  //   draw the ball
  context.fillStyle = "red";
  ball.x += ball.velocityx;
  ball.y += ball.velocityy;
  context.fillRect(ball.x, ball.y, ball.width, ball.height);

  //bounce ball off wall
  if (ball.y <= 0) {
    ball.velocityy *= -1;
  } else if (ball.x <= 0 || ball.x + ball.width >= boardwidth) {
    ball.velocityx *= -1;
  } else if (ball.y + ball.height >= boardheight) {
    context.font = "20px poppins";
    context.fillText("Game Over! press space to Restart", 80, 300);
    gameOver = true;
  }

  //bouncing the ball of player paddel
  if (topCollision(ball, player) || bottomCollision(ball, player)) {
    ball.velocityy *= -1;
  } else if (leftCollision(ball, player) || rightCollision(ball, player)) {
    ball.velocityx *= -1;
  }

  //blocks
  context.fillStyle = "red";
  for (let i = 0; i < bockarray.length; i++) {
    let block = bockarray[i];
    if (!block.break) {
      if (topCollision(ball, block) || bottomCollision(ball, block)) {
        block.break = true;
        ball.velocityy *= -1;
        blockCount -= 1;
        score += 1;
      } else if (leftCollision(ball, block) || rightCollision(ball, block)) {
        block.break = true;
        ball.velocityx *= -1;
        blockCount -= 1;
        score += 1;
      }
      context.fillRect(block.x, block.y, block.width, block.height);
    }
  }
  context.font = "20px poppins";
  context.fillText("Score: " + score, 10, 25);
}

//function to make the player inside the board
function outofBoard(xpos) {
  return xpos < 0 || xpos + playerWidth > boardwidth;
}

//for making the player move

function movePlayer(e) {
  if (gameOver) {
    if (e.code == "Space") {
      resetGame();
    }
  }
  if (e.code == "ArrowLeft") {
    // player.x-=player.velocityx;
    let nextplayerx = player.x - player.velocityx;
    if (!outofBoard(nextplayerx)) {
      player.x = nextplayerx;
    }
  } else if (e.code == "ArrowRight") {
    // player.x += player.velocityx;
    let nextplayerx = player.x + player.velocityx;
    if (!outofBoard(nextplayerx)) {
      player.x = nextplayerx;
    }
  }
}

function detectionCollision(a, b) {
  return (
    a.x < b.x + b.width && //a top left corner collision with top right corner
    a.x + a.width > b.x && // a top right corner collision with top left corner
    a.y < b.y + b.height && //a top left corner collision with top right corner
    a.y + a.height > b.y
  ); //a top right corner collision with top left corner
}

//colission detection side
function topCollision(ball, blocks) {
  return detectionCollision(ball, blocks) && ball.y + ball.height >= blocks.y;
}

function bottomCollision(ball, blocks) {
  return detectionCollision(ball, blocks) && blocks.y + blocks.height >= ball.y;
}

function leftCollision(ball, blocks) {
  return detectionCollision(ball, blocks) && ball.x + ball.width >= blocks.x;
}

function rightCollision(ball, blocks) {
  return detectionCollision(ball, blocks) && blocks.x + blocks.width >= ball.x;
}

function createblocks() {
  bockarray = [];
  for (let c = 0; c < blockColumn; c++) {
    for (let r = 0; r < blockRow; r++) {
      let block = {
        x: blockx + c * blockWidth + c * 10,
        y: blocky + r * blockheight + r * 10,
        width: blockWidth,
        height: blockheight,
        break: false,
      };
      bockarray.push(block);
    }
  }
  blockCount = bockarray.length;
}

function resetGame() {
  gameOver = false;
  player = {
    x: boardheight / 2 - playerWidth / 2,
    y: boardheight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight,
    velocityx: playerVelocityx,
  };

  ball = {
    x: boardwidth / 2,
    y: boardheight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityx: ballvelocityx,
    velocityy: ballvelocityy,
  };
  bockarray = [];
  score = 0;
  createblocks();
}
