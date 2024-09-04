export function gamePhisique2(ctx, canvas, ws, time, custom, player) {
    var interval;
    var animationframe;
    var KEY_UP = "w";
    var KEY_DOWN = "s";
    let number1 = 0;
    let number2 = 0;
    var minutes;
    var seconds;
    var distance = 10;
    let startGame = false;
    canvas.width = 1635;
    canvas.height = 585;
    const heightcanva = canvas.height - 100;
    const widthcanva = canvas.width - 100;
    const keypresss = []
    let gamefinsihed = false;
    let pause = false;


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
    const paddle1 = new paddle(vec(60, 300), vec(8, 10), 10, 70, 'green')
    const paddle2 = new paddle(vec(60, 400), vec(8, 10), 10, 70, 'blue')
    const paddle3 = new paddle(vec(widthcanva - 10, 300), vec(8, 10), 10, 70, 'red')
    const paddle4 = new paddle(vec(widthcanva - 10, 400), vec(8, 10), 10, 70, 'yellow')

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

    function gameupdate() {

        ballcoli(bal)
        for (let i = 0; i < paddles.length; i++) {
            if (player == paddleNames[i]) {
                paddles[i].update()
            }
        }
        document.addEventListener('keydown', function (event) {
            if (event.key === "p") {
                if (ws.readyState === 1) {
                    ws.send(JSON.stringify({
                        'pause': true,
                    }));
                }
            }
        });
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
        if (pause === true) {
            canvas.style.filter = 'blur(10px)';
            countdownElement.textContent = "game paused for 10 seconds";
            countdownElement.style.display = 'block';
        }
        else if (pause === false) {
            canvas.style.filter = 'none';
            countdownElement.style.display = 'none';
        }
        const paddleKey = `paddle${player.slice(-1)}`;
        let paddlepos;
        console.log(paddleKey);
        switch (paddleKey) {
            case 'paddle1':
                paddlepos = paddle1.pos.y;
                break;
            case 'paddle2':
                paddlepos = paddle2.pos.y;
                break
            case 'paddle3':
                paddlepos = paddle3.pos.y;
                break
            case 'paddle4':
                 paddlepos = paddle4.pos.y;
                 break}
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({
                [paddleKey]: paddlepos,
                'sender': player,
                'pause': false,
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
                    let timeSelector = document.querySelector(".time-display");
                    if (timeSelector) {
                        timeSelector.textContent = minutes + ":" + seconds;
                    }
                    else {
                        clearInterval(interval);
                        cancelAnimationFrame(animationframe);
                    }
                    if (distance < 0 || gamefinsihed) {
                        console.log('game finished', distance, gamefinsihed);
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
            if (ws.readyState === 1)
                ws.send(JSON.stringify({
                    'startgame': "True",
                }));
            if (startGame) {
                clearInterval(cool)
                startCountdown(3);
            }
        }, 1000 / 60);
    }









    async function processMessage(data) {

        if (startGame) {
            for (let i = 0; i < paddles.length; i++) {
                if (data.minute)
                {
                    minutes = data.minute;
                    seconds = data.second;
                    distance = data.distance;
                }
                if (player == paddleNames[i])
                    continue;
                if (data[paddleNames[i]])
                    paddles[i].pos.y = data[paddleNames[i]];
            }
            if(data.positionx && data.positiony)
            {
                bal.pos.x = data.positionx;
                bal.pos.y = data.positiony;
            }
            if (data.score1 != number1 || data.score2 != number2) {
                number1 = data.score1;
                number2 = data.score2;
            }
            if (data.finish) {
                gamefinsihed = true;
            }
            pause = data.pause;
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