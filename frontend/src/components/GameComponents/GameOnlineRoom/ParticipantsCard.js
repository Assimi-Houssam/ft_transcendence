import { ParticipantEntry, EmptySlot } from "./ParticipantEntry.js";

export class ParticipantsCard extends HTMLElement {
    constructor(roomData) {
        super();
        this.teamSize = Number(roomData.teamSize);
        this.hostId = roomData.host.id;
        const redTeam = [];
        const blueTeam = [];
        console.log(`[pp::ctor] roomData: `, roomData.redTeam);
        for (let redEntry of roomData.redTeam) {
            if (Object.keys(redEntry).length)
                redTeam.push(new ParticipantEntry(redEntry, redEntry.id === this.hostId));
            else
                redTeam.push(new EmptySlot());
        }

        for (let blueEntry of roomData.blueTeam) {
            if (Object.keys(blueEntry).length)      
                blueTeam.push(new ParticipantEntry(blueEntry, blueEntry.id === this.hostId));
            else
                blueTeam.push(new EmptySlot());
        }

        this.redTeam = redTeam;
        this.blueTeam = blueTeam;

        this.participantsCount = roomData.users.length;
    }
    updateTeams(message) {
        const redTeam = [];
        const blueTeam = [];
        console.log("[pp]: update team called:", message);
        for (let redEntry of message.redTeam) {
            if (Object.keys(redEntry).length)
                redTeam.push(new ParticipantEntry(redEntry, redEntry.id === this.hostId));
            else
                redTeam.push(new EmptySlot());
        }

        for (let blueEntry of message.blueTeam) {
            if (Object.keys(blueEntry).length)      
                blueTeam.push(new ParticipantEntry(blueEntry, blueEntry.id === this.hostId));
            else
                blueTeam.push(new EmptySlot());
        }
        this.redTeam = redTeam;
        this.blueTeam = blueTeam;
        console.log(`[pp:updateteams]: `, this.redTeam, " | ", this.blueTeam);
        this.connectedCallback();
    }
    getTeams() {
        const rt = []
        const bt = [];
        for (let participant of this.redTeam) {
            if (participant instanceof ParticipantEntry)
                rt.push(participant.getUserInfo());
            else {
                rt.push({});
            }
        }
        for (let participant of this.blueTeam) {
            if (participant instanceof ParticipantEntry)
                bt.push(participant.getUserInfo());
            else
                bt.push({});        
        }
        return {redTeam: rt, blueTeam: bt};
    }
    // TODO: if all the team spots were already full, display a messagebox to tell the host that switching team sizes would kick other participants
    switchTeamSize(newTeamSize) {
        // this.teamSize = this.teamSize === 1 ? 2 : 1;
        if (this.teamSize == newTeamSize)
            return;
        this.teamSize = Number(newTeamSize);
        console.log("[pp]: team size:", this.teamSize);
        this.connectedCallback();
    }

    update(roomData) {
        this.switchTeamSize(roomData.teamSize);
        this.updateTeams(roomData);
    }

connectedCallback() {
    this.innerHTML = `
        <div class="CardParticipants">
            <div class="ParticipantsText">
                <h4>Participants</h4>
            </div>
            <div class="ParticipantsTeam">
            ${this.teamSize === 2 ? (`
                <div class="TeamTitle">
                    <p>Red team</p>
                </div>`) : ""}
            <div class="RedTeam"></div>
            ${this.teamSize === 1 ? (`
                <div class="vs">
                    <p>vs</p>
                </div>`) : ""}
            ${this.teamSize === 2 ?( `
                <div class="TeamTitle">
                    <p>Blue team</p>
                </div>`): ""}
                <div class="BlueTeam"></div>
            </div>
        </div>`;

    for (let i = 0; i < this.teamSize; i++) {
        this.redTeam[i].style.borderLeft = this.redTeam[i] instanceof ParticipantEntry && this.teamSize === 2 ? "0.7vh solid var(--red)" : "";
        this.blueTeam[i].style.borderLeft = this.blueTeam[i] instanceof ParticipantEntry && this.teamSize === 2 ? "0.7vh solid var(--blue)" : "";
        this.querySelector(".RedTeam").appendChild(this.redTeam[i]);
        this.querySelector(".BlueTeam").appendChild(this.blueTeam[i]);
    }

// yeah i fw with early returns way too much lol
    if (this.teamSize === 1)
        return;

    new Sortable(this.querySelector(".RedTeam"), {
        group: "shared",
        swap: true,
        filter: ".undraggable",
        onEnd: (evt) => {
            this.redTeam = Array.from(this.querySelector(".RedTeam").children);
            this.blueTeam = Array.from(this.querySelector(".BlueTeam").children);
            for (let i = 0; i < this.teamSize; i++) {
                this.redTeam[i].style.borderLeft = this.redTeam[i] instanceof ParticipantEntry && this.teamSize === 2 ? "0.7vh solid var(--red)" : "";
                this.blueTeam[i].style.borderLeft = this.blueTeam[i] instanceof ParticipantEntry && this.teamSize === 2 ? "0.7vh solid var(--blue)" : "";
            }

            this.dispatchEvent(new CustomEvent("participantsSwitch", {detail: this.getTeams(), bubbles: true}));
        }});

    new Sortable(this.querySelector(".BlueTeam"), {
        group: "shared",
        swap: true,
        filter: ".undraggable",
        onEnd: (evt) => {
            this.redTeam = Array.from(this.querySelector(".RedTeam").children);
            this.blueTeam = Array.from(this.querySelector(".BlueTeam").children);
            for (let i = 0; i < this.teamSize; i++) {
                this.redTeam[i].style.borderLeft = this.redTeam[i] instanceof ParticipantEntry && this.teamSize === 2 ? "0.7vh solid var(--red)" : "";
                this.blueTeam[i].style.borderLeft = this.blueTeam[i] instanceof ParticipantEntry && this.teamSize === 2 ? "0.7vh solid var(--blue)" : "";
            }
            this.dispatchEvent(new CustomEvent("participantsSwitch", {detail: this.getTeams(), bubbles: true}));
        }});
    }
}

customElements.define("participants-card", ParticipantsCard);