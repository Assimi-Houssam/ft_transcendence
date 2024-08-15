import { roomData } from "./Rooms.js";

export class TeamSlotBlue extends HTMLElement {
    constructor(){
        super();
        this.teamSize = 1;
        if(roomData.teamSize === "twoTeam")
            this.teamSize = 2;
    }

    connectedCallback(){
        this.innerHTML = `
                <div class="TeamSlot">
                    <button class="TeamSlotBtnBlue InviteFriendsBtn" id="InviteFriendsBtn">
                        <div class="TeamSlotBtnContent">
                            <p>Empty Slot</p>
                            <img src="../../../../assets/icons/friends.png" height="20px">
                        </div>
                    </button>
                    ${this.teamSize > 1 ? (`
                    <button  class="TeamSlotBtnBlue InviteFriendsBtn" id="InviteFriendsBtn">
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

customElements.define("team-slot-blue", TeamSlotBlue);