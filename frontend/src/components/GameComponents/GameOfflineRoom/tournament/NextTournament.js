import { router } from "../../../../routes/routes.js";
import { TournamentBracket } from "./Tournament.js";
import { OfflineGamePage } from "../../../GamePlay/OfflineGamePage.js";

export class NextTournament extends HTMLElement {
    constructor(gameData = null, bracketInfo) {
        super();
        this.gameData = gameData;
        this.bracketInfo = bracketInfo;
        this.bracket = new TournamentBracket(true, this.gameData.bracketSize, this.bracketInfo);
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
            </div>`;
        this.querySelector(".tournament_node").appendChild(this.bracket);
        if (this.gameData.bracketSize === 2 && this.bracketInfo.status > 2) {
            console.log("tournament hasnt finished yet, switching to game page in 1.5s");
            setTimeout(() => {
                    router.navigate("/OfflineGame", new OfflineGamePage(this.gameData, bracket));
            }, 1500);
        }
    }
}

customElements.define("next-tournament", NextTournament)