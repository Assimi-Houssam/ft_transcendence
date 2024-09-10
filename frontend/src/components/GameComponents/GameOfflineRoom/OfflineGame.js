import Toast from "../../Toast.js";
import { router } from "../../../routes/routes.js";
import { RoomOptions } from "../GameOnlineRoom/RoomOptions.js";
import { TournamentBracket } from "./tournament/Tournament.js";
import { OfflineGamePage } from "../../GamePlay/OfflineGamePage.js";

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

export class OfflineGame extends HTMLElement {
    constructor() {
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
            customization: this.customization
        };
    }

    validateBracketsFields(brackts) {
        if (!brackts || !brackts.groups) {
            Toast.error("Some fields are empty")
            return false;
        }
        const groups = brackts.groups;
        for (let i = 0; i < groups.length; i++) {
            if (groups.length > 2) {
                if (i === 2)
                    break;
            }
            const arr = groups[i];
            if (arr[0].username.toLowerCase() === arr[1].username.toLowerCase()) {
                Toast.error("usernames should be unique")
                return false;
            } else {
                const first = arr[0];
                const sec = arr[1];
                for (let j = 0; j < groups.length; j++) {
                    if (j !== i) {
                        const arr_ = groups[j];
                        for (let a = 0; a < arr_.length; a++ ) {
                            if (arr_[a].username.toLowerCase() === first.username.toLowerCase() || arr_[a].username.toLowerCase() === sec.username.toLowerCase()) {
                                Toast.error("usernames should be unique");
                                return false;
                            }
                        }
                    }
                }
            }
        }
        return true;
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
            this.gameData.bracketSize = Number(evt.detail);
            this.bracket.update(this.gameData.bracketSize);
        });
        this.addEventListener("timeChange", (evt) => {
            this.gameData.time = evt.detail;
        });
        this.addEventListener("gameModeChange", (evt) => {
            this.gameData.gameMode = evt.detail;
        });
        this.addEventListener("customizationChange", (evt) => {
            this.gameData.customization = evt.detail;
        });
        this.querySelector(".BtnStartGame").addEventListener("click", (e) => {
            const bracket = this.bracket.generateBracket();
            if (!this.validateBracketsFields(bracket)) 
                return;
            Toast.success("Game started");
            router.navigate("/OfflineGame", new OfflineGamePage(this.gameData, bracket));
        });
    }
}

customElements.define("offline-game", OfflineGame);