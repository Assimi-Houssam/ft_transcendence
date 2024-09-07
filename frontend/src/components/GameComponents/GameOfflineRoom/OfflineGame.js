import { Tournament } from "./tournament/Tournament.js";
import { RoomOptions } from "../GameOnlineRoom/RoomOptions.js";


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
        this.teamSize = 1;
        this.gameMode = "pong";
        this.customElements = [];
        this.bracket = new Tournament(this.teamSize, this.bracketSize);
        this.gameData = {
            bracketSize: this.bracketSize,
            teamSize: this.teamSize,
            gameMode: this.gameMode,
            customElements: this.customElements,
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
            console.log("bracket size:", this.gameData.bracketSize, " | teamsize:", this.gameData.teamSize);
            this.bracket.update(this.gameData.bracketSize, this.gameData.teamSize);
        });
        this.addEventListener("teamSizeChange", (evt) => {
            this.gameData.teamSize = evt.detail;
            console.log("bracket size:", this.gameData.bracketSize, " | teamsize:", this.gameData.teamSize);
            this.bracket.update(this.gameData.bracketSize, this.gameData.teamSize);
        });
        this.addEventListener("gameModeChange", (evt) => {
            this.gameData.gameMode = evt.detail;
            console.log("game mode:", this.gameData.gameMode);
            this.bracket.update(this.gameData.gameMode);
        });
        this.addEventListener("customizationChange", (evt) => {
            this.gameData.customElements = evt.detail;
            console.log("customization :", this.gameData.customElements);
            this.bracket.update(this.gameData.customElements);
        });
        this.querySelector(".BtnStartGame").addEventListener("click", (e) => {
            const tournamentInputs = document.querySelectorAll("tournament-group input");
            const playersName = [];
            tournamentInputs.forEach(input => {
                playersName.push(input.value);
            });
            console.log("Bracket Size: ", this.gameData.bracketSize);
            console.log("Team Size: ", this.gameData.teamSize);
            console.log("Game Mode: ", this.gameData.gameMode);
            console.log("Custom Elements: ", this.gameData.customElements);
            console.log("Player Names: ", playersName);
        });

    }
    
}

customElements.define("offline-game", OfflineGame);