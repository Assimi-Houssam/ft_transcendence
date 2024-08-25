export class OfflineRoom1Vs1 extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="OfflineRoomTeams">
                <div class="usersTeams">
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
                    <img src="../../../../assets/images/line_tourn.png" width="155px">
                </div>
            </div>
        `
    }
}

customElements.define("offline-room-1vs1", OfflineRoom1Vs1);