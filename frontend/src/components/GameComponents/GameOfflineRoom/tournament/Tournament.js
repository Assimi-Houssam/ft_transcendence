import { FinalTournament } from "./FinalTournament.js";
import { BracketLineTop } from "./BracketLines.js";
// import { LineDrawingSemiFinal } from "./components-line-drawing-semi-final/line-drawing-semi-final.js";

/*
 *
    bracket sz 1:
    bracket = {
        group_0: {
            users: [
                {
                username: "silentzer"
                status: 1 / 0 / -1 -> 1 means won, 0 means lost
                },
                {
                username: "miyako"
                status: 1 / 0 / -1 -> 1 means won, 0 means lost
                }
            ]
        }
    };

    bracket sz 2:

    bracket = {
        group_0: {
            users: [
                {
                username: "silentzer"
                status: 1 / 0 / -1 -> 1 means won, 0 means lost
                },
                {
                username: "miyako"
                status: 1 / 0 / -1 -> 1 means won, 0 means lost
                }
            ]
        },
        group_1: {
            users: [
                {
                username: "silentzer"
                status: 1 / 0 / -1 -> 1 means won, 0 means lost
                },
                {
                username: "miyako"
                status: 1 / 0 / -1 -> 1 means won, 0 means lost
                }
            ]
        },
        group_2: {
            users: [
                {
                username: "silentzer"
                status: 1 / 0 / -1 -> 1 means won, 0 means lost
                },
                {
                username: "miyako"
                status: 1 / 0 / -1 -> 1 means won, 0 means lost
                }
            ]
        }
    };
*/

export class GroupBrackets extends HTMLElement {
    constructor(locked = false, bracketInfo, teamSize = 1) {
        super();
        this.classList.add("TwoVsTwo");
        this.locked = locked;
        this.bracketInfo = bracketInfo;
        this.teamSize = teamSize;
    }

    connectedCallback() {
        this.innerHTML = `   
            <div class="usersTeams2v2">
                <div class="player_">
                    <input type="text" id="player_bracket_name" placeholder="player name" minlength="3" maxlength="10" required ${this.locked ? `disabled value="${this.bracketInfo.group_0.users[0].username}"` : ""}> 
                </div>
                <div class="player_">
                    <input type="text" id="player_bracket_name" placeholder="player name" minlength="3" maxlength="10" required ${this.locked ? `disabled value="${this.bracketInfo.group_0.users[1].username}"` : ""}> 
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


export class TournamentBracket extends HTMLElement {
    constructor(locked = false, bracketSize = 1, bracketInfo = null) {
        super();
        this.locked = locked;
        this.bracketSize = bracketSize;
        this.bracketInfo = bracketInfo;
    }
    connectedCallback() {
        this.innerHTML = `
            <div class="single-bracket">
                <input type="text" id="player_bracket_name" placeholder="player name" minlength="3" maxlength="10" required> 
                <input type="text" id="player_bracket_name" placeholder="player name" minlength="3" maxlength="10" required>             
            </div>
            <div class="bracket-lines">
                
                <svg class="top-path" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="6 0 53 107">
                    <path d="M0 1H42C48.0751 1 53 5.92487 53 12V106" stroke="#828E97"/>
                </svg>


                <svg class="bottom-path" fill="none" viewBox="6 0 53 107">
                    <path d="M0 105H42C48.0751 105 53 100.075 53 94V0" stroke="#828E97"/>
                </svg>
            </div>
            <div class="line-dir">
                <svg fill="none" viewBox="0 0 70 3">
                    <line y1="0.5" x2="70" y2="0.5" stroke="#828E97" stroke-width="3"/>
                </svg>
            </div>
            <svg class="crown" viewBox="151 80 49 45">
                <circle cx="174.5" cy="102.5" r="22" stroke="#828E97" fill="none"/>
                <path d="M185.125 111.438H164.875C164.669 111.438 164.5 111.613 164.5 111.828V112.609C164.5 112.824 164.669 113 164.875 113H185.125C185.331 113 185.5 112.824 185.5 112.609V111.828C185.5 111.613 185.331 111.438 185.125 111.438ZM187.375 95.8125C185.927 95.8125 184.75 97.0381 184.75 98.5469C184.75 98.918 184.82 99.2695 184.952 99.5918L182.312 101.242C182.069 101.394 181.806 101.467 181.544 101.467C181.023 101.467 180.517 101.184 180.241 100.681L176.753 94.3232C177.283 93.8203 177.625 93.1025 177.625 92.2969C177.625 90.7881 176.448 89.5625 175 89.5625C173.552 89.5625 172.375 90.7881 172.375 92.2969C172.375 93.1025 172.717 93.8203 173.247 94.3184L169.759 100.676C169.483 101.184 168.977 101.462 168.456 101.462C168.194 101.462 167.927 101.389 167.688 101.237L165.048 99.5869C165.175 99.2646 165.25 98.9131 165.25 98.542C165.25 97.0332 164.073 95.8076 162.625 95.8076C161.177 95.8076 160 97.0381 160 98.5469C160 100.056 161.177 101.281 162.625 101.281C162.719 101.281 162.808 101.262 162.897 101.252L166 109.875H184L187.103 101.252C187.192 101.262 187.281 101.281 187.375 101.281C188.823 101.281 190 100.056 190 98.5469C190 97.0381 188.823 95.8125 187.375 95.8125ZM175 91.125C175.619 91.125 176.125 91.6523 176.125 92.2969C176.125 92.9414 175.619 93.4688 175 93.4688C174.381 93.4688 173.875 92.9414 173.875 92.2969C173.875 91.6523 174.381 91.125 175 91.125ZM162.625 99.7188C162.006 99.7188 161.5 99.1914 161.5 98.5469C161.5 97.9023 162.006 97.375 162.625 97.375C163.244 97.375 163.75 97.9023 163.75 98.5469C163.75 99.1914 163.244 99.7188 162.625 99.7188ZM182.959 108.312H167.041L164.416 101.018L166.919 102.58C167.388 102.873 167.917 103.024 168.461 103.024C169.534 103.024 170.533 102.419 171.067 101.447L174.611 94.9873C174.742 95.0068 174.869 95.0264 175.005 95.0264C175.141 95.0264 175.267 95.0068 175.398 94.9873L178.938 101.452C179.472 102.424 180.47 103.024 181.544 103.024C182.088 103.024 182.617 102.868 183.086 102.58L185.589 101.018L182.959 108.312ZM187.375 99.7188C186.756 99.7188 186.25 99.1914 186.25 98.5469C186.25 97.9023 186.756 97.375 187.375 97.375C187.994 97.375 188.5 97.9023 188.5 98.5469C188.5 99.1914 187.994 99.7188 187.375 99.7188Z" fill="#828E97"/>
            </svg>
        `;
    }
}

customElements.define("tournament-bracket", TournamentBracket);

export class Tournament extends HTMLElement {
    constructor(locked, userInfo, teamSize = 1, bracketSize = 1) {
        super();
        this.bracketInfoTemplate = {
            group_0: {
                users: [
                    {
                        username: "silentzer",
                        status: -1
                    },
                    {
                        username: "miyako",
                        status: -1
                    }
                ]
            },
            group_1: { },
            group_2: { }
        }
        this.teamSize = teamSize;
        this.locked = locked;
        this.userInfo = userInfo;
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
