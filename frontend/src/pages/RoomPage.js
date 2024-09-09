import { ChatGame } from "../components/GameComponents/GameOnlineRoom/ChatGame.js";
import { ParticipantsCard } from "../components/GameComponents/GameOnlineRoom/ParticipantsCard.js";
import { ParticipantEntry } from "../components/GameComponents/GameOnlineRoom/ParticipantEntry.js";
import { Loader } from "../components/Loading.js"
import { RoomInfoCard } from "../components/GameComponents/GameOnlineRoom/RoomInfoCard.js";
import { RoomOptions } from "../components/GameComponents/GameOnlineRoom/RoomOptions.js";
import { RoomName } from "../components/GameComponents/GameOnlineRoom/RoomName/RoomName.js";
import ApiWrapper from "../utils/ApiWrapper.js";
import userInfo from "../utils/services/userInfo.services.js";
import { router } from "../routes/routes.js";
import Toast from "../components/Toast.js";
import { getUserInfo } from "../utils/utils.js";
import { GamePage } from "../components/GamePlay/GamePage.js";

// todo: take care of this
class RoomPageFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="ContainerFooter">
                <div>
                    <p style="display:none;" class="ContainerFooter_reminder">Unable to start the game: not enough players in the room</p>
                </div>
                <div class="BtnStartGame">
                    <button type="button" id="BtnStartGame">Start game!</button>
                </div>
            </div>`;
    }
}

customElements.define("room-page-footer", RoomPageFooter);

export class RoomPage extends HTMLElement {
    constructor(roomData) {
        super();
        if (!roomData) {
            Toast.error("The room doesnt exist anymore");
            router.navigate("/home");
            return;
        }
        this.roomData = roomData;
        this.roomId = roomData.id;
        this.chat = new ChatGame();
        this.infoCard = new RoomInfoCard(this.roomData);
        this.userInfo = null;
        this.socket = null;
        getUserInfo().then((userinfo) => {
            this.userInfo = userinfo;
            this.participantsCard = new ParticipantsCard(roomData, this.roomData.host.id !== userinfo.id);
            this.roomOptions = new RoomOptions(this.roomData, this.roomData.host.id !== userinfo.id);
        });
    }
    async connectToRoom() {
        this.socket = new WebSocket("ws://localhost:8000/ws/room/" + this.roomId + "/");
        this.socket.onclose = async (evt) => {
            console.log("socket connection CLOSED, error code:", evt.code, " reason: ", evt.reason);
            if (evt.code === 4001) {
                Toast.success("Game started!");
                this.user = await getUserInfo();
                router.navigate("/game/" + this.roomId + "/", new GamePage(this.roomData, this.user));
                return;
            }
            if (evt.code === 4002) {
                Toast.error("You've been kicked from the room");
                router.navigate("/rooms");
                return;
            }
            Toast.error("You have been disconnected from the room");
            router.navigate("/rooms");
        }
    
        const openPromise = new Promise(resolve => {
            this.socket.onopen = (evt) => { resolve(); };
        });
    
        this.socket.addEventListener("message", (event) => {
            const parsed_json = JSON.parse(event.data);
            if (parsed_json.hasOwnProperty("message") && parsed_json.message == "start_game") {
                const room_data_s = parsed_json.room_data;
                console.log(room_data_s);
                return;
            }
            if (parsed_json.hasOwnProperty("room_data")) {
                this.roomData = parsed_json.room_data;
                this.participantsCard.update(this.roomData);
                this.infoCard.update(this.roomData);
                this.roomOptions.update(this.roomData);
                this.querySelector(".room-name_").replaceChildren(new RoomName(this.roomData.name, this.roomData.host.id !== this.userInfo.id));
                return;
            }
        });
        await openPromise;
    }
    async connectedCallback() {
        this.innerHTML = new Loader().outerHTML;
        await this.connectToRoom();
        this.innerHTML = `
            <div class="room-info-container">
                <div id="room-name_" class="room-name_">
                </div>
                <div class="content_line">
                    <div class="line_x"></div>
                </div>
            </div>
            <div id="ContainerCardParticipants" class="ContainerCardParticipants">
            </div>
            <div class="content_line">
                <div class="line_x"></div>
            </div>`;
        this.querySelector(".room-name_").appendChild(new RoomName(this.roomData.name));
        this.querySelector(".room-info-container").appendChild(this.infoCard);
        this.querySelector(".ContainerCardParticipants").appendChild(this.participantsCard);
        this.querySelector(".ContainerCardParticipants").appendChild(this.chat);
        this.appendChild(this.roomOptions);
        this.appendChild(new RoomPageFooter());
        this.addEventListener("gameModeChange", (evt) => {
            this.socket.send(JSON.stringify({"type": "gamemode_change", "message": evt.detail}));
        });
        this.addEventListener("timeChange", (evt) => {
            this.socket.send(JSON.stringify({"type": "time_change", "message": evt.detail}));
        });
        this.addEventListener("teamSizeChange", (evt) => {
            this.socket.send(JSON.stringify({"type": "team_size_change", "message": evt.detail}));
        });
        this.addEventListener("customizationChange", (evt) => {
            this.socket.send(JSON.stringify({"type": "customization_change", "message": evt.detail}));
            this.infoCard.update(this.roomData);
        });
        this.addEventListener("participantsSwitch", (evt) => {
            this.socket.send(JSON.stringify({"type": "team_change", "message": {"redTeam": evt.detail.redTeam, "blueTeam": evt.detail.blueTeam}}));
        });
        this.addEventListener("participantkick", (evt) => {
            this.socket.send(JSON.stringify({"type": "team_kick", "message": {"user": evt.detail.getUserInfo()}}));
        });
        // im so sick of this, i dont care anymore
        document.addEventListener("roomNameChange", (evt) => {
            this.socket.send(JSON.stringify({"type": "room_name_change", "message": evt.detail}));
        });
        this.querySelector(".BtnStartGame").onclick = (e) => {
            console.log("game start! | room data: ", this.roomData);
            // todo: check if the host is the same as the current logged in user
            this.socket.send(JSON.stringify({"type": "start_game", "message": ""}));
        }
    }
    disconnectedCallback() {
        this.socket.close();
    }
}

customElements.define("room-page", RoomPage);