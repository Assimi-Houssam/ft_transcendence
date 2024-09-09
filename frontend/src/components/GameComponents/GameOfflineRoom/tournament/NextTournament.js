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
        let winner = "";
        if (this.bracketInfo)
        {
            for(let i = 0; i < this.bracketInfo.groups.length; i++) {
                for(let j = 0; j < this.bracketInfo.groups[i].length; j++){
                    if (this.bracketInfo.groups[i][j].status === 1){
                        winner = this.bracketInfo.groups[i][j].username;
                    }
                }
            }
        }
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
            <div>
                <div class="OfflineTournamentTitle">
                    <h2>${this.bracketInfo ? "The Winner Is" : ""} <span style="color: #24CE90;">${winner}</span></h2>
                </div>
            </div>`;
        this.querySelector(".tournament_node").appendChild(this.bracket);
        console.log("status:", this.gameData.bracketSize === 2 && this.bracketInfo.status <= 2);
        if (this.gameData.bracketSize === 2 && this.bracketInfo.status <= 2) {
            console.log("tournament hasnt finished yet, switching to game page in 1.5s");
            setTimeout(() => {
                    router.navigate("/OfflineGame", new OfflineGamePage(this.gameData, this.bracketInfo));
            }, 4000);
        }
    }
}

customElements.define("next-tournament", NextTournament)