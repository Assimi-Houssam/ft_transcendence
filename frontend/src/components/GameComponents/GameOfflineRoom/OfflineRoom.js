import { OfflineRoom2Vs2 } from "./Rooms/OfflineRoom2Vs2.js";

export class OfflineRoom extends HTMLElement{
    constructor(){
        super();
    }
    connectedCallback(){
        this.innerHTML = `
            <div>
                <div class="OfflineTournamentTitle">
                    <h2>Offline tournament</h2>
                </div>
                <div class="content_line">
                    <div class="line_x"></div>
                </div>
            </div>
            <div class="ContainerCardOffline">
                <offline-room-2vs2></offline-room-2vs2>
            </div>
            <div class="content_line">
                <div class="line_x"></div>
            </div>
            <container-game-options></container-game-options>
    `
    }
}

customElements.define("offline-room", OfflineRoom);