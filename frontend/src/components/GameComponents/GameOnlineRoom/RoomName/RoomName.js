import { EditRoomName } from "./EditRoomName.js";

export class RoomName extends HTMLElement {
    constructor(name, locked = false) {
        super();
        this.roomName = name;
        this.locked = locked;
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="TitleRoom" id="TitleRoom">
                <h2 value="${this.roomName}">${this.roomName}</h2>
                ${!this.locked ? `<button name="edit" id="changeTitleBtn"></button>` : ""}
            </div>`;

        const changeTitleRoom = document.getElementById("room-name_");
        const changeTitleBtn = document.getElementById("changeTitleBtn");
        if (this.locked)
            return;
        changeTitleBtn.addEventListener("click", () => {
            changeTitleRoom.replaceChildren(new EditRoomName(this.roomName));
        });
    }
}

customElements.define("room-name", RoomName);