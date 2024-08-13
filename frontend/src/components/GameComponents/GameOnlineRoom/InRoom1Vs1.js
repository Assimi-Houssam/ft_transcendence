// import { InRoom2Vs2 } from "./InRoom2Vs2.js"
// import { ContainerGameOptions } from "./ContainerGameOptions/ContainerGameOptions.js";

export class InRoom1Vs1 extends HTMLElement {
    constructor(){
        super();
    }

    connectedCallback(){
        this.innerHTML = `
            <div class="CardParticipants">
                <div style="padding: 18px">
                    <h4>Participants</h4>
                </div>
                <div class="content_line" style="width: 50%;">
                    <div class="line_x" style="background: linear-gradient(to right, transparent, #E0E0E0, transparent); height: 0.5px; width: 100%;"></div>
                </div>
                <div class="ParticipantsTeam">
                    <div class="TeamOneToOne">
                        <div class="TeamOneToOneHost">
                            <button class="TeamBtnUserHost">
                                <div class="UserHost">
                                    <img src="../../../../assets/images/p1.png">
                                    <p>rouali <span style="color: var(--orchid); font-size: 65% ;">(Host)</span></p>
                                </div>
                            </button>
                        </div>
                        <div class="vs">
                            <p>Vs</p>
                        </div>
                        <div class="TeamOneToOneHost">
                            <button class="TeamSlotBtn" id="InviteFriendsBtn">
                                <div class="TeamSlotBtnInvit">
                                    <p>Empty Slot</p>
                                    <img src="../../../../assets/icons/friends.png" height="20px">
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    `
    
    }
}

customElements.define("in-room-1vs1", InRoom1Vs1);