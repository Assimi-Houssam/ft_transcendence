export function gamePhisique2(ctx, canvas, ws, time, custom, player) {
    var interval;
    var animationframe;
    var KEY_UP = "w";
    var KEY_DOWN = "s";
    let number1 = 0;
    let number2 = 0;
    let round_bool = false;
    var minutes;
    var seconds;
    var distance;
    var countDownDate = new Date().getTime() + Number(time) * 60000;
    // let player;
    let startGame = false;
    canvas.width = 1635;
    canvas.height = 585;
    const heightcanva = canvas.height - 100;
    const widthcanva = canvas.width - 100;
    const keypresss = []
    let gamefinsihed = false;


    ws.onmessage = async function (event) {
        try {
            const data = JSON.parse(event.data);

            if (!startGame) {
                if (data.start === "go") {
                    startGame = true;
                }
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    };


    function paddle(pos, velo, width, height, color) {
        this.pos = pos
        this.veo = velo
        this.width = width
        this.height = height
        this.update = function () {
            if (keypresss[KEY_UP]) {
                if (this.pos.y > 50) {
                    this.pos.y -= this.veo.y
                }
            }
            else if (keypresss[KEY_DOWN]) {
                if (this.pos.y < heightcanva - 50 - 30) {
                    this.pos.y += this.veo.y
                }
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
            ctx.closePath();
        }

    }

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
        ctx.strokeStyle = 'CA33FF';
        ctx.setLineDash([4, 19]);
        ctx.beginPath();
        ctx.moveTo(widthcanva / 2 + 30, 30 + 50);
        ctx.lineTo(widthcanva / 2 + 30, heightcanva - 10);
        ctx.stroke();
        ctx.setLineDash([]); // Reset to solid line;
        ctx.shadowBlur = 0;
        ctx.closePath();
    }

    function ball(pos, veo, radius) {
        this.pos = pos
        this.veo = veo
        this.redius = radius
        this.draw = function () {
            ctx.beginPath();
            ctx.fillStyle = 'rgba(255,255,255,1)';;
            ctx.arc(this.pos.x, this.pos.y, this.redius, 0, Math.PI * 2);;
            ctx.fill();
            ctx.closePath();
        }
    }


    const bal = new ball(vec(widthcanva / 2 + 30, heightcanva / 2 + 30), vec(6, 5,), 10)
    const paddle1 = new paddle(vec(60, 80), vec(8, 10), 10, 70, 'green')
    const paddle2 = new paddle(vec(60, 120), vec(8, 10), 10, 70, 'blue')
    const paddle3 = new paddle(vec(widthcanva - 10, 80), vec(8, 10), 10, 70, 'red')
    const paddle4 = new paddle(vec(widthcanva - 10, 120), vec(8, 10), 10, 70, 'yellow')

    const paddles = [paddle1, paddle2, paddle3, paddle4];
    const paddleNames = ['paddle1', 'paddle2', 'paddle3', 'paddle4'];


    function ballcoli(bal) {
        const p1 = document.getElementById('player2');
        const p2 = document.getElementById('player1');
        if (p1)
            p1.textContent = number1.toString();
        if (p2)
            p2.textContent = number2.toString();
    }

    var rounds = 1
    function gameupdate() {

        if (round_bool) {
            rounds += 1
            round_bool = false
            document.getElementById('rounds').textContent = 'rounds ' + rounds.toString()
        }
        ballcoli(bal)
        for (let i = 0; i < paddles.length; i++) {
            if (player == paddleNames[i]) {
                paddles[i].update()
            }
        }
    }

    function gamedraw() {
        drawtable();
        paddle1.draw();
        paddle2.draw();
        paddle3.draw();
        paddle4.draw();
        bal.draw();

    }

    function WebSocketHandlers() {
        ws.onmessage = async function (event) {
            try {
                const data = JSON.parse(event.data);
                await processMessage(data);
                // min = data.minute;
                // sec = data.second;
            } catch (error) {
                console.error('Error processing message:', error);
            }
        }
    }

    function gameloop() {
        animationframe = window.requestAnimationFrame(gameloop);
        WebSocketHandlers();
        ctx.beginPath();
        ctx.fillStyle = 'rgba(24,27,38,0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.closePath();
        gameupdate();
        gamedraw();
        const paddleKey = `paddle${player.slice(-1)}`;
        const paddlePos = eval(`${paddleKey}.pos.y`);
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({
                [paddleKey]: paddlePos,
                'sender': player,
            }));
        }
    }


    window.addEventListener('keydown', function (event) {
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
        const countdownInterval = setInterval(async () => {
            countdownElement.textContent = remaining;
            if (remaining <= 0) {
                ws.send(JSON.stringify({
                    'begin': "go",
                }));
                clearInterval(countdownInterval);
                canvas.style.filter = 'none';
                countdownElement.style.display = 'none';
                gameloop();
                interval = setInterval(function () {
                    //   broadcast time from this client to other clients
                    if (player === "paddle1") {
                        var now = new Date().getTime();
                        distance = countDownDate - now;
                        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        seconds = Math.floor((distance % (1000 * 60)) / 1000);
                        if (ws.readyState === 1) {
                            ws.send(JSON.stringify({
                                'distance': distance,
                                'minute': minutes,
                                'second': seconds,
                            }));
                        }
                    }
                    let timeSelector = document.querySelector(".time-display");
                    if (timeSelector) {
                        timeSelector.textContent = minutes + ":" + seconds;
                    }
                    else {
                        clearInterval(interval);
                        cancelAnimationFrame(animationframe);
                    }
                    if (distance < 0 || gamefinsihed) {
                        console.log('game finished');
                        let timeSelector = document.querySelector(".time-display");
                        timeSelector.textContent = "Time's up!";
                        canvas.style.filter = 'blur(10px)';
                        clearInterval(interval);
                        cancelAnimationFrame(animationframe);
                        setTimeout(() => {
                            ws.send(JSON.stringify({ 'finish': true }));
                        }, 100);
                        var winner = document.getElementById('winner');
                        if (number1 < number2) {
                            console.log('green wins!');
                            // winner.textContent = 'green wins!';
                            // winner.style.color = 'green';
                            // winner.classList.add('glow2')
                        }
                        else if (number1 > number2) {
                            console.log('red wins!');
                            // winner.textContent = 'red wins!';
                            // winner.style.color = 'red';
                            // winner.classList.add('glow1')
                        }
                        else {
                            console.log('Draw!');
                            // winner.textContent = 'Draw!';
                        }
                    }
                }, 100);
            }
            remaining--;
        }, 1000);
    }





    function before_evrything() {

        drawInitialCanvas();
        const cool = setInterval(() => {
            if (player == "paddle4") {

                ws.send(JSON.stringify({
                    'startgame': "True",
                }));
            }
            if (startGame) {
                clearInterval(cool)
                startCountdown(3);
            }
        }, 1000 / 60);
    }









    async function processMessage(data) {

        if (startGame) {
            for (let i = 0; i < paddles.length; i++) {
                if (player == paddleNames[i])
                    continue;
                if (data[paddleNames[i]])
                    paddles[i].pos.y = data[paddleNames[i]];
                if (data.minute)
                {
                    minutes = data.minute;
                    seconds = data.second;
                    distance = data.distance;
                }
            }
            if(data.positionx && data.positiony)
            {
                bal.pos.x = data.positionx;
                bal.pos.y = data.positiony;
            }
            if (data.score1 != number1 || data.score2 != number2) {
                round_bool = true;
                number1 = data.score1;
                number2 = data.score2;
            }
            if (data.finish) {
                gamefinsihed = true;
            }
        }

    }


    document.addEventListener('keydown', async function (event) {
        if (event.key === KEY_UP) {
            event.preventDefault();
            keypresss[KEY_UP] = true
        }

        if (event.key === KEY_DOWN) {
            event.preventDefault();
            keypresss[KEY_DOWN] = true
        }

    });

    document.addEventListener('keyup', async function (event) {
        if (event.key === KEY_DOWN) {
            event.preventDefault();
            keypresss[KEY_DOWN] = false
        }

        if (event.key === KEY_UP) {
            event.preventDefault();
            keypresss[KEY_UP] = false
        }
    });



    before_evrything()

    // evrything broke  work hard for it motherfucker
}