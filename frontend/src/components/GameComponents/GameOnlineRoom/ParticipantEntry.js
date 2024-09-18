import { InviteFriendsPopup } from "./InviteFriendsPopup.js";
import { langParticipants } from "../../../utils/translate/gameTranslate.js";
import ApiWrapper from "../../../utils/ApiWrapper.js";

export class EmptySlot extends HTMLElement {
    constructor() {
        super();
        this.lang = localStorage.getItem("lang");
        this.classList.add("undraggable");
    }
    connectedCallback() {
        this.innerHTML = `
            <p>${langParticipants[this.lang]["emptySlot"]}</p>
            <img src="../../../../assets/icons/friends.png">
        `;
        this.onclick = () => { new InviteFriendsPopup().show(); }
    }
}

customElements.define("empty-slot", EmptySlot);

export class ParticipantEntry extends HTMLElement {
    constructor(userInfo, isHost, locked = false) {
        super();
        this.userInfo = userInfo;
        this.isHost = isHost;
        this.locked = locked;
        this.lang = localStorage.getItem("lang");
    }
    getUserInfo() {
        return this.userInfo;
    }
    connectedCallback() {
        this.innerHTML = `
            <div class="ParticipantEntryInfo">
                <img src="${ApiWrapper.getUrl() + this.userInfo.pfp}">
                <div class="ParticipantUsername">
                    <p>${this.userInfo.username} ${this.isHost ? `<span style="color: var(--orchid); font-size: 65% ;">(${langParticipants[this.lang]["host"]})</span>` : ""}</p>
                </div>
            </div>
            <img class="ParticipantKick" src="../../../../assets/icons/circle-x.svg">`;
        if (this.userInfo.banner) {
            this.style.backgroundImage = `url(${ApiWrapper.getUrl() + this.userInfo.banner})`;
        } else {
            this.style.backgroundColor = "#212535";
        }
        if (this.locked)
            return;
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