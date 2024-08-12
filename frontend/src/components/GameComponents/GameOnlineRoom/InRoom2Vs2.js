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