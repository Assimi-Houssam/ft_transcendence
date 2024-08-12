export class ContanerBtnRoom extends HTMLElement {
    constructor(){
        super();
    }

    connectedCallback(){
        this.innerHTML = `
            <button class="ContainerButtonRoomBtn">
                <div class="Room">
                    <div class="RoomTypeGame">
                        <img src="../../../assets/images/ping.png" width="28px" height="28px">
                    </div>
                    <div class="RoomContent">
                        <div class="RoomContentCard">
                            <div class="RoomContentCard_flex">
                                <div class="RoomTeam">
                                    <p>2v2</p>
                                </div>
                                <div class="RoomName">
                                    <p>أبطال الديجيتال</p>
                                </div>
                                <div class="RoomTime">
                                    <p>5 min</p>
                                </div>
                            </div>
                            <div class="RoomContentCard_flex">
                                <div class="RoomPlayer">
                                    <p>3/4 Players</p>
                                </div>
                                <div class="RoomHosted">
                                    <p>hosted by <span style="color: var(--orchid)">miyako<span></p>
                                </div>
                                <div class="RoomUsers">
                                    <img src="../../../assets/images/p3.png" width="20px">
                                    <img src="../../../assets/images/p2.png" width="20px">
                                    <img src="../../../assets/images/p1.png" width="20px">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </button>
        `
    }
}

customElements.define('contaner-btn-room', ContanerBtnRoom);