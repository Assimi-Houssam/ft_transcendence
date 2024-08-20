import { ChatGame } from "./ChatGame.js";
import { ContainerGameOptions } from "./ContainerGameOptions/ContainerGameOptions.js";
import ParticipantsCard from "./ParticipantsCard.js";

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
            </div>
            <div class="content_line">
                <div class="line_x"></div>
            </div>
            <container-game-options></container-game-options>`;
        this.querySelector(".ContainerCardParticipants").appendChild(ParticipantsCard);
        this.querySelector(".ContainerCardParticipants").appendChild(new ChatGame());
    }
}

customElements.define("rooms-component", Rooms);