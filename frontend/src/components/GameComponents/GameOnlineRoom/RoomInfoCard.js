
// should be RoomInfoCard
export class RoomInfoCard extends HTMLElement {
    constructor(roomId, roomName, roomHost, roomGameMode, roomTeamSize, roomUsers, roomTime, enabled = false) {
        super();
        this.roomId = roomId; // backend maybe? if its not used then we'll remove it
        this.roomName = roomName;
        this.roomHost = roomHost;
        this.roomGameMode = roomGameMode;
        this.roomTeamSize = roomTeamSize;
        this.roomUsers = roomUsers;
        this.roomTime = roomTime;
        this.roomLenT = 1; // testing, should be this.roomUsers.length
        this.enabled = enabled;
    }
    connectedCallback() {
        this.innerHTML = `
            <button class="RoomListContainerBtn">
                <div class="Room">
                    <div class="RoomTypeGame">
                        <img id="RoomTeamGameType" src="${this.roomGameMode === "pong" ? "../../../assets/images/pong.png" : "../../../assets/images/hockey.png"}" width="28px" height="28px">
                    </div>
                    <div class="RoomContent">
                        <div class="RoomContentCard">
                            <div class="RoomContentCard_flex">
                                <div class="RoomTeam">
                                    <p id="RoomTeamSize">${this.roomTeamSize}</p>
                                </div>
                                <div class="RoomName">
                                    <p id="RoomTitleName">${this.roomName}</p>
                                </div>
                                <div class="RoomTime">
                                    <p id="RoomTeamTime">${this.roomTime} min</p>
                                </div>
                            </div>
                            <div class="RoomContentCard_flex">
                                <div class="RoomPlayer">
                                    <p id="SizePlayers">${this.roomLenT}/${this.roomTeamSize === "1v1" ? "2" : "1"} Players</p>
                                </div>
                                <div class="RoomHosted">
                                    <p>hosted by <span style="color: var(--orchid)">${this.roomHost}<span></p>
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
                console.log("clicked!, should redirect to /rooms/roomId maybe?");
            });
    }
}

customElements.define('room-info-card', RoomInfoCard);