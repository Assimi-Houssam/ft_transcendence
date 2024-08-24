export class FinalTournament extends HTMLElement {
    constructor(teamSize=1, bracketsSize=1) {
        super();
        this.teamSize = teamSize;
        this.bracketsSize = bracketsSize;
        this.showNames = bracketsSize === 1;
        this.classList.add("ContainerUsersTeams");
        console.log("teamSize -> ", teamSize)
    }

    connectedCallback() {
        this.innerHTML = `
            
                <div class="TwoVsTwo">
                    <div class="usersTeams2v2_final">
                        <div class="player_">
                            ${this.showNames ? `
                                <input type="text" id="player_bracket_name" placeholder="player name">
                                ${this.teamSize > 1 ? ` <input type="text" id="player_bracket_name" placeholder="player name">` : ""}
                            ` : ""}
                        </div>
                        <div class="player_">
                        ${this.showNames ? `
                            <input type="text" id="player_bracket_name" placeholder="player name">
                            ${this.teamSize > 1 ? ` <input type="text" id="player_bracket_name" placeholder="player name">` : ""}
                    ` : ""}
                        </div>
                    </div>
                    <div class="line_tourn">
                        <img src="../../../../assets/images/line_tourn.png" width="130px">
                    </div>
                </div>
        `
    }
}

customElements.define("final-tournament", FinalTournament);