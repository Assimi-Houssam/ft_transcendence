import { GameSelection } from "../../../pages/GameSelectionMenu.js"
import { router } from "../../../routes/routes.js";
import { RoomInfoCard } from "./RoomInfoCard.js";
import { Rooms } from "./Rooms.js";


export class OnlineRoomList extends HTMLElement {
    constructor() {
        super();
        this.rooms = [];
    }
    fetchRooms() {
        // fetch rooms from the server here
        
        // testing:
        
    }
    connectedCallback() {
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
                
        this.querySelector(".RoomListContainer").appendChild(new RoomInfoCard(1, "test room", "miyako", "pong", "1v1", [], "3", true));
        const BtnRoom = this.querySelector("#Room");

        BtnRoom.addEventListener('click', () => { this.showRoom(); });

        const CreateRoom = document.getElementById("Room");
        CreateRoom.addEventListener('click', () => {
            if (this.selectBtnCreateRoom?.id)
                this.selectBtnCreateRoom.id = "";
            CreateRoom.id = "createRoom";
            this.selectBtnCreateRoom = CreateRoom;
            console.log("select : ", this.selectBtnCreateRoom.name);
        })

        const BtnJoinRoom = document.getElementById("BtnJoinRoom");
        BtnJoinRoom.addEventListener('click', () => {
            const parrentElemnt = document.querySelector("online-room-list");
            parrentElemnt.innerHTML = "<rooms-component></rooms-component>"
        });
    }

    showRoom() {
        const onlineRoomList = document.createElement("rooms-component");

        onlineRoomList.classList.add("fade-in");

        this.innerHTML = "";
        this.appendChild(onlineRoomList);

        onlineRoomList.classList.add("show");
    }
}

customElements.define("online-room-list", OnlineRoomList);