import { EditRoomName } from "./EditRoomName.js";
import { roomData } from "../RoomPage.js";
export class RoomName extends HTMLElement {
    constructor(name = "Room Name") {
        super();
        this.roomeName = name;
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="TitleRoom" id="TitleRoom">
                <h2 id="roomeNameValue" value="${this.roomeName}">${this.roomeName}</h2>
                <button name="editer" id="changeTitleBtn"></button>
            </div>
        `;

        const changeTitleRoom = document.getElementById("room-name_");
        const changeTitleBtn = document.getElementById("changeTitleBtn");

        changeTitleBtn.addEventListener("click", () => {
            changeTitleRoom.replaceChildren(new EditRoomName(this.roomeName));
        });

    }
}

customElements.define("room-name", RoomName);