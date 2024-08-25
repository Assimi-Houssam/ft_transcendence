import { FinalTournament } from "./FinalTournament.js";


export class GroupBrackets extends HTMLElement {
    constructor(teamSize=1) {
        super();
        this.classList.add("TwoVsTwo");
        this.teamSize = teamSize;
    }

    connectedCallback() {
        this.innerHTML = `        
            <div class="usersTeams2v2">
                <div class="player_">
                    <input type="text" id="player_bracket_name" placeholder="player name" minlength="3" maxlength="10" required> ${this.teamSize > 1 ? 
                        `<input type="text" id="player_bracket_name" placeholder="player name" minlength="3" maxlength="10" required>` : ""}
                </div>
                <div class="player_">
                    <input type="text" id="player_bracket_name" placeholder="player name" minlength="3" maxlength="10" required> 
                        ${this.teamSize > 1 ? `<input type="text" id="player_bracket_name" placeholder="player name" minlength="3" maxlength="10" required>` : ""}
                </div>
            </div>
            <div class="line_tourn">
                <div class="toor">
                    <img src="../../../../assets/images/line_G.png" width="42px">
                    <div class="linee">
                    </div>
                </div>
            </div>
        `
    }
}

customElements.define("brackets-group", GroupBrackets);

export class Tournament extends HTMLElement {
    constructor(teamSize=1, bracketsSize=1){
        super();
        this.teamSize = teamSize;
        this.bracketsSize = bracketsSize;
        this.classList.add("ContainerCardOffline")
    }

    connectedCallback(){
        this.innerHTML = `
            ${this.bracketsSize > 1 ? (`
                <div class="ContainerUsersTeams">
                </div>
            `) : ""}
        `
        const ContainerUsersTeams = document.getElementsByClassName("ContainerUsersTeams")[0];
        if (this.bracketsSize > 1) {
            const bracketGroup1 = new GroupBrackets(this.teamSize, this.bracketsSize);
            const bracketGroup2 = new GroupBrackets(this.teamSize, this.bracketsSize);
            ContainerUsersTeams.appendChild(bracketGroup1)
            ContainerUsersTeams.appendChild(bracketGroup2)
        }
        const t = new FinalTournament(this.teamSize, this.bracketsSize);
        this.appendChild(t, this.bracketsSize)
    }
}

customElements.define("tournament-group", Tournament);