import { InviteFriendsPopup } from "./InviteFriendsPopup.js";

export class EmptySlot extends HTMLElement {
    constructor() {
        super();
        this.classList.add("undraggable");
    }
    connectedCallback() {
        this.innerHTML = `
            <p>Empty Slot</p>
            <img src="../../../../assets/icons/friends.png">
        `;
        this.onclick = () => { new InviteFriendsPopup().show(); }
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
            <div class="ParticipantEntryInfo">
                <img src="${this.pfp}">
                <div class="ParticipantUsername">
                    <p>${this.username} ${this.isHost ? `<span style="color: var(--orchid); font-size: 65% ;">(Host)</span>` : ""}</p>
                </div>
            </div>
            <img class="ParticipantKick" src="../../../../assets/icons/circle-x.svg">`;
        if (this.banner) {
            this.style.backgroundImage = `url(${this.banner})`;
        } else {
            this.style.backgroundColor = "#212535";
        }
        this.addEventListener("mouseover", (event) => {
            anime({
                targets: this.querySelector(".ParticipantKick"),
                opacity: [0, 1],
                duration: 50,
                easing: "easeOutExpo"
            });
        });
        this.addEventListener("mouseout", (event) => {
            anime({
                targets: this.querySelector(".ParticipantKick"),
                opacity: [1, 0],
                duration: 50,
                easing: "easeInExpo"
            });
        });
        this.querySelector(".ParticipantKick").onclick = (event) => {
            this.dispatchEvent(new CustomEvent("participantkick", { detail: this, bubbles: true }));
        }
    }
}

customElements.define("pariticipant-entry", ParticipantEntry);