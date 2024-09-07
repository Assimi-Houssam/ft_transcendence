import { router } from "../../routes/routes";

export function hockeygame(ctx, canvas, gameData) {

    canvas.width = 1100;
    canvas.height = 550;
    const time =  gameData.time;
    const custom = gameData.customization;
    const START_X = 30
    const START_Y = 30
    const END_X = canvas.width - 50
    const END_Y = canvas.height - 50
    const HALF_X = (END_X - START_X) / 2
    const HALF_Y = (END_Y - START_Y) / 2
    let number1 = 0;
    let number2 = 0;
    let veolicity = 7;
    let ballcolor = 'rgba(255,255,255,1)';
    let forceMagnitude = 4;

    const keypress = [];
    if(custom == "fastForword"){
        veolicity = 9
        ballcolor = 'rgba(242,94,94,1)';
        forceMagnitude = 6;
    }


    window.addEventListener('keydown', function (e) {
        keypress[e.keyCode] = true;
    });
    window.addEventListener('keyup', function (e) {
        keypress[e.keyCode] = false
    });
    function drawTable() {
        ctx.beginPath();
        ctx.shadowColor = '#E985FF';
        ctx.strokeStyle = 'purple';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 0.5;
        ctx.roundRect(START_X, START_Y, END_X, END_Y, [20]);
        ctx.stroke();
        ctx.closePath();
        ctx.strokeStyle = 'purple';
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
        ctx.fillStyle = '#181B26';
        ctx.fillRect(START_X - 15, HALF_Y + 50 - 96, START_X + 5, HALF_Y + 50 - 96)
        ctx.fillRect(END_X + 15, HALF_Y + 50 - 96, END_X, HALF_Y + 50 - 96)
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
            ctx.shadowColor = 'transparent';
        }
        this.move = function () {
            if (keypress[up] && this.y > 50) {
                this.y -= veolicity;
            }
            else if (keypress[down] && this.y < canvas.height - 40) {
                this.y += veolicity;
            }
            if (keypress[left] && this.x > 50) {
                this.x -= veolicity;
            }
            else if (keypress[right] && this.x < canvas.width - 40) {
                this.x += veolicity;
            }

            if (up == 87) {
                if (this.x + 17 > HALF_X + 50) {
                    this.x = HALF_X + 50 - 17
                }
            }
            else {
                if (this.x - 17 < HALF_X + 50) {
                    this.x = HALF_X + 50 + 17
                }
            }

        }
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
        }
        this.collisions = function () {

            for (let i = 0; i < 2; i++) {
                let playeri = i === 0 ? player1 : player2;
                let distanceY = this.y - playeri.y;
                let distanceX = this.x - playeri.x;
                let distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

                if (distance <= 32) {
                    var angle = Math.atan2(distanceY, distanceX);
                    const forceX = forceMagnitude * Math.cos(angle);
                    const forceY = forceMagnitude * Math.sin(angle);
                    this.veolicity_x += forceX;
                    this.veolicity_y += forceY;
                }
            }
            this.x += this.veolicity_x;
            this.y += this.veolicity_y;


            Math.sign(this.veolicity_x) === 1 ? this.veolicity_x -= 0.01 : this.veolicity_x += 0.01;
            Math.sign(this.veolicity_y) === 1 ? this.veolicity_y -= 0.01 : this.veolicity_y += 0.01;

            if ((this.x <= 42)) {
                if (this.y > HALF_Y + 50 - 96 && this.y < HALF_Y + 50 + 96) {
                    this.x = HALF_X + 40;
                    this.y = HALF_Y + 50;
                    this.veolicity_x = -1;
                    this.veolicity_y = 0;
                    number1++;
                }
                else {
                    if (this.x < 37)
                        this.x = 47
                    this.veolicity_x *= -1;
                }
            }

            if ((this.x >= END_X + 12)) {
                if (this.y > HALF_Y + 50 - 96 && this.y < HALF_Y + 50 + 96) {
                    this.x = HALF_X + 60;
                    this.y = HALF_Y + 50;
                    this.veolicity_x = 1;
                    this.veolicity_y = 0;
                    number2++;
                }
                else {
                    if (this.x > END_X + 17)
                        this.x = END_X - 17
                    this.veolicity_x *= -1;
                }
            }
            if ((this.y <= 42 || this.y >= END_Y + 12)) {
                if (this.y < 40)
                    this.y = 47;
                else if (this.y > END_Y + 17)
                    this.y = END_Y - 17;
                this.veolicity_y *= -1;
            }


        }

    }


    const player1 = new player(100, 100, 'blue', 87, 83, 65, 68);
    const player2 = new player(300, 100, 'red', 38, 40, 37, 39);
    const hockeyBall = new ball(500, END_Y / 2, 'white');



    function scoring() {
        const p1 = document.getElementById("player2");
        const p2 = document.getElementById("player1");
        if (number1 || number2) {
            if (p1) p1.textContent = number1.toString();
            if (p2) p2.textContent = number2.toString();
        }
    }
    let animationframe
    function game() {
        animationframe = requestAnimationFrame(game);
        ctx.fillStyle = '#181B26';
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        drawTable();
        player1.move();
        player2.move();
        player2.draw();
        player1.draw();
        hockeyBall.collisions();
        if (custom == "hidden" && (bal.pos.x > 300 && bal.pos.x < 900)) {
            hockeyBall.draw();
        }
        else if(custom != "hidden")
            hockeyBall.draw();
        scoring();
    }


    let distance = 1;
    let minutes;
    let seconds;
    let now;
    const countdownElement = document.getElementById("countdown");
    

    function gamestart() {
        drawTable();
        canvas.style.fiter = 'blur(10px)';
        setTimeout(() => { }, 1000);
        canvas.style.fiter = 'none';
        game();
        let countDownDate = new Date().getTime() + time + 60000;
        let interval = setInterval(() => {
            now = new Date().getTime();
            distance = countDownDate - now;
            minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            seconds = Math.floor((distance % (1000 * 60)) / 1000);
            let timeDisplay = document.querySelector(".time-display");
            if (timeDisplay)
                timeDisplay.textContent = minutes + ":" + seconds;
            else
            {
                clearInterval(interval);
                cancelAnimationFrame(animationframe);
            }
            if (distance <= 0) {
                if (number1 == number2) {
                    timeDisplay.textContent = "over time";
                }
                else {
                    timeDisplay.textContent = "time up";
                    clearInterval(interval);
                    cancelAnimationFrame(animationframe);
                    canvas.style.fiter = 'blur(10px)';
                    setTimeout(() => { 
                        router.navigate('/home');
                    }, 3000);
                    countdownElement.style.display = "block"
                    if (number1 > number2) {
                        countdownElement.textContent = "Blue Team Wins!";
                        countdownElement.style.color = '#4496D4';
                    }
                    else {
                        countdownElement.textContent = "Red Team Wins!";
                        countdownElement.style.color = '#FF6666';

                    }
                }

            }
        });
    }
    gamestart();

}