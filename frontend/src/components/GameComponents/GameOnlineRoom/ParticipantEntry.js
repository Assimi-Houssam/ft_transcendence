export class EmptySlot extends HTMLElement {
    constructor() {
        super();
        this.classList.add("draggable");
    }
    connectedCallback() {
        this.innerHTML = `
            <p>Empty Slot</p>
            <img src="../../../../assets/icons/friends.png">
        `;
    }
}

customElements.define("empty-slot", EmptySlot);

export class ParticipantEntry extends HTMLElement {
    constructor(username, pfp, banner, teamSide, isHost) {
        super();
        this.teamSide = teamSide;
        this.pfp = pfp;
        this.username = username;
        this.banner = banner;
        this.isHost = isHost;
    }

    connectedCallback() {
        this.innerHTML = `
            <img src="${this.pfp}">
            <div class="ParticipantUsername">
                <p>${this.username} ${this.isHost ? `<span style="color: var(--orchid); font-size: 65% ;">(Host)</span>` : ""}</p>
            </div>`;
        if (this.banner) {
            this.style.backgroundImage = `url(${this.banner})`;
        } else {
            this.style.backgroundColor = "#212535";
        }
    }
}

customElements.define("pariticipant-entry", ParticipantEntry);