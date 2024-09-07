import { FinalTournament } from "./FinalTournament.js";
import { LineDrawingSemiFinal } from "./components-line-drawing-semi-final/line-drawing-semi-final.js";

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
                        `<h2>&</h2> <input type="text" id="player_bracket_name" placeholder="player name" minlength="3" maxlength="10" required>` : ""}
                </div>
                <div class="player_">
                    <input type="text" id="player_bracket_name" placeholder="player name" minlength="3" maxlength="10" required> 
                    ${this.teamSize > 1 ? `<h2>&</h2> <input type="text" id="player_bracket_name" placeholder="player name" minlength="3" maxlength="10" required>` : ""}
                </div>
            </div>
            <div class="line_tourn">
                <div class="toor">
                    <line-drawing-semi-final></line-drawing-semi-final>
                </div>
            </div>`;
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
    constructor(teamSize = 1, bracketSize = 1) {
        super();
        this.teamSize = teamSize;
        this.bracketSize = bracketSize;
        this.classList.add("ContainerCardOffline");
    }
    update(newBracketSize, newTeamSize) {
        this.teamSize = newTeamSize;
        this.bracketSize = newBracketSize;
        this.connectedCallback();
    }
    connectedCallback() {
        this.innerHTML = `
            ${this.bracketSize > 1 ? (`
                <div class="ContainerUsersTeams">
                </div>
            `) : ""}`;
        const ContainerUsersTeams = document.getElementsByClassName("ContainerUsersTeams")[0];
        if (this.bracketSize > 1) {
            ContainerUsersTeams.appendChild(new GroupBrackets(this.teamSize));
            ContainerUsersTeams.appendChild(new GroupBrackets(this.teamSize));
        }
        this.appendChild(new FinalTournament(this.teamSize, this.bracketSize));
    }
}

customElements.define("tournament-group", Tournament);
