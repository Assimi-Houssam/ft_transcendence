export class OfflineRoom2Vs1 extends HTMLElement {
    constructor(){
        super();
    }

    connectedCallback(){
        this.innerHTML = `
            <div class="ContainerUsersTeams2v2">
                <div class="TwoVsTwo">
                    <div class="usersTeams2v2">
                        <div class="player_">
                            <img src="../../../../assets/images/p1.png" width="25px">
                            <p>rouali <span>(host)</span></p>
                        </div>
                        <div class="player_">
                            <img src="../../../../assets/images/p2.png" width="25px">
                            <p>Player 1</p>
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
                            <img src="../../../../assets/images/p1.png" width="25px">
                            <p>rouali <span>(host)</span></p>
                        </div>
                        <div class="player_">
                            <img src="../../../../assets/images/p2.png" width="25px">
                            <p>Player 1</p>
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

customElements.define("offline-room-2vs1", OfflineRoom2Vs1);