import { FinalTournament } from "./FinalTournament.js";
import {LineDrawingDownWinSemiFinal} from "./components-line-drawing-semi-final/line-drawing-down-win-semi-final.js";

export class GroupBrackets extends HTMLElement {
    constructor(teamSize = 1) {
        super();
        this.classList.add("TwoVsTwo");
        this.teamSize = teamSize;
    }

    connectedCallback() {
        this.innerHTML = `   
            <div class="usersTeams2v2">
                <div class="player_">
                    <input type="text" id="player_bracket_name" placeholder="player name" minlength="3" maxlength="10" required> 
                    ${this.teamSize > 1 ? 
                        `<input type="text" id="player_bracket_name" placeholder="player name" minlength="3" maxlength="10" required>` : ""}
                </div>
                <div class="player_">
                    <input type="text" id="player_bracket_name" placeholder="player name" minlength="3" maxlength="10" required> 
                    ${this.teamSize > 1 ? `<input type="text" id="player_bracket_name" placeholder="player name" minlength="3" maxlength="10" required>` : ""}
                </div>
            </div>
            <div class="line_tourn">
                <div class="toor">
                    <line-drawing-down-win-semi-final></line-drawing-down-win-semi-final>
                </div>
            </div>
        `;
        requestAnimationFrame(() => {
            this.applyAnimation();
        });
    }

    applyAnimation() {
        anime({
            targets: '.line-drawing-up-semi-final path, .line-drawing-up-semi-final circle, .line-drawing-down-semi-final path',
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'easeInOutSine',
            duration: 1500,
            delay: (el, i) => i * 250,
            direction: 'alternate',
            loop: false
        });
    }
}

customElements.define("brackets-group", GroupBrackets);

export class Tournament extends HTMLElement {
    constructor(teamSize = 1, bracketsSize = 1) {
        super();
        this.teamSize = teamSize;
        this.bracketsSize = bracketsSize;
        this.classList.add("ContainerCardOffline");
    }

    connectedCallback() {
        this.innerHTML = `
            ${this.bracketsSize > 1 ? (`
                <div class="ContainerUsersTeams">
                </div>
            `) : ""}
        `;
        const ContainerUsersTeams = document.getElementsByClassName("ContainerUsersTeams")[0];
        if (this.bracketsSize > 1) {
            const bracketGroup1 = new GroupBrackets(this.teamSize);
            const bracketGroup2 = new GroupBrackets(this.teamSize);
            ContainerUsersTeams.appendChild(bracketGroup1);
            ContainerUsersTeams.appendChild(bracketGroup2);
        }
        const t = new FinalTournament(this.teamSize, this.bracketsSize);
        this.appendChild(t);
    }
}

customElements.define("tournament-group", Tournament);
