import { gamePhisique } from "./onlineGame1v1_s.js";
import { gamePhisique2 } from "./onlineGame2v2_s.js";
import { hockeyphisque } from "./hockeyonline.js";

export class onlineGamePage extends HTMLElement {
    constructor(Data = null, User = null) {
        super();
        this.roomData = Data;
        this.user = User;
        this.ws = null;
        this.animationframe = null;
        this.interval = null;
    }
    async connectToRoom() {
        try {

            if (this.roomData.gamemode === "pong") {
                if (this.roomData.teamSize == "1")
                    this.ws = new WebSocket(`ws://localhost:8000/ws/game/onlinev1/${this.roomData.id}/`);
                else
                    this.ws = new WebSocket(`ws://localhost:8000/ws/game/onlinev2/${this.roomData.id}/`);
            }
            else
                this.ws = new WebSocket(`ws://localhost:8000/ws/game/hockey/${this.roomData.id}/`);
        }
        catch (e) {
             router.navigate('/home');
        }
    }
    async connectedCallback() {
        console.log(this.roomData);
        if (this.roomData) {
            let player;
            if (this.roomData.teamSize == "2") {
                for (let i = 0; i < 2; i++) {
                    if (this.roomData.blueTeam[i].username === this.user.username) {
                        player = String("paddle" + (i + 1));
                        break;
                    }
                    if (this.roomData.redTeam[i].username === this.user.username) {
                        player = String("paddle" + (i + 3));
                        break;
                    }
                }

            }
            else
                player = this.roomData.blueTeam[0].username === this.user.username ? "player1" : "player2";
            const blueTeam = this.roomData.blueTeam[0];
            const redTeam = this.roomData.redTeam[0];
            this.innerHTML = `
                <div id="pingpongcontainer">
                    <div class="ts">
                        <div class="pingpongProfile">
                            <div id="blueteam" style="display: flex; ">
                                <img class="profile-pic" src="${blueTeam.pfp}" alt="Profile picture"
                                    style="border: 3px solid blue; border-radius: 10px;">
                            </div>
                            <p id="player1" style="color: white; font-size:45px; font-family: sans-serif;">0</p>
                        </div>
                        <div class="block-text">
                            <p id="rounds">round 1</p>
                            <p>VS</p>
                            <time class="time-display">00:00</time>
                        </div>
                        <div class="pingpongProfile">
                            <p id="player2" style="color: white; font-size: 45px; font-family: sans-serif;">0</p>
                            <div id="readteam" style="display: flex; flex-direction: row;">
                                <img class="profile-pic" src="${redTeam.pfp}" alt="Profile picture"
                                    style="border: 3px solid red; border-radius: 10px;">
                            </div>
                        </div>
                    </div>
                    <div style="width: 100%; height: 70vh;">
                        <canvas id="canvas"></canvas>
                    </div>
                    <div id="countdown"></div>
                </div>`;
            setTimeout(async () => {
                const canvas = document.getElementById('canvas');
                const ctx = canvas.getContext('2d');
                if (this.roomData) {
                    this.connectToRoom(this.roomData);
                    if (this.roomData.gamemode === "pong") {
                        switch (this.roomData.teamSize) {
                            case "1":
                                gamePhisique(ctx, canvas, this.ws, this.roomData.time, this.roomData.customization, player);
                                break;
                            case "2":
                                let blueimg = document.getElementById('blueteam');
                                let newImg = document.createElement('img');
                                newImg.className = "profile-pic";
                                newImg.src = this.roomData.blueTeam[1].pfp; // replace with your image source
                                newImg.alt = "Profile picture";
                                newImg.style.border = "3px solid blue";
                                newImg.style.borderRadius = "10px";
                                newImg.style.marginLeft = "10px";
                                blueimg.appendChild(newImg);
                                let redimg = document.getElementById('readteam');
                                let newImg2 = document.createElement('img');
                                newImg2.className = "profile-pic";
                                newImg2.src = this.roomData.redTeam[1].pfp; // replace with your image source
                                newImg2.alt = "Profile picture";
                                newImg2.style.border = "3px solid red";
                                newImg2.style.borderRadius = "10px";
                                newImg2.style.marginLeft = "10px";
                                redimg.appendChild(newImg2);
                                gamePhisique2(ctx, canvas, this.ws, this.roomData.time, this.roomData.customization, player);
                                break;
                        }
                    }
                    else
                        hockeyphisque(ctx, canvas, this.ws, this.roomData.time, player);
                }
            }, 0);
        }
    }

    async disconnectedCallback() {
        console.log('desconnectedCallback');
        clearInterval(this.interval);
        if (this.ws)
            if (this.ws.readyState === 1)
                this.ws.close();
    }
}

customElements.define("online-game-page", onlineGamePage);

