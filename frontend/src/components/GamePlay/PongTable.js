// gamev1_phisique(ctx, canvas, ws, player . custome, time)
export function PongTable(ctx, canvas, ws, time, custom, player) {
    let animationframe;
    let interval;
    var KEY_UP = "w"
    var KEY_DOWN = "s"
    let number1 = 0
    let number2 = 0
    let pause = false;
    let startGame = false;
    const keypresss = []
    canvas.width = 1635;
    canvas.height = 585;
    const heightcanva = canvas.height - 100;
    const widthcanva = canvas.width - 100;
    var minutes;
    var seconds;
    var distance;
    let gamefinsihed = false;
    let disconneted = false;
    let PADDLE_VEO = 8;
    let COLOR = 'rgba(255,255,255,1)';
    if (custom == "fastForward") {
        PADDLE_VEO = 12;
        COLOR = 'rgba(242,94,94,1)';
    }
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
    ws.onclose = function (event) {
        const code = event.code;

        if(code === 4500)
        {
            disconneted = true
        }
    }

    function paddle(pos, velo, width, height, color) {
        this.pos = pos
        this.veo = velo
        this.width = width
        this.height = height
        this.update = function () {

            if (keypresss[KEY_UP]) {
                if (this.pos.y > 30) {
                    this.pos.y -= this.veo.y
                }
            }
            else if (keypresss[KEY_DOWN]) {
                if (this.pos.y < heightcanva - 30) {
                    this.pos.y += this.veo.y
                }
            }
        }
        this.draw = function () {
            ctx.fillStyle = color
            ctx.shadowColor = color;
            ctx.shadowBlur = 10
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.beginPath();
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
        ctx.shadowBlur = 6
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.lineWidth = 0.5;
        ctx.roundRect(30, 30, widthcanva, heightcanva, [20]);
        ctx.stroke();
        ctx.closePath();
        ctx.strokeStyle = 'CA33FF';
        ctx.setLineDash([7, 5]);
        ctx.beginPath();
        ctx.moveTo(widthcanva / 2 + 30, 30 + 40);
        ctx.lineTo(widthcanva / 2 + 30, heightcanva - 10);
        ctx.stroke();
        ctx.closePath();
        ctx.setLineDash([]); // Reset to solid line;
        ctx.shadowBlur = 0;
    }

    function ball(pos, veo, radius, COLOR) {
        this.pos = pos
        this.veo = veo
        this.redius = radius
        this.opcaity = 1
        this.draw = function () {
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.redius, 0, Math.PI * 2);;
            ctx.fillStyle = COLOR;
            ctx.fill();
            ctx.closePath();
        }
        // this.fade = function () {
        //     const minOpacity = 0;
        //     const maxOpacity = 1;
        //     if (this.x <=500)
        //       this.opcaity = (this.x/ 500) * (maxOpacity - minOpacity);
        //     else if (this.x >900)
        //       this.opcaity = ((this.x - 900) / 300) * (maxOpacity - minOpacity);

        //     ctx.beginPath();
        //     ctx.fillStyle = this.color;
        //     ctx.shadowBlur = 0;
        //     ctx.globalAlpha = this.opcaity;
        //     ctx.arc(this.x, this.y, 12, 0, Math.PI * 2);
        //     ctx.fill();
        //     ctx.closePath();
        //   }
    }


    const bal = new ball(vec(widthcanva / 2 + 30, heightcanva / 2 + 30), vec(7, 6), 10, COLOR)
    const paddle1 = new paddle(vec(60, 80), vec(4, PADDLE_VEO), 10, 45, 'blue')
    const paddle2 = new paddle(vec(widthcanva - 10, 80), vec(4, PADDLE_VEO), 10, 45, 'red')



    function ballcoli(bal) {
        let p1 = document.getElementById('player2');
        if (p1)
            p1.textContent = number1.toString();
        let p2 = document.getElementById('player1');
        if (p2)
            p2.textContent = number2.toString();
    }


    function gameupdate() {
        ballcoli(bal)
        if (player === "player1") {
            paddle1.update()
        }
        else if (player === "player2") {
            paddle2.update()
        }
        document.addEventListener('keydown', function (event) {
            if (event.key === "p") {
                if (ws.readyState === 1) {
                    ws.send(JSON.stringify({
                        'pause': "true",
                        'sender': player,
                    }));
                }
            }
        });
    }

    //hade 9lawi fine kane rssam 
    function gamedraw() {
        drawtable();
        paddle1.draw();
        paddle2.draw();
        if (custom != "hidden")
        {
            if(bal.pos.x > 49 && bal.pos.x < 1520)
                bal.draw();
        }
        else if (custom === "hidden" && bal.pos.x > 300 && bal.pos.x < 1300)
            bal.draw();
    }


    async function WebSocketHandlers() {
        ws.onmessage = async function (event) {
            try {
                const data = JSON.parse(event.data);
                await processMessage(data);
                pause = data.pause;
                if (data.finish == true) {
                    gamefinsihed = true;
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        }
    }

    let lastposx;
    let lastposy;
    async function gameloop() {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(24,27,38,0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.closePath();
        gameupdate()
        await WebSocketHandlers();
        if (bal.pos.x == lastposx && bal.pos.y == lastposy) {
            let targetx = bal.pos.x + bal.veo.x;
            let targety = bal.pos.y + bal.veo.y;
            bal.pos.x += (targetx - lastposx) * 0.3;
            bal.pos.y += (targety - lastposy) * 0.3;
        }

        gamedraw()
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
        let paddlePos ;
        if(player === "player1")
            paddlePos = paddle1.pos.y
        else
            paddlePos = paddle2.pos.y
        if (ws.readyState === 1 ) {
            ws.send(JSON.stringify({
                [paddleKey]: paddlePos,
                'sender': player,
            }));
        }
        lastposx = bal.pos.x;
        lastposy = bal.pos.y;
        animationframe = window.requestAnimationFrame(gameloop);
        if(gamefinsihed == true)
            cancelAnimationFrame(animationframe);
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
        const countdownInterval = setInterval(async () => {
            countdownElement.textContent = remaining;
            if (remaining <= 0) {
                if(ws.readyState === 1)
                {
                    ws.send(JSON.stringify({
                        'begin': "go",
                    }));
                }
                clearInterval(countdownInterval);
                canvas.style.filter = 'none';
                countdownElement.style.display = 'none';
                gameloop();
                console.log(gamefinsihed);
                interval = setInterval(function () {
                    if (pause === false) {
                        let timeSelector = document.querySelector(".time-display");
                        if (timeSelector) {
                            timeSelector.textContent = minutes + ":" + seconds;
                        }
                        else {
                            clearInterval(interval);
                            cancelAnimationFrame(animationframe);
                        }
                    }
                    if (distance < 0 || gamefinsihed || disconneted) {
                        console.log('game finished');
                        let timeSelector = document.querySelector(".time-display");
                        if(disconneted)
                            timeSelector.textContent = "opponent disconnected";
                        else
                            timeSelector.textContent = "Time's up!";
                        clearInterval(interval);
                        cancelAnimationFrame(animationframe);
                        canvas.style.filter = 'blur(10px)';
                        var winner = document.getElementById('winner');
                        setTimeout(() => {
                            ws.send(JSON.stringify({ "finish": "True" }));
                        }, 100);
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
    function beforeEvrything() {
        drawInitialCanvas();
        const cool = setInterval(() => {
            if (player == "player2") {
                if (ws.readyState === 1) {
                    ws.send(JSON.stringify({
                        'startgame': "True",
                    }));
                }
            }
            if (startGame) {
                clearInterval(cool)
                startCountdown(3);
            }
        }, 1000 / 60);
    }


    async function processMessage(data) {
        if (startGame) {
            if (player === "player1")
                paddle2.pos.y = data.paddle2
            if (player === "player2") {
                paddle1.pos.y = data.paddle1;
            }
            minutes = data.minute;
            seconds = data.second;
            distance = data.distance;
            bal.pos.x = data.positionx
            bal.pos.y = data.positiony
            bal.veo.x = data.velocityx
            bal.veo.y = data.velocityy
            if (data.score1 != number1 || data.score2 != number2) {
                number1 = data.score1
                number2 = data.score2
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
    beforeEvrything()
    // evrything broke  work hard for it motherfucker
}