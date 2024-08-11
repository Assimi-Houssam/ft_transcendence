import { GameSelection } from "../../../pages/gameSelectionMenu/GameSelectionMenu.js"
import { InRoom1Vs1 } from "./InRoom1Vs1.js"
import { router } from "../../../routes/routes.js";


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
                <button class="ContainerButtonRoomBtn">
                    <div class="Room">
                        <div class="RoomTypeGame">
                            <img src="../../../assets/images/ping.png" width="28px" height="28px">
                        </div>
                        <div class="RoomContent">
                            <div class="RoomContentCard">
                                <div class="RoomContentCard_flex">
                                    <div class="RoomTeam">
                                        <p>2v2</p>
                                    </div>
                                    <div class="RoomName">
                                        <p>أبطال الديجيتال</p>
                                    </div>
                                    <div class="RoomTime">
                                        <p>5 min</p>
                                    </div>
                                </div>
                                <div class="RoomContentCard_flex">
                                    <div class="RoomPlayer">
                                        <p>3/4 Players</p>
                                    </div>
                                    <div class="RoomHosted">
                                        <p>hosted by <span style="color: var(--orchid)">miyako<span></p>
                                    </div>
                                    <div class="RoomUsers">
                                        <img src="../../../assets/images/p3.png" width="20px">
                                        <img src="../../../assets/images/p2.png" width="20px">
                                        <img src="../../../assets/images/p1.png" width="20px">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </button>
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
        const onlineRoomList = document.createElement("in-room-1vs1");

        onlineRoomList.classList.add("fade-in");

        this.innerHTML = "";
        this.appendChild(onlineRoomList);

        onlineRoomList.offsetWidth;

        onlineRoomList.classList.add("show");
    }
}

customElements.define("online-room-list", OnlineRoomList);