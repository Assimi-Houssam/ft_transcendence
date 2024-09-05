export function HockeyTable(ctx, canvas, ws, time, player_p) {
  canvas.width = 1100;
  canvas.height = 550;
  const START_X = 30;
  const START_Y = 30;
  const END_X = canvas.width - 50;
  const END_Y = canvas.height - 50;
  const HALF_X = (END_X - START_X) / 2;
  const HALF_Y = (END_Y - START_Y) / 2;
  let veolicity = 7;
  var countDownDate = new Date().getTime() + Number(time) * 60000;
  let gamefinsihed = false;
  let number1 = 0;
  let number2 = 0;
  let animationframe;
  let pauseApprove = false;
  const countdownElement = document.getElementById('countdown');

  const keypress = [];
  let goal = false;

  window.addEventListener("keydown", function (e) {
    keypress[e.keyCode] = true;
  });

  window.addEventListener("keyup", function (e) {
    keypress[e.keyCode] = false;
  });

  function drawTable() {
    ctx.beginPath();
    ctx.shadowColor = "#E985FF";
    ctx.strokeStyle = "purple";
    ctx.shadowBlur = 10;
    ctx.lineWidth = 2;
    ctx.roundRect(START_X, START_Y, END_X, END_Y, [20]);
    ctx.stroke();
    ctx.closePath();
    ctx.strokeStyle = "purple";
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 8]);
    ctx.beginPath();
    ctx.moveTo(HALF_X + 50, START_Y + 30);
    ctx.lineTo(HALF_X + 50, END_Y);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(HALF_X + 50, HALF_Y + 50, 100, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(START_X, HALF_Y + 50, 100, Math.PI / 2, Math.PI * 1.5, true);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(END_X + 30, HALF_Y + 50, 100, Math.PI / 2, Math.PI * 1.5, false);
    ctx.stroke();
    ctx.closePath();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.fillStyle = "#181B26";
    ctx.fillRect(START_X - 15, HALF_Y + 50 - 96, START_X + 5, HALF_Y + 50 - 96);
    ctx.fillRect(END_X + 15, HALF_Y + 50 - 96, END_X, HALF_Y + 50 - 96);
    ctx.closePath();
  }

  function player(x, y, color, up, down, left, right) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.veolicity_y;
    this.veolicity_x;
    this.draw = function () {
      ctx.strokeStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 17, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
      ctx.shadowColor = "transparent";
    };
    this.move = function () {
      if (keypress[up] && this.y > 50) {
        this.y -= veolicity;
      } else if (keypress[down] && this.y < canvas.height - 40) {
        this.y += veolicity;
      }
      if (keypress[left] && this.x > 50) {
        this.x -= veolicity;
      } else if (keypress[right] && this.x < canvas.width - 40) {
        this.x += veolicity;
      }

      if (player_p == "player2") {
        if (this.x + 17 > HALF_X + 50) {
          this.x = HALF_X + 50 - 17;
        }
      } else {
        if (this.x - 17 < HALF_X + 50) {
          this.x = HALF_X + 50 + 17;
        }
      }
    };
  }

  function ball(x, y, color) {
    this.x = x;
    this.y = y;
    this.veolicity_x = -3;
    this.veolicity_y = 0;
    this.color = color;

    this.draw = function () {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 0;
      ctx.arc(this.x, this.y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    };
    this.collisions = function () {
      for (let i = 0; i < 2; i++) {
        let playeri = i === 0 ? player1 : player2;
        let distanceY = this.y - playeri.y;
        let distanceX = this.x - playeri.x;
        let distance = Math.sqrt(
          Math.pow(distanceX, 2) + Math.pow(distanceY, 2)
        );

        if (distance <= 32) {
          var angle = Math.atan2(distanceY, distanceX);
          let sin = Math.sin(angle);
          let cos = Math.cos(angle);

          const forceMagnitude = 7;
          const forceX = forceMagnitude * Math.cos(angle);
          const forceY = forceMagnitude * Math.sin(angle);
          this.veolicity_x += forceX;
          this.veolicity_y += forceY;
        }
      }
      this.x += this.veolicity_x;
      this.y += this.veolicity_y;

      Math.sign(this.veolicity_x) === 1
        ? (this.veolicity_x -= 0.01)
        : (this.veolicity_x += 0.01);
      Math.sign(this.veolicity_y) === 1
        ? (this.veolicity_y -= 0.01)
        : (this.veolicity_y += 0.01);

      if (this.x <= 42) {
        if (this.y > HALF_Y + 50 - 96 && this.y < HALF_Y + 50 + 96) {
          this.x = HALF_X;
          this.y = HALF_Y + 50;
          this.veolicity_x = -1;
          this.veolicity_y = 0;
          number1++;
          goal = true;
        } else {
          if (this.x < 37) this.x = 47;
          this.veolicity_x *= -1;
        }
      }

      if (this.x >= END_X + 12) {
        if (this.y > HALF_Y + 50 - 96 && this.y < HALF_Y + 50 + 96) {
          this.x = HALF_X + 90;
          this.y = HALF_Y + 50;
          this.veolicity_x = 1;
          this.veolicity_y = 0;
          number2++;
          goal = true;
        } else {
          if (this.x > END_X + 17) this.x = END_X - 17;
          this.veolicity_x *= -1;
        }
      }
      if (this.y <= 42 || this.y >= END_Y + 12) {
        if (this.y < 40) this.y = 47;
        else if (this.y > END_Y + 17) this.y = END_Y - 17;
        this.veolicity_y *= -1;
      }
    };
  }

  const player2 = new player(100, 100, "blue", 87, 83, 65, 68);
  const player1 = new player(300, 100, "red", 87, 83, 65, 68);
  const hockeyBall = new ball(HALF_X + 50, HALF_Y + 50, "white");

  function sendMessage(data) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }
  function scoring() {
    const p1 = document.getElementById("player2");
    const p2 = document.getElementById("player1");
    if(number1 || number2)
    {
      if (p1) p1.textContent = number1.toString();
      if (p2) p2.textContent = number2.toString();
    }
  }
  function game() {
    if (player_p === "player1") {
      ws.onmessage = function (event) {
        const data = JSON.parse(event.data);
        if (data.player2_x) {
          player2.x = data.player2_x;
          player2.y = data.player2_y;
        }
        if (data.finish) gamefinsihed = data.finish;
        if(data.pause_rq == true) pauseApprove = true;
      };
    }
    goal = false;
    ctx.beginPath();
    ctx.fillStyle = "#181B26";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.closePath();
    drawTable();
    if(pauseApprove != true)
    {
      player1.move();
      hockeyBall.collisions();
      hockeyBall.draw();
    }
    player2.draw();
    player1.draw();
    scoring();
    if (player_p === "player1") {
      // console.log("send");
      sendMessage({
        player1_x: player1.x,
        player1_y: player1.y,
        ball_x: hockeyBall.x,
        ball_y: hockeyBall.y,
        score1: number1,
        score2: number2,
        goal: goal,
        pauseApprove: pauseApprove,
        pos : keypress[80],
      });
    }
    animationframe = requestAnimationFrame(game);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key == "p") {
      if (ws.readyState == 1) {
        keypress[80] = true;
      }
    }

  });

  function guest() {
    if (player_p === "player2") {
      ws.onmessage = function (event) {
        const data = JSON.parse(event.data);
        player1.x = data.player1_x;
        player1.y = data.player1_y;
        hockeyBall.x = data.ball_x;
        hockeyBall.y = data.ball_y;
        number1 = data.score1;
        number2 = data.score2;
        if (data.finish) gamefinsihed = data.finish;
      };
    }
    ctx.beginPath();
    ctx.fillStyle = "#181B26";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.closePath();
    drawTable();
    player2.move();
    player1.draw();
    player2.draw();
    hockeyBall.draw();
    scoring();
    if (player_p === "player2") {
      sendMessage({
        player2_x: player2.x,
        player2_y: player2.y,
        user: player_p,
        pos : keypress[80],
      });
    }
    animationframe = requestAnimationFrame(guest);
  }

  function delayedfunction() {
    if (player_p === "player1") {
      game();
    } else if (player_p === "player2") {
      guest();
    }
  }

  function gamestart() {
    let distance
    let minutes 
    let seconds 
    var now
    canvas.style.filter = "none";
    delayedfunction();
    let interval = setInterval(function () {
      //   broadcast time from this client to other clients
      if (pauseApprove == true) {
        distance = new Date().getTime() + distance;
        canvas.style.filter = "blur(10px)";
        countdownElement.textContent = "game paused for 10 seconds";
        countdownElement.style.display = 'block';
      }
      else {
        canvas.style.filter = "none";
        countdownElement.style.display = 'none';
        now = new Date().getTime();
        distance = countDownDate - now;
        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((distance % (1000 * 60)) / 1000);
      }
      let timeSelector = document.querySelector(".time-display");
      if (timeSelector) {
        timeSelector.textContent = minutes + ":" + seconds;
      } else clearInterval(interval);
      if (distance < 0 || gamefinsihed) {
        let timeSelector = document.querySelector(".time-display");
        timeSelector.textContent = "Time's up!";
        canvas.style.filter = "blur(10px)";
        clearInterval(interval);
        cancelAnimationFrame(animationframe);
        var winner = document.getElementById("winner");
        if (number1 < number2) {
          console.log("green wins!");
          // winner.textContent = 'green wins!';
          // winner.style.color = 'green';
          // winner.classList.add('glow2')
        } else if (number1 > number2) {
          console.log("red wins!");
          // winner.textContent = 'red wins!';
          // winner.style.color = 'red';
          // winner.classList.add('glow1')
        } else {
          console.log("Draw!");
          // winner.textContent = 'Draw!';
        }
      }
    }, 100);
  }
  drawTable();
  canvas.style.filter = "blur(10px)";
  setTimeout(gamestart, 1000);
}
