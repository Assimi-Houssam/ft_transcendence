import { RoomCard } from "../RoomCard.js";
import { roomData } from "../Rooms.js";

let user = {
    username : "reda"
}

export class GameTeamSize extends HTMLElement {
    constructor(){
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div id="BtnTeamSize" class="BtnTeamSize">
                <button id="gameTeamSize" name="oneTeam">1</button>
                <button name="twoTeam">2</button>
            </div>
        `

        const BtnTeamSize = document.getElementById("BtnTeamSize");

        for (let i = 0; i < BtnTeamSize.children.length; i++) {
            BtnTeamSize.children[i].addEventListener("click", () => {
                const gameTeamSize = document.getElementById("gameTeamSize");
                if (gameTeamSize) gameTeamSize.id = "";
                BtnTeamSize.children[i].id = "gameTeamSize";
                this.SelectTeamSize = BtnTeamSize.children[i];
                roomData.teamSize = this.SelectTeamSize.name
                const parrent  = document.getElementById("ContainerCardParticipants");
                const replacedChild = document.querySelector("room-card");
                parrent.replaceChild(new RoomCard(roomData.teamSize === "twoTeam" ? 2 : 1), replacedChild); 
                if (roomData.teamSize === "twoTeam") {
                    roomData["teams"] = {
                        readTeam : {user, user},
                        blueTeam : {user, user}
                    }
                }else {
                    roomData["teams"] = {
                        host : user,
                        ennmy : user
                    }
                }
                const RoomTeamSize = document.getElementById("RoomTeamSize");
                RoomTeamSize.innerHTML = `${roomData.teamSize === "twoTeam" ? "2v2" : "1v1"}`
            })
        }
    }
}

customElements.define("game-team-size", GameTeamSize);