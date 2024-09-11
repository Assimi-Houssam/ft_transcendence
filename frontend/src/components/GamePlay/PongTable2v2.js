import { router } from "../../routes/routes.js"

export function PongTable2v2(ctx, canvas, ws, time, custom, player) {
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
    let disconneted = false;
    let PADDLE_VEO = 7;
    let COLOR = 'rgba(255,255,255,1)';
    if (custom == "fastForward") {
        PADDLE_VEO = 12;
        COLOR = 'rgba(242,94,94,1)';
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
            ctx.fillStyle = COLOR;
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

    /* Function to initialize particles */
    function initializeParticles(x, y) {
        particles = []; // Reset particles array
        for (let i = 0; i <= 150; i++) {
            let dx = (Math.random() - 0.5) * (Math.random() * 6);
            let dy = (Math.random() - 0.5) * (Math.random() * 6);
            let radius = Math.random() * 3;
            let particle = new Particle(x, y, radius, dx, dy);
            particles.push(particle);
        }
    }

    /* Particle explosion function */
    function explode() {
        particles = particles.filter(particle => {
            if (particle.alpha > 0) {
                particle.update();
                return true;
            }
            return false;
        });

        if (particles.length > 0) {
            requestAnimationFrame(explode);
        } else {
            explosionTriggered = false; // Reset the trigger flag
        }
    }

    /* Function to trigger explosion effect */
    function triggerExplosion(x, y) {
        if (!explosionTriggered) {
            initializeParticles(x, y);
            explode();
            explosionTriggered = true;
        }
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

        if (code === 4500) {
            disconneted = true
        }
    }


    function paddle(pos, velo, width, height, color) {
        this.pos = pos
        this.veo = velo
        this.width = width
        this.height = height
        this.update = function (player) {
            if (keypresss[KEY_UP]) {
                if (this.pos.y > 50) {
                    if(player == 'paddle2' && this.pos.y > paddle1.pos.y +70 )
                        this.pos.y -= this.veo.y
                    else if(player == 'paddle4' && this.pos.y > paddle3.pos.y +70 )
                        this.pos.y -= this.veo.y
                    else if(player == 'paddle1' || player == 'paddle3')
                        this.pos.y -= this.veo.y

                }
            }
            else if (keypresss[KEY_DOWN]) {
                if (this.pos.y < heightcanva - 50 - 30) {
                    if(player == 'paddle1' && this.pos.y + 70 < paddle2.pos.y )
                        this.pos.y += this.veo.y
                    else if(player == 'paddle3' && this.pos.y + 70 < paddle4.pos.y )
                        this.pos.y += this.veo.y
                    else if(player == 'paddle2' || player == 'paddle4')
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
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;
        ctx.closePath();
    }

    function ball(pos, veo, radius, COLOR) {
        this.pos = pos
        this.veo = veo
        this.redius = radius
        this.draw = function () {
            ctx.beginPath();
            ctx.fillStyle = COLOR;;
            ctx.arc(this.pos.x, this.pos.y, this.redius, 0, Math.PI * 2);;
            ctx.fill();
            ctx.closePath();
        }
    }


    const bal = new ball(vec(widthcanva / 2 + 30, heightcanva / 2 + 30), vec(6, 5,), 10, COLOR)
    const paddle1 = new paddle(vec(60, 200), vec(8, PADDLE_VEO), 10, 70, 'green')
    const paddle2 = new paddle(vec(60, 400), vec(8, PADDLE_VEO), 10, 70, 'blue')
    const paddle3 = new paddle(vec(widthcanva - 10, 200), vec(8, PADDLE_VEO), 10, 70, 'red')
    const paddle4 = new paddle(vec(widthcanva - 10, 400), vec(8, PADDLE_VEO), 10, 70, 'yellow')

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
                paddles[i].update(player)
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
    

    // hna fine khassak tfade 9lawi 
    function gamedraw() {
        drawtable();
        paddle1.draw();
        paddle2.draw();
        paddle3.draw();
        paddle4.draw();
        if (custom != "hidden") {
            if (bal.pos.x > 49 && bal.pos.x < 1520)
                bal.draw();
        }
        else if (custom === "hidden" && bal.pos.x > 300 && bal.pos.x < 1300)
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
        if(trigerbool)
        {
            triggerExplosion(trigerx, trigery)
            trigerbool = false
        }
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
                break
        }
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
                    if (distance < 0 || gamefinsihed || disconneted) {
                        let timeSelector = document.querySelector(".time-display");
                        if (disconneted) {
                            canvas.style.filter = 'blur(10px)';
                            countdownElement.textContent = "Opponent disconnected";
                            countdownElement.style.display = 'block';
                            setTimeout(() => {
                                router.navigate("/home");
                            }, 3000);
                        }
                        else {
                            timeSelector.textContent = "Time's up!";
                        }
                        canvas.style.filter = 'blur(10px)';
                        clearInterval(interval);
                        cancelAnimationFrame(animationframe);
                        setTimeout(() => {
                            ws.send(JSON.stringify({ 'finish': true }));
                        }, 100);
                        if (!disconneted) {
                            if (number1 < number2) {
                                countdownElement.textContent = "Blue Team Wins!";
                                countdownElement.style.color = '#4496D4';
                            }
                            else if (number1 > number2) {
                                countdownElement.textContent = "Red Team Wins!";
                                countdownElement.style.color = '#FF6666';
                            }
                            else {
                                countdownElement.textContent = "Draw!";
                            }
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

    let trigerx
    let trigery
    let trigerbool

    async function processMessage(data) {

        if (startGame) {
            for (let i = 0; i < paddles.length; i++) {
                if (data.minute || data.second) {
                    minutes = data.minute;
                    seconds = data.second;
                    distance = data.distance;
                }
                if (player == paddleNames[i])
                    continue;
                if (data[paddleNames[i]])
                    paddles[i].pos.y = data[paddleNames[i]];
            }
            if (data.score1 != number1 || data.score2 != number2) {
                number1 = data.score1;
                number2 = data.score2;
                trigerx = bal.pos.x
                trigery = bal.pos.y
                trigerbool = true
            }
            if (data.positionx && data.positiony) {
                bal.pos.x = data.positionx;
                bal.pos.y = data.positiony;
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

}