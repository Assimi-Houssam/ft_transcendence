import { TeamSlotBlue } from "./TeamSlotBlue.js";
import { TeamSlotRed } from "./TeamSlotRed.js";
import { ParticipantEntry, EmptySlot } from "./ParticipantEntry.js";


export class RoomCard extends HTMLElement {
  constructor(teamSize=1) {
    super();
    this.teamSize = teamSize;
    this.blueTeam = {};
    this.redTeam = {};
  }

  connectedCallback() {
    this.innerHTML = `
            <div class="CardParticipants">
            <div class="ParticipantsText">
                <h4>Participants</h4>
            </div>
            <div class="ParticipantsTeam">
                <div class="RedTeam">
                   ${
                     this.teamSize != 1 ? (`
                        <div class="TeamTitle">
                            <p>Red team</p>
                        </div>
                   `) : ""}
                </div>
                ${this.teamSize  === 1 ? (`
                    <div class="vs">
                        <p>vs</p>
                    </div>
                `) : ""}
                <div class="BlueTeam">
                    ${
                      this.teamSize != 1 ?( `
                        <div class="TeamTitle">
                            <p>Blue team</p>
                        </div>
                    `): ""}
                </div>
            </div>
        </div>
        `;
        this.querySelector(".RedTeam").appendChild(new ParticipantEntry("silentzer", "../../../../assets/images/p1.png", "../../../../assets/images/img.png", "blue", true));
        this.querySelector(".BlueTeam").appendChild(new EmptySlot());
        // const InviteFriendsBtns = document.getElementsByClassName("InviteFriendsBtn");
        // for (let i = 0; i < InviteFriendsBtns.length; i++) {
        //     InviteFriendsBtns[i].addEventListener("click", (e) => {
        //         const element = document.querySelector("invite-friends");
        //         const usersCardInvite = element.getElementsByClassName("InviteFreindsPopup_content");
        //         for (let g = 0; g < usersCardInvite.length; g++) {
        //             usersCardInvite[g].querySelector("button").onclick =  (e) => {
        //                 if (InviteFriendsBtns[i]) {
        //                     InviteFriendsBtns[i].innerHTML  = `
        //                         <div class="TeamSlotBtnContentUser">
        //                             <div class="UserSelected">
        //                                 <img src="../../../../assets/images/p1.png">
        //                                 <p>rouali <span style="color: var(--orchid); font-size: 65% ;">(Host)</span></p>
        //                             </div>
        //                         </div>
        //                 `
        //                 }
        //             }
        //         }
        //         element.style.display = "block";
        //     })
        // }
  }
}

customElements.define("room-card", RoomCard);
