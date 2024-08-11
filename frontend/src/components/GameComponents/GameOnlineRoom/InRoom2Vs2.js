import { ChatGame } from "./ChatGame.js";
import { InviteFriends } from "./InviteFriends.js";

export class InRoom2Vs2 extends HTMLElement{
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
            <invite-friends style="display: none;"></invite-friends>
            <div class="ContainerCardParticipants">
                <div class="CardParticipants">
                    <div style="padding: 18px">
                        <h4>Participants</h4>
                    </div>
                    <div class="content_line" style="width: 50%;">
                    <div class="line_x" style="background: linear-gradient(to right, transparent, #E0E0E0, transparent); height: 0.5px; width: 100%;"></div>
                    </div>
                    <div class="ParticipantsTeam">
                    <div style="width: 100%;">
                            <p style="padding:20px;">Red Team</p>
                            <div class="ContainerParticipantsTeam">
                                <div class="ParticipantsTeamUserRed">
                                    <div class="ParticipantsTeamUserImg">
                                        <div class="ParticipantsHost">
                                            <img src="../../../assets/images/amine.png" width="35px">
                                            <p style="font-size: 13px;">mamazzal133<span style="color: var(--orchid)"> (host)</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div class="ParticipantsTeamUserRed">
                                    <div class="ParticipantsTeamUserImg">
                                        <div class="ParticipantsHost">
                                            <img src="../../../assets/images/amine.png" width="35px">
                                            <p style="font-size: 13px;">mamazzal133<span style="color: var(--orchid)"> (host)</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="width: 100%;">
                            <p style="padding:20px;">Blue Team</p>
                            <div class="ContainerParticipantsTeam">
                                <div class="ParticipantsTeamUserBlue">
                                    <div class="ParticipantsTeamUserImg">
                                        <div class="ParticipantsHost">
                                            <img src="../../../assets/images/ilyass.png" width="35px">
                                            <p style="font-size: 13px;">miyako</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ContainerBtnSlot">
                            <button id="InviteFriendsBtn">
                                <div class="ContainerBtnSlot">
                                    <p>Empty slot</p>
                                </div>
                                <div class="ContainerBtnSlot_Img">
                                    <img src="../../../assets/icons/friends.png" width="15px" height="15px">
                                </div>
                            </button>
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
    }

}

customElements.define("in-room-2vs2", InRoom2Vs2);