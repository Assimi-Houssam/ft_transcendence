import ParticipantsCard from "../ParticipantsCard.js";
import { roomData } from "../RoomPage.js";

let user = {
    username : "rida"
}

export class GameTeamSize extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div id="BtnTeamSize" class="BtnTeamSize">
                <button id="gameTeamSize" name="oneTeam">1</button>
                <button name="twoTeam">2</button>
            </div>
        `

        const btnTeamSize = document.getElementById("BtnTeamSize");

        for (let i = 0; i < btnTeamSize.children.length; i++) {
            btnTeamSize.children[i].addEventListener("click", () => {
                const gameTeamSize = document.getElementById("gameTeamSize");
                if (gameTeamSize) gameTeamSize.id = "";
                btnTeamSize.children[i].id = "gameTeamSize";
                this.SelectTeamSize = btnTeamSize.children[i];
                roomData.teamSize = this.SelectTeamSize.name;

                ParticipantsCard.switchTeamSize();
                if (roomData.teamSize === "twoTeam") {
                    roomData["teams"] = {
                        redTeam: {user, user},
                        blueTeam: {user, user}
                    }
                }
                else {
                    roomData["teams"] = {
                        host : user,
                        ennemy : user
                    }
                }
                const roomTeamSize = document.getElementById("RoomTeamSize");
                const sizePlayers = document.getElementById("SizePlayers");
                roomTeamSize.innerHTML = `${roomData.teamSize === "twoTeam" ? "2v2" : "1v1"}`;
                sizePlayers.innerHTML = `${roomData.users.length}/${roomData.teamSize} Players`;
                sizePlayers.innerHTML = `${roomData.teamSize === "twoTeam" ? `${roomData.users.length}/4 Players` : `1/2 Players`}`
            })
        }
    }
}

customElements.define("game-team-size", GameTeamSize);