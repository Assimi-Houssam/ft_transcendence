import { Tournament } from "./Tournament.js";

export class NextTournament extends HTMLElement {
    constructor(gameData = null, winner = null, loser = null) {
        super();
        this.gameData = gameData;
        this.winner = winner;
        this.loser = loser;
        this.bracket = new Tournament(1, this.bracketSize);
    }
    
    connectedCallback() {
        this.innerHTML = `
            <div>
                <div class="OfflineTournamentTitle">
                    <h2>Next Up</h2>
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
        `

        this.querySelector(".tournament_node").appendChild(this.bracket);
    }

    
}

customElements.define("next-tournament", NextTournament)