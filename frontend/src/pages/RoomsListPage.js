import { GameSelection } from "./GameSelectionMenu.js"
import { router } from "../routes/routes.js";
import { RoomInfoCard } from "../components/GameComponents/GameOnlineRoom/RoomInfoCard.js";
import { Loader } from "../components/Loading.js";
import ApiWrapper from "../utils/ApiWrapper.js";
import { RoomPage } from "./RoomPage.js";
import Toast from "../components/Toast.js";
import { PreloaderMini } from "../components/Loading.js";

export class RoomsListPage extends HTMLElement {
    constructor() {
        super();
        this.rooms = [];
        this.fetchLoop = null;
    }
    async fetchRooms() {
        const resp = await ApiWrapper.get("/rooms/list");
        if (!resp.ok) {
            console.log("an error has occured fetching");
            return;
        }
        const json = await resp.json();
        const rooms = JSON.parse(json);
        console.log("[Rooms fetched]:", rooms);
        this.rooms = [];
        for (let room of rooms) {
            this.rooms.push(new RoomInfoCard(room, true));
        }
    }
    async connectedCallback() {
        this.innerHTML = new Loader();
        await this.fetchRooms();
        this.innerHTML = `
            <div class="ContainerOnlineRoom">
                <div class="BtnCreateRoom">
                    <div class="OnlineRoomsContainer">
                        <h1>Online rooms</h1>
                        <preloader-mini></preloader-mini>
                    </div>
                    <button name="CreateRoom" id="Room" class="CreateRoomBtn">Create room</button>
                </div>
                <div class="content_line">
                    <div class="line_x"></div>
                </div>
                <div class="RoomListContainer"></div>
            </div>`;
        this.querySelector(".CreateRoomBtn").onclick = async () => {
            const req = await ApiWrapper.post("/rooms/create");
            if (req.status === 500) {
                Toast.error("An internal server error occured");
                return;
            }
            if (!req.ok) {
                const json = await req.json();
                Toast.error(json.detail);
                return;
            }
            const json = await req.json();
            const parsed = JSON.parse(json);
            console.log("room created!, room data:", parsed);
            router.navigate("/room/" + parsed.id, new RoomPage(parsed));
        }
        for (let room of this.rooms) {
            this.querySelector(".RoomListContainer").appendChild(room);
        }
        this.fetchLoop = setInterval(async () => {
            const loader = this.querySelector("preloader-mini");
            anime({
                targets: loader,
                opacity: [0, 1],
                duration: 250,
            });
            await this.fetchRooms();

            this.querySelector(".RoomListContainer").innerHTML = "";
            for (let room of this.rooms) {
                this.querySelector(".RoomListContainer").appendChild(room);
            }
            anime({
                targets: loader,
                opacity: [1, 0],
                duration: 5000,
            });
        }, 3000);
    }
    disconnectedCallback() {
        if (this.fetchLoop) {
            clearInterval(this.fetchLoop);
            this.fetchLoop = null;
        }
    }
}

customElements.define("rooms-list-page", RoomsListPage);