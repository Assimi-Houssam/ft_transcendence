import { ParticipantEntry, EmptySlot } from "./ParticipantEntry.js";

class ParticipantsCard extends HTMLElement {
  constructor(teamSize = 1) {
    super();
    this.teamSize = teamSize;
    // testing
    this.pariticipantS = new ParticipantEntry("silentzer", "../../../../assets/images/p1.png", "../../../../assets/images/img.png", "blue", true);
    this.redTeam = [this.pariticipantS, new EmptySlot()];
    this.blueTeam = [new EmptySlot(), new EmptySlot()];
    this.participantsCount = 1; // temp

    this.addEventListener("participantkick", (e) => { this.kickParticipant(e.detail); });
  }
  getTeams() {
    const rt = []
    const bt = [];
    for (let participant of this.redTeam) {
      if (participant instanceof ParticipantEntry)
        rt.push(participant);
    }
    for (let participant of this.blueTeam) {
      if (participant instanceof ParticipantEntry)
        bt.push(participant);
    }
    return [rt, bt];
  }
  // TODO: if all the team spots were already full, display a messagebox to tell the host that switching team sizes would kick other participants
  switchTeamSize() {
    this.teamSize = this.teamSize === 1 ? 2 : 1;
    this.connectedCallback();
  }

  addParticipant(participant) {
    if (this.teamSize === 1) {
      if (this.participantsCount === 2) {
        return;
      }
      this.blueTeam[0] = participant;
      this.participantsCount++;
      document.querySelector("room-info-card").participantJoined();
      this.connectedCallback();
      return;
    }

    if (this.participantsCount === 4) {
      return;
    }
    const teams = [this.redTeam, this.blueTeam];
    for (let team of teams) {
      for (let i = 0; i < team.length; i++) {
        if (team[i] instanceof EmptySlot) {
          team[i] = participant;
          this.participantsCount++;
          document.querySelector("room-info-card").participantJoined();
          this.connectedCallback();
          return;
        }
      }
    }
  }

  // todo: this
  kickParticipant(participant) {
    if (participant.parentNode.className === "RedTeam") {
      const participantIdx = this.redTeam.indexOf(participant);
      this.redTeam[participantIdx] = new EmptySlot();
    }
    else {
      const participantIdx = this.blueTeam.indexOf(participant);
      this.blueTeam[participantIdx] = new EmptySlot();
    }
    this.participantsCount--;
    document.querySelector("room-info-card").participantLeft();
    this.connectedCallback();    
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

    // testing
    this.querySelector(".ParticipantsText").onclick = () => {
      this.addParticipant(new ParticipantEntry("silentzer" + this.participantsCount, "../../../../assets/images/p1.png", "", "blue", false));
    }

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
      },
    });

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
      },
    });
    // todo: only allow hosts to kick, (both locally and in the server)
    // todo: create a User class representing the current logged in user
  }
}

customElements.define("participants-card", ParticipantsCard);
export default new ParticipantsCard();