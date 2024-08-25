import { ChatGame } from "./ChatGame.js";
import ParticipantsCard from "./ParticipantsCard.js";
import { Loader } from "../../Loading.js"
import { RoomInfoCard } from "./RoomInfoCard.js";
import { RoomOptions } from "./RoomOptions.js";

export let roomData = {
    id: "1",
    name: "lolz",
    teamSize: "2",
    time: "3",
    gamemode: "pong",
    customization: "",
    host: "miyako",
    users: ["temp"],
    redTeam: [],
    blueTeam: []
}

export class RoomPage extends HTMLElement {
    constructor(){
        super();
        this.chat = new ChatGame();
        this.infoCard = new RoomInfoCard(roomData);
    }
    async connectToRoom() {
        // ws connection here, when connecting to the ws, the server receives the room data and fills roomData 
    }
    async connectedCallback() {
        this.innerHTML = new Loader();
        await this.connectToRoom();
        this.innerHTML = `
            <div class="room-info-container">
                <div id="room-name_" >
                    <room-name></room-name>
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
        this.querySelector(".room-info-container").appendChild(this.infoCard);
        this.querySelector(".ContainerCardParticipants").appendChild(ParticipantsCard);
        this.querySelector(".ContainerCardParticipants").appendChild(this.chat);
        this.appendChild(new RoomOptions());
        this.addEventListener("gameModeChange", (evt) => {
            roomData.gamemode = evt.detail;
            this.infoCard.update(roomData);
        });
        this.addEventListener("timeChange", (evt) => {
            roomData.time = evt.detail;
            this.infoCard.update(roomData);
        });
        this.addEventListener("teamSizeChange", (evt) => {
            roomData.teamSize = evt.detail;
            this.infoCard.update(roomData);
        });
        this.addEventListener("customizationChange", (evt) => {
            roomData.customization = evt.detail;
            this.infoCard.update(roomData);
        });
    }
    disconnectedCallback() {
        // close the ws connection here
    }
}

customElements.define("room-page", RoomPage);