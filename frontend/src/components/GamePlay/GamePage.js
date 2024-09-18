import { PongTable } from "./PongTable.js";
import { PongTable2v2 } from "./PongTable2v2.js";
import { HockeyTable } from "./HockeyTable.js";
import ApiWrapper from "../../utils/ApiWrapper.js";

export class GamePage extends HTMLElement {
    constructor(Data = null, User = null) {
        super();
        this.roomData = Data;
        this.user = User;
        this.ws = null;
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
                            <p id="blueplayer">${blueTeam.username}</p>
                            <div id="blueteam" style="display: flex; ">
                                <img class="profile-pic" src="${ApiWrapper.getUrl() + blueTeam.pfp}" alt="Profile picture"
                                    style="border: 3px solid blue; border-radius: 10px;">
                            </div>
                            <p id="player1" style="color: white; font-size:40px;">0</p>
                        </div>
                        <div class="block-text">
                            <time class="time-display">00:00</time>
                        </div>
                        <div class="pingpongProfile">
                            <p id="player2" style="color: white; font-size: 40px;">0</p>
                            <div id="readteam" style="display: flex; flex-direction: row;">
                                <img class="profile-pic" src="${ApiWrapper.getUrl() + redTeam.pfp}" alt="Profile picture"
                                    style="border: 3px solid red; border-radius: 10px;">
                            </div>
                            <p id="redplayer">${redTeam.username}</p>
                        </div>
                    </div>
                    <div style="width: 100%; height: 70vh;">
                        <canvas id="canvas"></canvas>
                    </div>
                    <div id="countdown"></div>
                </div>`;
            setTimeout(async () => {
                let p1 = document.getElementById('player2');
                if (p1)
                    p1.textContent = "0";
                let p2 = document.getElementById('player1');
                if (p2)
                    p2.textContent = "0";
                const canvas = document.getElementById('canvas');
                const ctx = canvas.getContext('2d');
                if (this.roomData) {
                    this.connectToRoom(this.roomData);
                    if (this.roomData.gamemode === "pong") {
                        switch (this.roomData.teamSize) {
                            case "1":
                                PongTable(ctx, canvas, this.ws, this.roomData.time, this.roomData.customization, player);
                                break;
                            case "2":
                                let redplayer = document.getElementById('redplayer');
                                redplayer.textContent = redTeam.username + " & " +this.roomData.redTeam[1].username;
                                let blueplayer = document.getElementById('blueplayer');
                                blueplayer.textContent = blueTeam.username + " & " + this.roomData.blueTeam[1].username;
                                let blueimg = document.getElementById('blueteam');
                                let newImg = document.createElement('img');
                                newImg.className = "profile-pic";
                                newImg.src = ApiWrapper.getUrl() + this.roomData.blueTeam[1].pfp;
                                newImg.alt = "Profile picture";
                                newImg.style.border = "3px solid blue";
                                newImg.style.borderRadius = "10px";
                                newImg.style.marginLeft = "10px";
                                blueimg.appendChild(newImg);
                                let redimg = document.getElementById('readteam');
                                let newImg2 = document.createElement('img');
                                newImg2.className = "profile-pic";
                                newImg2.src = ApiWrapper.getUrl() + this.roomData.redTeam[1].pfp; 
                                newImg2.alt = "Profile picture";
                                newImg2.style.border = "3px solid red";
                                newImg2.style.borderRadius = "10px";
                                newImg2.style.marginLeft = "10px";
                                redimg.appendChild(newImg2);
                                PongTable2v2(ctx, canvas, this.ws, this.roomData.time, this.roomData.customization, player);
                                break;
                        }
                    }
                    else
                        HockeyTable(ctx, canvas, this.ws, this.roomData.time, player,this.roomData.customization);
                }
            }, 0);
        }
    }

    async disconnectedCallback() {
        clearInterval(this.interval);
        this.ws.close();
    }
}

customElements.define("online-game-page", GamePage);

