import Toast from "../../../Toast.js";
import { RoomName } from "./RoomName.js";
import { roomData } from "../Rooms.js";

export class EditRoomName extends HTMLElement {
    constructor(name = "") {
        super();
        this.roomName = name;
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="TitleRoom" id="TitleRoom">
                <input value="${this.roomName}" class="gradient-dark-bg gradient-dark-border" id="roomeNameInput" type="text" placeholder="edit room name" >
                <button id="saveRoomName">
                    <img src="../../../../../assets/icons/check.png" />
                </button>
            </div>
        `;

        const roomNameInput = document.getElementById("roomeNameInput");

        roomNameInput.addEventListener('input', (e) => {
            this.roomName = e.target.value;
        });

        const saveRoomNameBtn = document.getElementById("saveRoomName");
        const changeTitleRoom = document.getElementById("room-name_");

        const saveRoomName = () => {
            if (this.roomName.length > 15) {
                Toast.error("You can’t set a name more than 15 characters");
                return;
            } else if (this.roomName === "") {
                Toast.error("You can’t set an empty name");
                return;
            }
            roomData.roomName = this.roomName;
            const RoomTitleName  = document.getElementById("RoomTitleName");
            RoomTitleName.innerHTML = this.roomName;
            changeTitleRoom.replaceChildren(new RoomName(this.roomName));
        };

        saveRoomNameBtn.addEventListener("click", saveRoomName);

        roomNameInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                saveRoomName();
            }
        });
    }
}

customElements.define("edit-room-name", EditRoomName);