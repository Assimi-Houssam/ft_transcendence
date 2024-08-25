import { ChatGame } from "./ChatGame.js";
import { ParticipantsCard } from "./ParticipantsCard.js";
import { Loader } from "../../Loading.js"
import { RoomInfoCard } from "./RoomInfoCard.js";
import { RoomOptions } from "./RoomOptions.js";
import { RoomName } from "./RoomName/RoomName.js";

class RoomPageFooter extends HTMLElement {
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

customElements.define("room-page-footer", RoomPageFooter);

export class RoomPage extends HTMLElement {
    constructor() {
        super();
        // temporary
        this.roomData = {
            id: "1",
            name: "lolz",
            teamSize: "1",
            time: "3",
            gamemode: "pong",
            customization: "",
            host: "miyako",
            users: ["temp"],
            redTeam: [],
            blueTeam: []
        }
        this.chat = new ChatGame();
        this.infoCard = new RoomInfoCard(this.roomData);
        this.participantsCard = new ParticipantsCard(Number(this.roomData.teamSize));
    }
    async connectToRoom() {
        // ws connection here, when connecting to the ws, the server receives the room data and fills roomData 
    }
    async connectedCallback() {
        this.innerHTML = new Loader();
        await this.connectToRoom();
        this.innerHTML = `
            <div class="room-info-container">
                <div id="room-name_" class="room-name_">
                </div>
                <div class="content_line">
                    <div class="line_x"></div>
                </div>
            </div>
            <div id="ContainerCardParticipants" class="ContainerCardParticipants">
            </div>
            <div class="content_line">
                <div class="line_x"></div>
            </div>`;
        this.querySelector(".room-name_").appendChild(new RoomName(this.roomData.name));
        this.querySelector(".room-info-container").appendChild(this.infoCard);
        this.querySelector(".ContainerCardParticipants").appendChild(this.participantsCard);
        this.querySelector(".ContainerCardParticipants").appendChild(this.chat);
        this.appendChild(new RoomOptions());
        this.appendChild(new RoomPageFooter());
        this.addEventListener("gameModeChange", (evt) => {
            this.roomData.gamemode = evt.detail;
            this.infoCard.update(this.roomData);
        });
        this.addEventListener("timeChange", (evt) => {
            this.roomData.time = evt.detail;
            this.infoCard.update(this.roomData);
        });
        this.addEventListener("teamSizeChange", (evt) => {
            this.roomData.teamSize = evt.detail;
            this.participantsCard.switchTeamSize();
            this.infoCard.update(this.roomData);
        });
        this.addEventListener("customizationChange", (evt) => {
            this.roomData.customization = evt.detail;
            this.infoCard.update(this.roomData);
        });
        // im so sick of this, i dont care anymore
        document.addEventListener("roomNameChange", (evt) => {
            this.roomData.name = evt.detail;
            this.infoCard.update(this.roomData);
        });
        this.querySelector(".BtnStartGame").onclick = (e) => {
            console.log("game start! | room data: ", this.roomData);
            // error check, swtich the game scene here, whatever
        }
    }
    disconnectedCallback() {
        // close the ws connection here
    }
}

customElements.define("room-page", RoomPage);