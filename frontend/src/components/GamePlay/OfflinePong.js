import { router } from "../../routes/routes.js";
import { NextTournament } from "../GameComponents/GameOfflineRoom/tournament/NextTournament.js";

export function game(ctx, canvas, gameData, bracket) {
  var number1 = 0;
  var number2 = 0;
  const time = gameData.time;
  const custom = gameData.customization;
  canvas.width = 1635;
  canvas.height = 585;
  let heightcanva = canvas.height - 100;
  let widthcanva = canvas.width - 100;
  let velocityx = 14;
  let velocityy = 8;
  let goal = false;
  let teamsize = 1;
  let paddveolicty = 8;
  let ballcolor = "rgba(255,255,255,1)";
  if (custom == "fastForward") {
    velocityx = 24;
    velocityy = 17;
    ballcolor = "rgba(242,94,94,1)";
    paddveolicty = 13;
  }

  let particles = [];
  let explosionTriggered = false;

  class Particle {
    constructor(x, y, radius, dx, dy) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.dx = dx;
      this.dy = dy;
      this.alpha = 1;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = ballcolor;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    }
    update() {
      this.draw();
      this.alpha -= 0.01;
      this.x += this.dx;
      this.y += this.dy;
    }
  }

  function initializeParticles(x, y) {
    particles = []; 
    for (let i = 0; i <= 150; i++) {
      let dx = (Math.random() - 0.5) * (Math.random() * 6);
      let dy = (Math.random() - 0.5) * (Math.random() * 6);
      let radius = Math.random() * 3;
      let particle = new Particle(x, y, radius, dx, dy);
      particles.push(particle);
    }
  }

  function explode() {
    drawInitialCanvas();
    paddle1.draw();
    paddle2.draw();
    particles = particles.filter((particle) => {
      if (particle.alpha > 0) {
        particle.update();
        return true;
      }
      return false;
    });

    if (particles.length > 0) {
      requestAnimationFrame(explode);
    } else {
      explosionTriggered = false; 
    }
  }

  function triggerExplosion(x, y) {
    if (!explosionTriggered) {
      initializeParticles(x, y);
      explode();
      explosionTriggered = true;
    }
  }

  function paddle(pos, velo, width, height, color, button) {
    this.pos = pos;
    this.veo = velo;
    this.width = width;
    this.height = height;
    this.color = color;
    this.button = button;
    this.update = function () {
      if (keypresss[this.button.x] && this.pos.y > 40) {
        this.pos.y -= this.veo.y;
      }
      if (
        keypresss[this.button.y] &&
        this.pos.y + this.height < heightcanva + 10
      ) {
        this.pos.y += this.veo.y;
      }
    };
    this.draw = function () {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.roundRect(this.pos.x, this.pos.y, this.width, this.height, [15]);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.closePath();
    };

    this.gethalfwidth = function () {
      return this.width / 2;
    };
    this.gethalfheight = function () {
      return (this.height / 2) - 11;
    };
    this.getcenter = function () {
      return vec(
        this.pos.x + this.gethalfwidth(),
        this.pos.y + this.gethalfheight()
      );
    };
  }

  let pause = 0;
  const keypresss = [];

  document.addEventListener("keydown", function (e) {
    keypresss[e.keyCode] = true;
  });

  document.addEventListener("keyup", function (e) {
    keypresss[e.keyCode] = false;
  });

  document.addEventListener("keydown", function (e) {
    if (e.keyCode == 80 && pause == 0) pause = 1;
    else if (e.keyCode == 80 && pause == 2) pause = 0;
  });
  function vec(x, y) {
    return { x: x, y: y };
  }

  function drawtable() {
    ctx.beginPath();
    ctx.strokeStyle = "#CA33FF";
    ctx.shadowColor = "#E985FF";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.lineWidth = 0.5;
    ctx.roundRect(30, 30, widthcanva, heightcanva, [20]);
    ctx.stroke();
    ctx.closePath();
    ctx.strokeStyle = "CA33FF";
    ctx.setLineDash([4, 19]);
    ctx.beginPath();
    ctx.moveTo(widthcanva / 2 + 30, 30 + 50);
    ctx.lineTo(widthcanva / 2 + 30, heightcanva - 10);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;
    ctx.closePath();
  }
  function ball(pos, veo, radius, color) {
    this.pos = pos;
    this.veo = veo;
    this.redius = radius;
    this.radius1 = radius + 10;

    this.update = function () {
      this.pos.x += this.veo.x;
      this.pos.y += this.veo.y;
    };
    this.draw = function () {
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.redius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    };
  }

  const bal = new ball(
    vec(widthcanva / 2 + 30, heightcanva / 2 + 30),
    vec(velocityx, velocityy),
    10,
    ballcolor
  );
  const paddle1 = new paddle(
    vec(60, 80),
    vec(8, paddveolicty),
    10,
    50,
    "blue",
    vec(87, 83)
  );
  const paddle2 = new paddle(
    vec(widthcanva - 10, 80),
    vec(8, paddveolicty),
    10,
    50,
    "red",
    vec(38, 40)
  );

  function ballPadllColision(ball, paddl) {
    let dx = Math.abs(ball.pos.x - paddl.getcenter().x);
    let dy = Math.abs(ball.pos.y - paddl.getcenter().y);
    if (ball.veo.x < 0) {
      if (
        dx <= ball.radius1 + paddl.gethalfwidth() &&
        dy <= ball.radius1 + paddl.gethalfheight()
      ) {
        bal.veo.x *= -1;
      }
    }
  }

  function ballPadllColision1(ball, paddl) {
    let dx = Math.abs(ball.pos.x - paddl.getcenter().x);
    let dy = Math.abs(ball.pos.y - paddl.getcenter().y);
    if (ball.veo.x > 0) {
      if (
        dx <= ball.radius1 + paddl.gethalfwidth() &&
        dy <= ball.radius1 + paddl.gethalfheight()
      ) {
        bal.veo.x *= -1;
      }
    }
  }
  let elapsedTime;
  function pauseAprove() {
    if (pause == 1) {
      pause = 2;
      elapsedTime = new Date().getTime() + 5 * 1000;
    }
  }

  let couldown = 0;
  function ballcoli(bal) {
    if (bal.pos.x + 20 > widthcanva + 40) {
      let x = bal.pos.x;
      let y = bal.pos.y;
      bal.pos.x = widthcanva / 2 + 30;
      bal.pos.y = heightcanva / 2 + 30;
      number1 += 1;
      pauseAprove();
      let player1 = document.getElementById("player1");
      if (player1) player1.textContent = number1.toString();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.fillStyle = "rgba(24,27,38,0.4)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.closePath();
      goal = true;
      couldown = new Date().getTime() + 1000;
      triggerExplosion(x, y);
    }
    if (bal.pos.x - 20 <= 40) {
      let x = bal.pos.x;
      let y = bal.pos.y;
      bal.pos.x = widthcanva / 2 + 30;
      bal.pos.y = heightcanva / 2 + 30;
      number2 += 1;
      pauseAprove();
      let player2 = document.getElementById("player2");
      if (player2) player2.textContent = number2.toString();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.fillStyle = "rgba(24,27,38,0.4)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.closePath();
      goal = true;
      couldown = new Date().getTime() + 1000;
      triggerExplosion(x, y);
    }

    if (bal.pos.y + 15 > heightcanva + 30 || bal.pos.y - 15 <= 30) {
      bal.veo.y *= -1;
    }
  }

  function gameupdate() {
    if (goal == false) bal.update();
    paddle1.update();
    paddle2.update();
    ballcoli(bal);
    ballPadllColision(bal, paddle1);
    ballPadllColision1(bal, paddle2);
  }

  function gamedraw() {
    drawtable();
    paddle1.draw();
    paddle2.draw();
    if (custom == "hidden" && bal.pos.x > 300 && bal.pos.x < 1300) {
      bal.draw();
    } else if (custom != "hidden") {
      bal.draw();
    }
  }

  var cancel;
  function gameloop() {
    if (goal == true) {
      if (new Date().getTime() > couldown) goal = false;
    }
    ctx.beginPath();
    ctx.fillStyle = "rgba(24,27,38,0.4)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.closePath();
    if (pause == 2) {
      countdownElement.style.display = "block";
      countdownElement.textContent = "Game Paused!";
      canvas.style.filter = "blur(10px)";
    } else if (distance > 0) {
      countdownElement.style.display = "none";
      canvas.style.filter = "none";
      gameupdate();
    }
    gamedraw();
    cancel = window.requestAnimationFrame(gameloop);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
    }
  });

  const countdownElement = document.getElementById("countdown");
  function drawInitialCanvas() {
    ctx.fillStyle = "rgba(24,27,38,1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawtable();
  }

  let distance;
  let minutes = time;
  let seconds = 0;
  let timeDisplay;
  function startCountdown(duration) {
    let remaining = duration;
    const countdownInterval = setInterval(() => {
      if (countdownElement) countdownElement.textContent = remaining;
      else clearInterval(countdownInterval);
      if (remaining <= 0) {
        clearInterval(countdownInterval);
        canvas.style.filter = "none";
        countdownElement.style.display = "none";
        startGame();
        var countDownDate = new Date().getTime() + time * 60000;
        var x = setInterval(function () {
          if (pause == 2) {
            distance = new Date().getTime() + distance;
          } else {
            let now = new Date().getTime();
            distance = countDownDate - now;
            minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            seconds = Math.floor((distance % (1000 * 60)) / 1000);
          }
          timeDisplay = document.querySelector(".time-display");
          if (timeDisplay) timeDisplay.textContent = minutes + ":" + seconds;
          else {
            clearInterval(x);
            cancelAnimationFrame(cancel);
          }
          if (distance < 0) {
            let timeDisplay = document.querySelector(".time-display");
            if (number1 == number2) {
              if (timeDisplay) timeDisplay.textContent = "Overtime!";
              if (bal.veo.x > 0) bal.veo.x = 19;
              else bal.veo.x = -19;
              if (bal.veo.y > 0) bal.veo.y = 13;
              else bal.veo.y = -13;
            } else {
              if (timeDisplay) timeDisplay.textContent = "Time's up!";
              clearInterval(x);
              setTimeout(() => {
                cancelAnimationFrame(cancel);
              }, 2500);
              canvas.style.filter = "blur(10px)";
              var winner = document.getElementById("winner");
              if (number1 > number2) {
                countdownElement.style.display = "block";
                countdownElement.textContent = "Blue Team Wins!";
                countdownElement.style.color = "#4496D4";
                bracket.groups[bracket.status][0].status = 1;
                bracket.groups[bracket.status][1].status = 0;
              } else if (number1 < number2) {
                countdownElement.style.display = "block";
                countdownElement.textContent = "Red Team Wins!";
                countdownElement.style.color = "#FF6666";
                bracket.groups[bracket.status][0].status = 0;
                bracket.groups[bracket.status][1].status = 1;
              }
              if (gameData.bracketSize === 2) {
                var r = bracket.status == 0 ? 0 : 1;
                for (let i = 0; i < 2; i++) {
                  if (bracket.status == 2) break;
                  if (bracket.groups[bracket.status][i].status == 1) {
                    console.log(r);
                    bracket.groups[2][r].username =
                      bracket.groups[bracket.status][i].username;
                    break;
                  }
                }
                console.log("bracket : ", bracket);
                bracket.status += 1;
                console.log("bracketlvl : ", bracket.status);
              }
              setTimeout(() => {
                router.navigate(
                  "/next-tournament",
                  new NextTournament(gameData, bracket)
                );
              }, 2500);
            }
          }
        }, 1000);
      }
      remaining--;
    }, 1000);
  }

  drawInitialCanvas();
  startCountdown(3);
  function startGame() {
    gameloop();
  }
}
