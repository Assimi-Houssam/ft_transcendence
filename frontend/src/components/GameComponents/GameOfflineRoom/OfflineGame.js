import { Tournament } from "./tournament/Tournament.js";
import { RoomOptions } from "../GameOnlineRoom/RoomOptions.js";

export class OfflineGame extends HTMLElement{
    constructor(){
        super();
        this.bracketSize = 1;
        this.teamSize = 1;
        this.bracket = new Tournament(this.teamSize, this.bracketSize);
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
            </div>`;
        this.querySelector(".tournament_node").appendChild(this.bracket);
        this.appendChild(new RoomOptions(true));
        this.addEventListener("bracketChange", (evt) => {
            this.bracketSize = evt.detail;
            console.log("bracket size:", this.bracketSize, " | teamsize:", this.teamSize);
            this.bracket.update(this.bracketSize, this.teamSize);
        });
        this.addEventListener("teamSizeChange", (evt) => {
            this.teamSize = evt.detail;
            console.log("bracket size:", this.bracketSize, " | teamsize:", this.teamSize);
            this.bracket.update(this.bracketSize, this.teamSize);
        });
    }
}

customElements.define("offline-game", OfflineGame);