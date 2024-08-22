import { ChatGame } from "./ChatGame.js";
import { ContainerGameOptions } from "./ContainerGameOptions/ContainerGameOptions.js";
import ParticipantsCard from "./ParticipantsCard.js";
import { Loader } from "../../Loading.js"

export let roomData = {
    teamSize: 1,
    time: 3,
    gameMode: "pong",
    roomName: "default"
}

export class RoomPage extends HTMLElement {
    constructor(){
        super();
        this.chat = new ChatGame();
    }
    async connectToRoom() {
        // ws connection here 
    }
    async connectedCallback() {
        this.innerHTML = new Loader();
        await this.connectToRoom();
        this.innerHTML = `
            <div>
                <div id="room-name_" >
                    <room-name></room-name>
                </div>
                <div class="content_line">
                    <div class="line_x"></div>
                </div>
                <room-info-card></room-info-card>
            </div>
            <div id="ContainerCardParticipants" class="ContainerCardParticipants">
            </div>
            <div class="content_line">
                <div class="line_x"></div>
            </div>
            <container-game-options></container-game-options>`;
        this.querySelector(".ContainerCardParticipants").appendChild(ParticipantsCard);
        this.querySelector(".ContainerCardParticipants").appendChild(this.chat);
    }
}

customElements.define("room-page", RoomPage);