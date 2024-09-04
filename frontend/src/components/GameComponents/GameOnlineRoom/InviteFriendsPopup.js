class FriendInviteEntry extends HTMLElement {
    constructor(username, pfp) {
        super();
        this.username = username;
        this.pfp = pfp;
    }
    connectedCallback() {
        this.innerHTML = `
            <div class="FriendInviteEntryInfo">
                <img src="${this.pfp}"></img>
                <div class="FriendInviteEntryUsername">${this.username}</div>
            </div>
            <button class="FriendInviteButton">Invite!</button>`;
        this.querySelector(".FriendInviteButton").onclick = () => {
            this.dispatchEvent(new CustomEvent("friendinvite", { detail: this, bubbles: true }));
        }
    }
}

customElements.define("friend-invite-entry", FriendInviteEntry);

export class InviteFriendsPopup extends HTMLElement {
    constructor() {
        super();
        this.friendsList = [];
        this.outerClickHandler = (event) => {
            if (!this.contains(event.target)) {
                this.hide();
            }
        }
    }
    sendInviteTo(username) {
        console.log("sending invite to:", username);
        // your code here
        this.hide();
    }
    show() {
        // here you fetch the user's friends from the server, then create FriendInviteEntries for each friend, and add them to an array
        // example:
        this.friendsList.push(new FriendInviteEntry("lolz", "../../../assets/images/p1.png"));
        document.body.appendChild(this);
    }
    connectedCallback() {
        this.innerHTML = `
            <div class="InviteFriendsPopupHeader">Invite friends</div>
            <div class="InviteFriendsPopupEntries"></div>
        `;
        for (let friend of this.friendsList)
            this.querySelector(".InviteFriendsPopupEntries").append(friend);
        this.addEventListener("friendinvite", (event) => { this.sendInviteTo(event.detail.username) })
        document.getElementById('root').style.pointerEvents = 'none';
        document.getElementById('root').classList.add("blur");
        anime({
            targets: this,
            opacity: [0, 1],
            duration: 20,
            easing: "easeInExpo",
            complete: () => { document.addEventListener("click", this.outerClickHandler); }
        });
    }
    hide() {
        document.removeEventListener("click", this.outerClickHandler);
        document.getElementById('root').classList.remove("blur");
        anime({
            targets: this,
            opacity: 0,
            duration: 80,
            easing: "easeOutExpo",
            complete: () => { document.body.removeChild(this); }
        });
        document.getElementById('root').style.pointerEvents = 'auto';
    }
}

customElements.define('invite-friends-card', InviteFriendsPopup);