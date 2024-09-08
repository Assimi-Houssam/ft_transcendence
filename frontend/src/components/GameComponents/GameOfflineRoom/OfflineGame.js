import { RoomOptions } from "../GameOnlineRoom/RoomOptions.js";
import { router } from "../../../routes/routes.js";

import { TournamentBracket } from "./tournament/Tournament.js";

class TournamentFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="ContainerFooter">
                <div>
                    <p style="display:none;" class="ContainerFooter_reminder">Unable to start the game: not enough players in the room</p>
                </div>
                <div class="BtnStartGame">
                    <button type="button" id="BtnStartGame">Start game!</button>
                </div>
            </div>`;
    }
}

customElements.define("tournament-footer", TournamentFooter);

export class OfflineGame extends HTMLElement{
    constructor(){
        super();
        this.bracketSize = 1;
        this.time = 3;
        this.gameMode = "pong";
        this.customElements = "";
        this.bracket = new TournamentBracket();
        this.gameData = {
            bracketSize: this.bracketSize,
            time: this.time,
            gameMode: this.gameMode,
            customization: this.customization,

        };
    }

    connectedCallback(){
        this.innerHTML = `
            <div>
                <div class="OfflineTournamentTitle">
                    <h2>Offline tournament</h2>
                </div>
                <div class="content_line">
                    <div class="line_x"></div>
                </div>
            </div>
            <div id="tournament_node" class="tournament_node">
            </div>
            <div class="content_line">
                <div class="line_x"></div>
            </div>
            `;
        this.querySelector(".tournament_node").appendChild(this.bracket);
        this.appendChild(new RoomOptions(true));
        this.appendChild(new TournamentFooter(true));
        this.addEventListener("bracketChange", (evt) => {
            this.gameData.bracketSize = evt.detail;
            console.log("bracket size:", this.gameData.bracketSize);
            this.bracket.update(this.gameData.bracketSize);
        });
        this.addEventListener("timeChange", (evt) => {
            this.gameData.time = evt.detail;
            console.log("time:", this.gameData.time);
            this.bracket.update(this.gameData.bracketSize, 1);
        });
        this.addEventListener("gameModeChange", (evt) => {
            this.gameData.gameMode = evt.detail;
            console.log("game mode:", this.gameData.gameMode);
            this.bracket.update(this.gameData.gameMode);
        });
        this.addEventListener("customizationChange", (evt) => {
            this.gameData.customization = evt.detail;
            console.log("customization :", this.gameData.customization);
            this.bracket.update(this.gameData.customization);
        });
        this.querySelector(".BtnStartGame").addEventListener("click", (e) => {
            const tournamentInputs = document.querySelectorAll("tournament-group input");
            const playersName = [];
            tournamentInputs.forEach(input => {
                playersName.push(input.value);
            });
                console.log(this.gameData);
                router.navigate("/OfflineGame", new OfflineGamePage(this.gameData));
        });

    }
    
}

customElements.define("offline-game", OfflineGame);