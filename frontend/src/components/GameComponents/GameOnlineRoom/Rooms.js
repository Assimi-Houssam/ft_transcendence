import { ChatGame } from "./ChatGame.js";
import { ContainerGameOptions } from "./ContainerGameOptions/ContainerGameOptions.js";
import { RoomCard } from "./RoomCard.js";

export let roomData = {
    teamSize : 1,
    time : 3,
    gameMood : "pong",
    roomName : "default"
}

export class Rooms extends HTMLElement {
    constructor(){
        super();
    }

    connectedCallback(){
        this.innerHTML = `
            <div>
                <div id="room-name_" >
                    <room-name></room-name>
                </div>
                <div class="content_line">
                    <div class="line_x"></div>
                </div>
                <contaner-btn-room></contaner-btn-room>
            </div>
            <invite-friends style="display: none;"></invite-friends>
            <div id="ContainerCardParticipants" class="ContainerCardParticipants">
                <room-card></room-card>
                <chat-game></chat-game>
            </div>
            <div class="content_line">
                <div class="line_x"></div>
            </div>
            <container-game-options></container-game-options>
        `
    }
}

customElements.define("rooms-component", Rooms);