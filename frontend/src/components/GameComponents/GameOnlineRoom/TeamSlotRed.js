import { roomData } from "./Rooms.js";

export class TeamSlotRed extends HTMLElement {
    constructor(){
        super();
        this.teamSize = 1
        if(roomData.teamSize === "twoTeam")
            this.teamSize = 2;
    }

    connectedCallback(){
        this.innerHTML = `
                <div class="TeamSlot">
                    <button class="TeamSlotBtnRed">
                        <div class="TeamSlotBtnContentUser">
                            <div class="UserSelected">
                                <img src="../../../../assets/images/p1.png">
                                <p>rouali <span style="color: var(--orchid); font-size: 65% ;">(Host)</span></p>
                            </div>
                        </div>
                    </button>
                    ${this.teamSize != 1 ? (`
                    <button class="TeamSlotBtnRed InviteFriendsBtn" id="InviteFriendsBtn">
                        <div class="TeamSlotBtnContent">
                            <p>Empty Slot</p>
                            <img src="../../../../assets/icons/friends.png" height="20px">
                        </div>
                    </button>
                </div>
            `) : ""}
        `
    }
}

customElements.define("team-slot-red", TeamSlotRed);