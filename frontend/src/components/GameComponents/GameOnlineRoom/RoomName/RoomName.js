import { EditRoomName } from "./EditRoomName.js";

export class RoomName extends HTMLElement {
    constructor(name = "أبطال الديجيتال") {
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
            anime({
                targets: this,
                opacity: [1, 0],
                duration: 500,
                easing: 'easeOutQuad',
                complete: () => {
                    changeTitleRoom.replaceChildren(new EditRoomName(this.roomeName));
                    anime({
                        targets: changeTitleRoom.firstElementChild,
                        opacity: [0, 1],
                        duration: 500,
                        easing: 'easeInQuad'
                    });
                }
            });
        });
    }
}

customElements.define("room-name", RoomName);