import ApiWrapper from "../../utils/ApiWrapper.js";
import { getUserInfo } from "../../utils/utils.js";
import { game } from "./OfflinePong.js";
import { hockeygame } from "./OfflineHockey.js";

export class OfflineGamePage extends HTMLElement {
    constructor(gameData = null, bracket = null) {
        super();
        this.user = null;
        this.url = ApiWrapper.getUrl();
        this.gameData = gameData;
        this.bracket = bracket;
    }
    async connectedCallback() {
            this.innerHTML = `
                <div id="pingpongcontainer">
                    <div class="ts">
                        <div class="pingpongProfile">
                            <div id="blueteam" style="display: flex; ">
                                <img class="profile-pic" src="${this.url}/media/default.jpeg" alt="Profile picture"
                                    style="border: 3px solid blue; border-radius: 10px;">
                            </div>
                            <p id="player1" style="color: white; font-size:40px;">0</p>
                        </div>
                        <div class="block-text">
                            <time class="time-display">0${this.gameData.time}:00</time>
                        </div>
                        <div class="pingpongProfile">
                            <p id="player2" style="color: white; font-size: 40px;">0</p>
                            <div id="readteam" style="display: flex; flex-direction: row;">
                                <img class="profile-pic" src="${this.url + this.user.pfp}" alt="Profile picture"
                                    style="border: 3px solid red; border-radius: 10px;">
                            </div>
                        </div>
                    </div>
                    <div style="width: 100%; height: 80vh;">
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
                console.log(this.gameData);
                if (this.gameData.gameMode === "pong")
                    game(ctx, canvas, this.gameData);
                else if (this.gameData.gameMode === "hockey")
                    hockeygame(ctx, canvas, this.gameData);

            }, 0);
        
    }

    async disconnectedCallback() {
    }
}

customElements.define("offline-game-page", OfflineGamePage);

