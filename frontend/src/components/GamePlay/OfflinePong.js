import { router } from "../../routes/routes.js"

export function game(ctx, canvas, gameData) {
    var number1 = 0
    var number2 = 0
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
    let ballcolor = 'rgba(255,255,255,1)';
    if (custom == "fastForward") {
        velocityx = 24;
        velocityy = 17;
        ballcolor = 'rgba(242,94,94,1)';
        paddveolicty = 13;
    }
    ;



    function paddle(pos, velo, width, height, color, button) {
        this.pos = pos
        this.veo = velo
        this.width = width
        this.height = height
        this.color = color
        this.button = button
        this.update = function () {
            if (keypresss[this.button.x] && this.pos.y > 40) {
                this.pos.y -= this.veo.y
            }
            if (keypresss[this.button.y] && this.pos.y + this.height < heightcanva + 10) {
                this.pos.y += this.veo.y
            }
        }
        this.draw = function () {
            ctx.beginPath();
            ctx.fillStyle = color
            ctx.shadowColor = color;
            ctx.shadowBlur = 10
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.roundRect(this.pos.x, this.pos.y, this.width, this.height, [15])
            ctx.fill()
            ctx.shadowBlur = 0
            ctx.closePath()
        }

        this.gethalfwidth = function () {
            return this.width / 2
        }
        this.gethalfheight = function () {
            return this.height / 2
        }
        this.getcenter = function () {
            return vec(this.pos.x + this.gethalfwidth(), this.pos.y + this.gethalfheight())
        }
    }




    const keypresss = []

    window.addEventListener('keydown', function (e) {
        keypresss[e.keyCode] = true;
    });


    window.addEventListener('keyup', function (e) {
        keypresss[e.keyCode] = false
    });

    function vec(x, y) {
        return { x: x, y: y };
    }


    function drawtable() {
        ctx.beginPath();
        ctx.strokeStyle = '#CA33FF';
        ctx.shadowColor = '#E985FF';
        ctx.shadowBlur = 10
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.lineWidth = 0.5;
        ctx.roundRect(30, 30, widthcanva, heightcanva, [20]);
        ctx.stroke();
        ctx.closePath();
        ctx.strokeStyle = 'CA33FF';
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
        this.pos = pos
        this.veo = veo
        this.redius = radius
        this.radius1 = radius + 10

        this.update = function () {

            this.pos.x += this.veo.x
            this.pos.y += this.veo.y
        }
        this.draw = function () {
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.redius, 0, Math.PI * 2);;
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        }
    }


    const bal = new ball(vec(widthcanva / 2 + 30, heightcanva / 2 + 30), vec(velocityx, velocityy), 10, ballcolor)
    const paddle1 = new paddle(vec(60, 80), vec(8, paddveolicty), 10, 50, 'blue', vec(87, 83))
    const paddle3 = new paddle(vec(60, 300), vec(8, paddveolicty), 10, 50, 'green', vec(82, 70))
    const paddle2 = new paddle(vec(widthcanva - 10, 80), vec(8, paddveolicty), 10, 50, 'red', vec(38, 40))
    const paddle4 = new paddle(vec(widthcanva - 10, 300), vec(8, paddveolicty), 10, 50, 'yellow', vec(75, 77))



    function ballPadllColision(ball, paddl) {
        let dx = Math.abs(ball.pos.x - paddl.getcenter().x)
        let dy = Math.abs(ball.pos.y - paddl.getcenter().y)
        if (ball.veo.x < 0) {
            if (dx <= (ball.radius1 + paddl.gethalfwidth()) && dy <= (ball.radius1 + paddl.gethalfheight())) {
                bal.veo.x *= -1
            }
        }
    }

    function ballPadllColision1(ball, paddl) {
        let dx = Math.abs(ball.pos.x - paddl.getcenter().x)
        let dy = Math.abs(ball.pos.y - paddl.getcenter().y)
        if (ball.veo.x > 0) {
            if (dx <= (ball.radius1 + paddl.gethalfwidth()) && dy <= (ball.radius1 + paddl.gethalfheight())) {
                bal.veo.x *= -1
            }
        }
    }


    function ballcoli(bal) {
        if (bal.pos.x + 20 > widthcanva + 40) {
            bal.pos.x = widthcanva / 2 + 30;
            bal.pos.y = heightcanva / 2 + 30;
            number1 += 1;
            let player1 = document.getElementById('player1')
            if(player1)
                player1.textContent = number1.toString();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.fillStyle = 'rgba(24,27,38,0.4)';
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.closePath();
            goal = true;
        }
        if (bal.pos.x - 20 <= 40) {
            bal.pos.x = widthcanva / 2 + 30;
            bal.pos.y = heightcanva / 2 + 30;
            number2 += 1;
            let player2 = document.getElementById('player2')
            if (player2) 
                player2.textContent = number2.toString();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.fillStyle = 'rgba(24,27,38,0.4)';
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.closePath();
            goal = true;
        }

        if (bal.pos.y + 15 > heightcanva + 30 || bal.pos.y - 15 <= 30) {
            bal.veo.y *= -1;
        }
    }

    function gameupdate() {
        if (goal == false)
            bal.update()
        paddle1.update()
        paddle2.update()
        if (teamsize == 2) {
            paddle3.update()
            paddle4.update()
        }
        ballcoli(bal)
        ballPadllColision(bal, paddle1)
        ballPadllColision1(bal, paddle2)
        if (teamsize == 2) {
            ballPadllColision(bal, paddle3)
            ballPadllColision1(bal, paddle4)
        }
    }

    function gamedraw() {
        drawtable();
        paddle1.draw();
        paddle2.draw();
        if (teamsize == 2) {
            paddle3.draw();
            paddle4.draw();
        }
        if (custom == "hidden" && (bal.pos.x > 300 && bal.pos.x < 1300)) {
            bal.draw();
        }
        else if (custom != "hidden") {
            bal.draw();
        }
    }

    var cancel;
    function gameloop() {
        cancel = window.requestAnimationFrame(gameloop)
        ctx.beginPath();
        ctx.fillStyle = 'rgba(24,27,38,0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.closePath();
        gameupdate()
        gamedraw()
        if (goal == true)
            setTimeout(() => { goal = false }, 500);

    }




    document.addEventListener('keydown', function (event) {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
        }
    });




    const countdownElement = document.getElementById('countdown');
    function drawInitialCanvas() {
        ctx.fillStyle = 'rgba(24,27,38,1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        drawtable();
    }

    function startCountdown(duration) {
        let remaining = duration;
        const countdownInterval = setInterval(() => {
            if(countdownElement)
                countdownElement.textContent = remaining;
            else
                clearInterval(countdownInterval);
            if (remaining <= 0) {
                clearInterval(countdownInterval);
                canvas.style.filter = 'none';
                countdownElement.style.display = 'none';
                startGame();
                var countDownDate = new Date().getTime() + 1 * 60000;
                var x = setInterval(function () {
                    var now = new Date().getTime();
                    var distance = countDownDate - now;
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    let timeDisplay = document.querySelector(".time-display");
                    if (timeDisplay)
                        timeDisplay.textContent = minutes + ":" + seconds;
                    else
                    {
                        clearInterval(x);
                        cancelAnimationFrame(cancel);
                    }
                    if (distance < 0) {
                        let timeDisplay = document.querySelector(".time-display")
                        if (number1 == number2) {
                            if (timeDisplay)
                                timeDisplay.textContent = "Overtime!";
                            if (bal.veo.x > 0)
                                bal.veo.x = 19;
                            else
                                bal.veo.x = -19;
                            if (bal.veo.y > 0)
                                bal.veo.y = 13;
                            else
                                bal.veo.y = -13;
                        }
                        else {
                            if (timeDisplay)
                                timeDisplay.textContent = "Time's up!";
                            clearInterval(x);
                            cancelAnimationFrame(cancel);
                            canvas.style.filter = 'blur(10px)';
                            var winner = document.getElementById('winner');
                            setTimeout(() => {
                                router.navigate('/next-tournament', new NextTournament(gameData, winner, loser));
                            }, 3000);
                            if (number1 > number2) {
                                countdownElement.style.display = 'block';
                                countdownElement.textContent = "Blue Team Wins!";
                                countdownElement.style.color = '#4496D4';
                            }
                            else if (number1 < number2) {
                                countdownElement.style.display = 'block';
                                countdownElement.textContent = "Red Team Wins!";
                                countdownElement.style.color = '#FF6666';
                            }

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
        // Game start logic here
        gameloop();
    }


}