import { router } from "../../../../routes/routes.js";
import { TournamentBracket } from "./Tournament.js";
import { OfflineGamePage } from "../../../GamePlay/OfflineGamePage.js";

export class NextTournament extends HTMLElement {
    constructor(gameData = null, bracketInfo) {
        super();
        this.gameData = gameData;
        this.bracketInfo = bracketInfo;
    }
    
    connectedCallback() {
        let winner = "";
        if (this.gameData == undefined || this.bracketInfo == undefined)
            return router.navigate("/home");
        else
            this.bracket = new TournamentBracket(true, this.gameData.bracketSize, this.bracketInfo);
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
        let hasReachedFinals = false;
        if (this.bracketInfo.groups.length === 1)
            hasReachedFinals = true;
        if (this.bracketInfo.groups.length === 3 && this.bracketInfo.status === 3)
            hasReachedFinals = true;

        let nextBracket = this.bracketInfo.groups[this.bracketInfo.status];
        this.innerHTML = `
            <div>
                <div class="OfflineTournamentTitleNextUp">
                    <h2>${hasReachedFinals === true ? "Results" : "Next Up!"}</h2>
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
            <div class="OfflineTournamentTitleWinner">
                <h2 style="font-size: 3.5vh;">${this.bracketInfo ? "The Winner Is" : ""} <span style="color: #24CE90;">${winner}</span></h2>
            </div>
            ${
                this.bracketInfo.status != 3 && this.bracketInfo.groups.length > 1 ?
                    `<div class="OfflineTournamentTitleNextMatch">
                        <h2>Next Up: <span style="color: #24CE90;">${nextBracket[0].username}</span> vs <span style="color: #24CE90;">${nextBracket[1].username}</span></h2>
                    </div>` : ""
            }
            <div class="NextTournamentBtn">
                <div class="BtnTournament">
                    <button type="button" id="BtnTournamentGame">${hasReachedFinals === true ? "Go Home" : "Next Game!"}</button>
                </div>
            </div>`;
        this.querySelector(".tournament_node").appendChild(this.bracket);
        const button = this.querySelector("#BtnTournamentGame");
        button.onclick = () => {
            if (hasReachedFinals)
                router.navigate("/home");
            else
                router.navigate("/OfflineGame", new OfflineGamePage(this.gameData, this.bracketInfo));
        }
        // console.log("status:", this.gameData.bracketSize === 2 && this.bracketInfo.status <= 2);
        // if (!hasReachedFinals) {
        //     console.log("tournament hasnt finished yet, switching to game page in 1.5s");
        //     setTimeout(() => {
        //         if ()
        //             router.navigate("/OfflineGame", new OfflineGamePage(this.gameData, this.bracketInfo));
        //     }, 4000);
        // }
    }
}

customElements.define("next-tournament", NextTournament)