export class RoomCard extends HTMLElement {
  constructor(teamSize=1) {
    super();
    this.teamSize = teamSize;
  }

  connectedCallback() {
    this.innerHTML = `
            <div class="CardParticipants">
            <div style="padding: 18px">
                <h4>Participants</h4>
            </div>
            <div class="content_line" style="width: 50%;">
                <div class="line_x" style="background: linear-gradient(to right, transparent, #E0E0E0, transparent); height: 0.5px; width: 100%;"></div>
            </div>
            <div class="ParticipantsTeam">
                <div class="RedTeam">
                   ${
                     this.teamSize != 1 ? (`
                        <div class="TeamTitle">
                            <p>Red team</p>
                        </div>
                   `) : ""}
                    <div class="TeamSlot">
                        <button class="TeamSlotBtnRed">
                            <div class="TeamSlotBtnContentUser">
                                <div class="UserSelecte">
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
                        `) : ""}
                    </div>
                </div>
                ${this.teamSize  === 1 ? (`
                    <div class="vs">
                        <p>Vs</p>
                    </div>
                `) : ""}
                <div class="BlueTeam">
                    ${
                      this.teamSize != 1 ?( `
                        <div class="TeamTitle">
                            <p>Blue team</p>
                        </div>
                    `): ""}
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
                        `) : ""}
                    </div>
                </div>
            </div>
        </div>
        `;

        const InviteFriendsBtns = document.getElementsByClassName("InviteFriendsBtn");
        for (let i = 0; i < InviteFriendsBtns.length; i++) {
            InviteFriendsBtns[i].addEventListener("click", (e) => {
                const element = document.querySelector("invite-friends");
                const usersCardInvit = element.getElementsByClassName("InviteFreindsPopup_content");
                for (let g = 0; g < usersCardInvit.length; g++) {
                    usersCardInvit[g].querySelector("button").onclick =  (e) => {
                        if (InviteFriendsBtns[i]) {
                            InviteFriendsBtns[i].innerHTML  = `
                                <div class="TeamSlotBtnContentUser">
                                    <div class="UserSelecte">
                                        <img src="../../../../assets/images/p1.png">
                                        <p>rouali <span style="color: var(--orchid); font-size: 65% ;">(Host)</span></p>
                                    </div>
                                </div>
                        `
                        }
                    }
                }
                element.style.display = "block";
                anime({
                    targets: ".ContainerPopupInviteFreiends_card",
                    scale: [0, 1],
                    opacity: [0, 1],
                    duration: 500,
                    easing: 'easeOutBack'
                });
            })
        }
  }
}

customElements.define("room-card", RoomCard);
