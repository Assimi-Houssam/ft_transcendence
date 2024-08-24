import ParticipantsCard from "../ParticipantsCard.js";
import { roomData } from "../RoomPage.js";
import { router } from "../../../../routes/routes.js";
import { Tournament } from "../../GameOfflineRoom/tournament/Tournament.js";
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
                <button id="gameTeamSize" name="1">1</button>
                <button name="2">2</button>
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
                if (roomData.teamSize === "2") {
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
                if (router.route.path == "/tournament") {
                    const tournament  = document.getElementById("tournament_node");
                    if (tournament) {
                        console.log("parseInt(roomData.bracketSize) -> ", parseInt(roomData.bracketSize))
                        const tourn =  new Tournament(parseInt(roomData.teamSize), parseInt(roomData.bracketSize));
                        tournament.replaceChildren(tourn)
                    }
                }else {
                    const roomTeamSize = document.getElementById("RoomTeamSize");
                    const sizePlayers = document.getElementById("SizePlayers");
                    if (roomTeamSize)
                        roomTeamSize.innerHTML = `${roomData.teamSize === "2" ? "2v2" : "1v1"}`;
                    if (sizePlayers) {
                        sizePlayers.innerHTML = `${roomData.users.length}/${roomData.teamSize} Players`;
                        sizePlayers.innerHTML = `${roomData.teamSize === "2" ? `${roomData.users.length}/4 Players` : `1/2 Players`}`
                    }
                }
            })
        }
    }
}

customElements.define("game-team-size", GameTeamSize);