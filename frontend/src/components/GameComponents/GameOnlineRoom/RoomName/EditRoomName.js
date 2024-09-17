import Toast from "../../../Toast.js";
import { RoomName } from "./RoomName.js";
import { langEditRoomName } from "../../../../utils/translate/gameTranslate.js";
import { langErrors } from "../../../../utils/translate/gameTranslate.js";

export class EditRoomName extends HTMLElement {
    constructor(name = "") {
        super();
        this.roomName = name;
        this.lang = localStorage.getItem("lang");
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="TitleRoom" id="TitleRoom">
                <input value="${this.roomName}" class="gradient-dark-bg gradient-dark-border" id="roomeNameInput" type="text" placeholder="${langEditRoomName[this.lang]["editRoomName"]}" >
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
            if (this.roomName.length > 25) {
                Toast.error(langErrors[this.lang]["ErrorNameLen"]);
                return;
            } else if (this.roomName === "") {
                Toast.error(langErrors[this.lang]["ErrorEmpty"]);
                return;
            }
            changeTitleRoom.replaceChildren(new RoomName(this.roomName));
            document.dispatchEvent(new CustomEvent("roomNameChange", { detail: this.roomName, bubbles: true }));
        };

        saveRoomNameBtn.addEventListener("click", saveRoomName);

        roomNameInput.addEventListener('keydown', (event) => {
            if (event.key === "Enter") {
                saveRoomName();
            }
        });
    }
}

customElements.define("edit-room-name", EditRoomName);