import { GameSelection } from "../../../pages/gameSelectionMenu/GameSelectionMenu.js"
// import { InRoom1Vs1 } from "./InRoom1Vs1.js"
import { router } from "../../../routes/routes.js";
import { ContanerBtnRoom } from "./ContainerBtnRoom.js";
import { Rooms } from "./Rooms.js";
// import { Rooms } from "./Rooms.js";


export class OnlineRoomList extends HTMLElement{
    constructor(){
        super()
        this.selectBtnCreateRoom;
    }

    connectedCallback(){
        this.innerHTML = `
            <div class="ContainerOnlineRoom">
                <div class="BtnCreateRoom">
                    <h1>Online rooms</h1>
                    <button name="CreateRoom" id="Room">Create room</button>
                </div>
                <div class="content_line">
                    <div class="line_x"></div>
                </div>
                <div class="ContainerButtonRoom" style="height: 45vh;">
                    <contaner-btn-room id="BtnJoinRoom"></contaner-btn-room>
                </div>
            </div>
        `

        const BtnRoom = this.querySelector("#Room");

        BtnRoom.addEventListener('click', () => {
            this.showRoom();
        });

        const CreateRoom = document.getElementById("Room");
        CreateRoom.addEventListener('click', () => {
            if (this.selectBtnCreateRoom?.id)
                this.selectBtnCreateRoom.id = "";
            CreateRoom.id = "createRoom";
            this.selectBtnCreateRoom = CreateRoom;
            console.log("select : ", this.selectBtnCreateRoom.name);
        })
    }

    showRoom() {
        const onlineRoomList = document.createElement("rooms-component");

        onlineRoomList.classList.add("fade-in");

        this.innerHTML = "";
        this.appendChild(onlineRoomList);

        onlineRoomList.offsetWidth;

        onlineRoomList.classList.add("show");
    }
}

customElements.define("online-room-list", OnlineRoomList);