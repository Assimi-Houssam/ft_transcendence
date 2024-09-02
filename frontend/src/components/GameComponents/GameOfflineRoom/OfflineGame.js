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
            </div>
            `;
        this.querySelector(".tournament_node").appendChild(this.bracket);
        this.appendChild(new RoomOptions(true));
        this.appendChild(new TournamentFooter(true));
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
        this.querySelector("#BtnStartGame").addEventListener("click", (e) => {
            const tournamentinputs = document.querySelectorAll("tournament-group input");
                const playersName = [];
                tournamentinputs.forEach(input => {
                    playersName.push(input.value)
                })
                console.log("player Names: ", playersName);
        });

    }
    
}

customElements.define("offline-game", OfflineGame);