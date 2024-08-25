import { router } from "../../../routes/routes.js";

export class RoomInfoCard extends HTMLElement {
    constructor(roomData, enabled = false) {
        super();
        this.roomData = roomData;
        this.roomLenT = 1; // testing, should be this.roomUsers.length
        this.enabled = enabled;
    }
    // temporary, will be deleted 
    participantJoined() {
        this.roomLenT++;
        this.connectedCallback();
    }
    participantLeft() {
        this.roomLenT--;
        this.connectedCallback();
    }
    update(roomData) {
        this.roomData = roomData;
        this.connectedCallback();
        console.log("okay");
    }
    connectedCallback() {
        this.innerHTML = `
            <button class="RoomListContainerBtn">
                <div class="Room">
                    <div class="RoomTypeGame">
                        <img id="RoomTeamGameType" src="${this.roomData.gamemode === "pong" ? "../../../assets/images/pong.png" : "../../../assets/images/hockey.png"}" width="28px" height="28px">
                    </div>
                    <div class="RoomContent">
                        <div class="RoomContentCard">
                            <div class="RoomContentCard_flex">
                                <div class="RoomTeam">
                                    <p id="RoomTeamSize">${this.roomData.teamSize === "1" ? "1v1" : "2v2"}</p>
                                </div>
                                <div class="RoomName">
                                    <p id="RoomTitleName">${this.roomData.name}</p>
                                </div>
                                <div class="RoomTime">
                                    <p id="RoomTeamTime">${this.roomData.time} min</p>
                                </div>
                            </div>
                            <div class="RoomContentCard_flex">
                                <div class="RoomPlayer">
                                    <p id="SizePlayers">${this.roomData.users.length}/${this.roomData.teamSize === "1" ? "2" : "4"} Players</p>
                                </div>
                                <div class="RoomHosted">
                                    <p>hosted by <span style="color: var(--orchid)">${this.roomData.host}<span></p>
                                </div>
                                <div class="RoomUsers">
                                    <img src="../../../assets/images/p1.png" width="20px">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </button>`;
            this.addEventListener("click", () => {
                if (!this.enabled)
                    return;
                // redirect to the room here
                router.navigate("/room/" + this.roomData.id);
                console.log("clicked!, should redirect to /rooms/roomId maybe?");
            });
    }
}

customElements.define('room-info-card', RoomInfoCard);