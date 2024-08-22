import { GameSelection } from "../../../pages/GameSelectionMenu.js"
import { router } from "../../../routes/routes.js";
import { RoomInfoCard } from "./RoomInfoCard.js";
import { RoomPage } from "./RoomPage.js";
import { Loader } from "../../Loading.js";

export class RoomsListPage extends HTMLElement {
    constructor() {
        super();
        this.rooms = [];
    }
    async fetchRooms() {
        // fetch rooms from the server here and fill `this.rooms`
        // testing:
        for (let i = 1; i < 3; i++) {
            this.rooms.push(new RoomInfoCard(i, "test room " + i, "miyako", "pong", "1v1", [], "3", true));
        }
    }
    async connectedCallback() {
        this.innerHTML = new Loader();
        await this.fetchRooms();
        this.innerHTML = `
            <div class="ContainerOnlineRoom">
                <div class="BtnCreateRoom">
                    <h1>Online rooms</h1>
                    <button name="CreateRoom" id="Room">Create room</button>
                </div>
                <div class="content_line">
                    <div class="line_x"></div>
                </div>
                <div class="RoomListContainer"></div>
            </div>`;
        for (let room of this.rooms) {
            this.querySelector(".RoomListContainer").appendChild(room);
        }
    }
}

customElements.define("rooms-list-page", RoomsListPage);