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
        this.querySelector(".room-info-container").appendChild(new RoomInfoCard(roomData.id, roomData.name, roomData.host, roomData.gamemode, roomData.teamSize, roomData.users, roomData.time));
        this.querySelector(".ContainerCardParticipants").appendChild(ParticipantsCard);
        this.querySelector(".ContainerCardParticipants").appendChild(this.chat);
        this.appendChild(new RoomOptions());
        this.addEventListener("gameModeChange", (evt) => {
            const newOptions = evt.detail;
            console.log("gamemode selected:", newOptions);
        });
        this.addEventListener("timeChange", (evt) => {
            const newOptions = evt.detail;
            console.log("time opt selected:", newOptions);
        });
        this.addEventListener("teamSizeChange", (evt) => {
            const newOptions = evt.detail;
            console.log("team size selected:", newOptions);
        });
        this.addEventListener("customizationChange", (evt) => {
            const newOptions = evt.detail;
            console.log("customization selected:", newOptions);
        });
    }
    disconnectedCallback() {
        // close the ws connection here
    }
}

customElements.define("room-page", RoomPage);