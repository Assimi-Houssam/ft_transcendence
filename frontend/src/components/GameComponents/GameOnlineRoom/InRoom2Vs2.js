export class InRoom2Vs2 extends HTMLElement{
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
                    <div class="RedTeam">
                        <div class="TeamTitle">
                            <p>Red team</p>
                        </div>
                        <div class="TeamSlot">
                            <button class="TeamSlotBtnRed">
                                <div class="TeamSlotBtnContentUser">
                                    <div class="UserSelecte">
                                        <img src="../../../../assets/images/p1.png">
                                        <p>rouali <span style="color: var(--orchid); font-size: 65% ;">(Host)</span></p>
                                    </div>
                                </div>
                            </button>
                            <button class="TeamSlotBtnRed">
                                <div class="TeamSlotBtnContentUser">
                                    <div class="UserSelecte">
                                        <img src="../../../../assets/images/miyako.png">
                                        <p>Miyako</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div class="BlueTeam">
                        <div class="TeamTitle">
                            <p>Blue team</p>
                        </div>
                        <div class="TeamSlot">
                            <button class="TeamSlotBtnBlue">
                                <div class="TeamSlotBtnContentUser">
                                    <div class="UserSelecte">
                                        <img src="../../../../assets/images/p2.png">
                                        <p>silentzer</p>
                                    </div>
                                </div>
                            </button>
                            <button class="TeamSlotBtnBlue" id="InviteFriendsBtn">
                                <div class="TeamSlotBtnContent">
                                    <p>Empty Slot</p>
                                    <img src="../../../../assets/icons/friends.png" height="20px">
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `

        const InviteFriendsBtn = document.getElementById("InviteFriendsBtn");
        InviteFriendsBtn.addEventListener("click", () => {
            const element = document.querySelector("invite-friends");
            element.style.display = "block";
            anime({
                targets: ".ContainerPopupInviteFreiends_card",
                scale: [0, 1],
                opacity: [0, 1],
                duration: 500,
                easing: 'easeOutBack'
            });
        });

        var socket = new WebSocket('ws://localhost:8000/ws/game-selection/');

        socket.addEventListener('open', function (event) {
            socket.send('Hello Server!');
        });

        socket.addEventListener('message', function (event) {
            console.log('Message from server: ', event.data);
        });

        socket.addEventListener('close', function (event) {
            console.log('Server closed connection: ', event);
        });

        socket.addEventListener('error', function (event) {
            console.log('Error: ', event);
        });
    }

}

customElements.define("in-room-2vs2", InRoom2Vs2);