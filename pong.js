$(document).ready(function(){
  const PADDLE_HEIGHT = 125;
  const PADDLE_THICKNESS = 15;
  const WINNING_SCORE = 2;
  var canvas = document.getElementById('gameCanvas');
  var canvasContext = canvas.getContext('2d');
  var ballX = canvas.width/2;
  var ballY = randomNumber(0, 600);
  var particleX = canvas.width/2;
  var particleY = canvas.height/2;
  var particleXSpeed = 5;
  var particleYSpeed = 4;
  var ballSpeedX = 5;
  var ballSpeedY = 4;
  var player1Score = 0;
  var player2Score = 0;

  var paddle1Y = 250;
  var paddle1X = 0;
  var paddle2Y = 250;
  var paddle2X = canvas.width - PADDLE_THICKNESS
  var winningScreen = false;
  init();

  canvas.addEventListener('mousedown', restartGame);

  function restartGame(event) {
    if(winningScreen) {
      player1Score = 0;
      player2Score = 0;
      winningScreen = false;
    };
  };

  function displayCanvas() {
    //this fills the background
    displayRect(0, 0, canvas.width, canvas.height, 'black');
    //this generates the ball
    displayCircle(ballX, ballY, 8, 'green');
    //this generates the left paddle
    displayRect(paddle1X, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'green');
    //this generates the right paddle
    displayRect(paddle2X, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'green');
    canvasContext.fillStyle = "white";
    canvasContext.fillText("player 1", 100, 100);
    canvasContext.fillText("player 2", canvas.width-150, 100);
    canvasContext.fillText(player1Score, 115, 130);
    canvasContext.fillText(player2Score, 665, 130);
  };

  function displayCircle(centerX, centerY, radius, color) {
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill()
  };

  function displayRect(leftX, topY, width, height, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(leftX, topY, width, height, color);
  };

  function computerMovement2() {
    var paddle2YCenter = paddle2Y +(PADDLE_HEIGHT/2);
    if(paddle2Y>600 - PADDLE_HEIGHT) {
      paddle2Y = 600 - PADDLE_HEIGHT;
    } else if(paddle2Y<0) {
      paddle2Y = 0;
    }
    setTimeout(function(){
      if(paddle2YCenter < ballY - 35 && ballX > canvas.width - 600) {
        paddle2Y += 10;
      } else if(paddle2YCenter > ballY + 35) {
        paddle2Y -= 10;
      }
    }, 100);
  };

  function computerMovement1() {
    var paddle1YCenter = paddle1Y +(PADDLE_HEIGHT/2);
    if(paddle1Y>600 - PADDLE_HEIGHT) {
      paddle1Y = 600 - PADDLE_HEIGHT;
    } else if(paddle1Y<0) {
      paddle1Y = 0;
    }
    setTimeout(function(){
      if(paddle1YCenter < ballY - 35) {
        paddle1Y += 10;
      } else if(paddle1YCenter > ballY + 35) {
        paddle1Y -= 10;
      };
    }, 100);
  };

  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function moveBall() {
    //computer right hand side
    computerMovement2();
    //computer left hand side
    // computerMovement1();

    ballX += ballSpeedX;
    ballY += ballSpeedY;
    particleY += particleYSpeed;
    particleX += particleXSpeed;
    if (ballX > canvas.width) {
      if(ballY > paddle2Y && ballY < (paddle2Y+PADDLE_HEIGHT)) {
              ballSpeedX = -ballSpeedX
              var sideSwipeSpeed = ballY - (paddle2Y+PADDLE_HEIGHT/2)
              ballSpeedY = sideSwipeSpeed * 0.33;
      } else {
              player1Score += 1;
              ballSpeedY = 4;
              ballSpeedX = 5;
              resetBall();
      };
    }
    if (ballX < 0) {
      if(ballY > paddle1Y && ballY < (paddle1Y+PADDLE_HEIGHT)) {
              ballSpeedX = -ballSpeedX
              var sideSwipeSpeed = ballY - (paddle1Y+PADDLE_HEIGHT/2)
              ballSpeedY = sideSwipeSpeed * 0.33;
      } else {
              player2Score += 1;
              ballSpeedY = 4;
              ballSpeedX = -5;
              resetBall();
      };

    }
    if (ballY > canvas.height) {
      ballSpeedY = -ballSpeedY;
    }
    if (ballY < 0) {
      ballSpeedY = -ballSpeedY;
    }
  }

  function calculateMousePosition(event){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    //these variables below allow for the browser to detect where the mouse
    //is in relation to the canvas and not the webpage
    var mouseX = event.clientX - rect.left - root.scrollLeft;
    var mouseY = event.clientY - rect.top - root.scrollTop;
    return {
      x:mouseX,
      y:mouseY
    };
  };

  function resetBall(){
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width/2;
    ballY = randomNumber(0, 600);
  };

  function checkWinner() {
    if(player1Score == WINNING_SCORE) {

      winningScreen = true;
    } else if (player2Score == WINNING_SCORE) {

      winningScreen = true;
    }
  }
  function init() {
    var fps = 60;
    canvas.addEventListener('mousemove',
      //event is the mousemove event being passed to calculateMousePosition
      function(event){
        var mousePos = calculateMousePosition(event);
        paddle1Y = mousePos.y - PADDLE_HEIGHT/2;
      });

    setInterval(function(){
      displayCanvas();
      if(winningScreen) {
        displayRect(0, 0, canvas.width, canvas.height, 'black');
        canvasContext.fillStyle = "white";
        if(player1Score == WINNING_SCORE) {
          canvasContext.fillText("Left Player wins", 350, 200);
        } else if(player2Score == WINNING_SCORE) {
          canvasContext.fillText("Right Player wins", 350, 200);
        }
        canvasContext.fillText("click to play again", 350, 400);
        return;
      }
      moveBall();
      checkWinner();
    }, 1000/fps);
  };    

});