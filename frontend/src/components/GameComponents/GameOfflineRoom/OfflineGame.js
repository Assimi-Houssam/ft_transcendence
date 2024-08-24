import { Tournament } from "./tournament/Tournament.js";

export class OfflineGame extends HTMLElement{
    constructor(){
        super();
        this.bracketSize = 2;
        this.teamSize = 2;
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
            <div id="tournament_node">
                <tournament-group class="ContainerCardOffline"></tournament-group>
            </div>
            <div class="content_line">
                <div class="line_x"></div>
            </div>
            <container-game-options></container-game-options>
    `
    }
}

customElements.define("offline-game", OfflineGame);