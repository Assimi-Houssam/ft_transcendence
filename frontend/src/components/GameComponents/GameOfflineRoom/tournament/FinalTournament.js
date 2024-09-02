import { LineDrawingUpWinFinal } from "./components-line-drawing-final/line-drawing-up-win-final.js";

export class FinalTournament extends HTMLElement {
    constructor(teamSize = 1, bracketsSize = 1) {
        super();
        this.teamSize = teamSize;
        this.bracketsSize = bracketsSize;
        this.classList.add("ContainerUsersTeams");
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="TwoVsTwo">
                <div class="usersTeams2v2_final">
                    <div class="player_">
                            <input type="text" id="player_bracket_name" placeholder="player name" minlength="3" maxlength="10" required>
                            ${this.teamSize > 1 ? `& <input type="text" id="player_bracket_name" placeholder="player name" minlength="3" maxlength="10" required>` : ""}
                    </div>
                    <div class="player_">
                        <input type="text" id="player_bracket_name" placeholder="player name" minlength="3" maxlength="10" required>
                        ${this.teamSize > 1 ? `& <input type="text" id="player_bracket_name" placeholder="player name" minlength="3" maxlength="10" required>` : ""}
                    </div>
                </div>
                <div class="line_tourn">
                    <line-drawing-up-win-final></line-drawing-up-win-final>
                </div>
            </div>
        `;

        requestAnimationFrame(() => {
            this.applyAnimation();
        });
    }

    applyAnimation() {
        anime({
            targets: '.line-drawing-up-final path, .line-drawing-up-final circle, .line-drawing-down-final path',
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'easeInOutSine',
            duration: 1500,
            delay: (el, i) => i * 250,
            direction: 'alternate',
            loop: false
        });
    }
}

customElements.define("final-tournament", FinalTournament);