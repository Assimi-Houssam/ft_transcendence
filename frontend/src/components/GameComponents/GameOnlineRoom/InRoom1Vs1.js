// import { InRoom2Vs2 } from "./InRoom2Vs2.js"
// import { ContainerGameOptions } from "./ContainerGameOptions/ContainerGameOptions.js";

export class InRoom1Vs1 extends HTMLElement {
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
                    <div class="ParticipantsTeamBackdrop">
                        <div class="ParticipantsHost">
                            <img src="../../../assets/images/amine.png" width="35px">
                            <p style="font-size: 13px;">mamazzal133<span style="color: var(--orchid)"> (host)</span></p>
                        </div>
                    </div>
                    <p>VS</p>
                    <div class="ParticipantsTeamBackdrop">
                        <div class="ParticipantsHost">
                            <img src="../../../assets/images/ilyass.png" width="35px">
                            <p style="font-size: 13px;">miyako</p>
                        </div>
                    </div>
                </div>
            </div>
    `
    
    }
}

customElements.define("in-room-1vs1", InRoom1Vs1);