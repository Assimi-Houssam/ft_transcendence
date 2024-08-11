import { InRoom2Vs2 } from "./InRoom2Vs2.js"
import { ContainerGameOptions } from "./ContainerGameOptions/ContainerGameOptions.js";

export class InRoom1Vs1 extends HTMLElement {
    constructor(){
        super();
    }

    connectedCallback(){
        this.innerHTML = `
            <div>
                <div id="room-name_" >
                    <room-name></room-name>
                </div>
                <div class="content_line">
                    <div class="line_x"></div>
                </div>
                <button class="ContainerButtonRoomBtn" id="Room">
                    <div class="Room">
                        <div class="RoomTypeGame">
                            <img src="../../../assets/images/ping.png" width="28px" height="28px">
                        </div>
                        <div class="RoomContent">
                            <div class="RoomContentCard">
                                <div class="RoomContentCard_flex">
                                    <div class="RoomTeam">
                                        <p>1v1</p>
                                    </div>
                                    <div class="RoomName">
                                        <p>أبطال الديجيتال</p>
                                    </div>
                                    <div class="RoomTime">
                                        <p>5 rounds</p>
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
                                        <img src="../../../assets/images/p2.png" width="20px">
                                        <img src="../../../assets/images/p1.png" width="20px">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </button>
            </div>
            <div class="ContainerCardParticipants">
                <div class="CardParticipants">
                    <div style="padding: 18px">
                        <h4>Participants</h4>
                    </div>
                    <div class="content_line" style="width: 50%;">
                        <div class="line_x" style="background: linear-gradient(to right, transparent, #E0E0E0, transparent); height: 0.5px; width: 100%;"></div>
                    </div>
                    <div class="ParticipantsTeam">
                        <div class="ParticipantsTeamBackdrop">
                            <div class="ParticipantsHost">
                                <img src="../../../assets/images/amine.png" width="35px">
                                <p style="font-size: 13px;">mamazzal133<span style="color: var(--orchid)"> (host)</span></p>
                            </div>
                        </div>
                        <p>VS</p>
                        <div class="ParticipantsTeamBackdrop">
                            <div class="ParticipantsHost">
                                <img src="../../../assets/images/ilyass.png" width="35px">
                                <p style="font-size: 13px;">miyako</p>
                            </div>
                        </div>
                    </div>
                </div>
                <chat-game></chat-game>
            </div>
            <div class="content_line">
                <div class="line_x"></div>
            </div>
            <container-game-options></container-game-options>
            <div class="ContinerFooter">
                <div>
                    <p class="ContinerFooter_reminder">Unable to start the game: not enough players in the room</p>
                </div>
                <div class="BtnStartGame">
                    <button type="button" id="BtnStartGame">Start game!</button>
                </div>
            </div>
    `
    const BtnStartGame = this.querySelector("#BtnStartGame");

    BtnStartGame.addEventListener('click', () =>{
        this.StartGame();
    });
    }

    StartGame() {
        const onlineRoomList = document.createElement("in-room-2vs2");
        onlineRoomList.classList.add("fade-in");
        this.replaceChildren(onlineRoomList);
        onlineRoomList.classList.add("show");
    }
}

customElements.define("in-room-1vs1", InRoom1Vs1);