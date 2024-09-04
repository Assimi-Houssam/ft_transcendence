export class OfflineRoom2Vs2 extends HTMLElement {
    constructor(){
        super();
    }

    connectedCallback(){
        this.innerHTML = `
            <div class="ContainerUsersTeams2v2">
                <div class="TwoVsTwo">
                    <div class="usersTeams2v2">
                        <div class="player_">
                            <div>
                                <img src="../../../../assets/images/p1.png" width="25px">
                                <img src="../../../../assets/images/p5.png" width="25px">
                            </div>
                            <p>mamazzal133 & Player 1</p>
                        </div>
                        <div class="player_">
                            <img src="../../../../assets/images/p3.png" width="25px">
                            <img src="../../../../assets/images/p4.png" width="25px">
                            <p>Player 1 & Player 2</p>
                        </div>
                    </div>
                    <div class="line_tourn">
                        <div class="toor">
                            <img src="../../../../assets/images/line_G.png" width="42px">
                            <div class="linee">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="TwoVsTwo">
                    <div class="usersTeams2v2">
                        <div class="player_">
                            <img src="../../../../assets/images/p2.png" width="25px">
                            <img src="../../../../assets/images/p5.png" width="25px">
                            <p>Player 3 & Player 4</p>
                        </div>
                        <div class="player_">
                            <img src="../../../../assets/images/p1.png" width="25px">
                            <img src="../../../../assets/images/p3.png" width="25px">
                            <p>Player 5 & Player 6</p>
                        </div>
                    </div>
                    <div class="line_tourn">
                        <div class="toor">
                            <img src="../../../../assets/images/line_G.png" width="42px">
                            <div class="linee">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ContainerUsersTeams2v2">
                <div class="TwoVsTwo">
                    <div class="usersTeams2v2_final">
                        <div class="player_">
                        </div>
                        <div class="player_">
                        </div>
                    </div>
                    <div class="line_tourn">
                        <img src="../../../../assets/images/line_tourn.png" width="130px">
                    </div>
                </div>
            </div>
        `
    }
}

customElements.define("offline-room-2vs2", OfflineRoom2Vs2);