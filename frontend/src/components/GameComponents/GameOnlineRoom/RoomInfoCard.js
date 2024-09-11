import { router } from "../../../routes/routes.js";
import Toast from "../../Toast.js";
import { RoomPage } from "../../../pages/RoomPage.js";
import { langRoomCard } from "../../../utils/translate/gameTranslate.js";

export class RoomInfoCard extends HTMLElement {
    constructor(roomData, enabled = false) {
        super();
        this.roomData = roomData;
        this.enabled = enabled;
        this.lang = localStorage.getItem("lang");
    }
    update(roomData) {
        this.roomData = roomData;
        this.connectedCallback();
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
                                    <p id="SizePlayers">${this.roomData.users.length}/${this.roomData.teamSize === "1" ? "2" : "4"} ${langRoomCard[this.lang]["players"]}</p>
                                </div>
                                <div class="RoomHosted">
                                    <p>${langRoomCard[this.lang]["hostedBy"]} <span style="color: var(--orchid)">${this.roomData.host.username}<span></p>
                                </div>
                                <div class="RoomUsers">
                                ${this.roomData.users.map(user => `<img src="${user.pfp}" width="20px">`).join('')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </button>`;
            this.addEventListener("click", () => {
                if (!this.enabled)
                    return;
                if (this.roomData.users.length === Number(this.roomData.teamSize) * 2) {
                    Toast.error(langRoomCard[this.lang]["ErrorFull"]);
                    return;
                }
                if (this.roomData.started === "true") {
                    Toast.error(langRoomCard[this.lang]["ErrorStarted"]);
                    return;
                }
                router.navigate("/room/" + this.roomData.id, new RoomPage(this.roomData));
            });
    }
}

customElements.define('room-info-card', RoomInfoCard);