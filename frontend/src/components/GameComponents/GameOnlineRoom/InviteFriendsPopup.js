import { router } from "../../../routes/routes.js";
import ApiWrapper from "../../../utils/ApiWrapper.js";
import { forceUpdateUserInfo, getUserInfo } from "../../../utils/utils.js";
import Toast from "../../Toast.js";
import { langInviteFriendsPopup } from "../../../utils/translate/gameTranslate.js";

class FriendInviteEntry extends HTMLElement {
    constructor(username, pfp, userId, status) {
        super();
        this.username = username;
        this.pfp = pfp;
        this.userId = userId;
        this.status = status;
        this.lang = localStorage.getItem("lang");
    }
    connectedCallback() {
        this.innerHTML = `
            <div class="FriendInviteEntryInfo">
                <img src="${this.pfp}"></img>
                <div class="FriendInviteEntryC">
                    <div class="FriendInviteEntryUsername">${this.username}</div>
                    <p class="friend_status ${this.status ? "online" : "offline"}">${this.status ? langInviteFriendsPopup[this.lang]["Online"] : langInviteFriendsPopup[this.lang]["Offline"]}</p>
                </div>
            </div>
            <button class="FriendInviteButton">${langInviteFriendsPopup[this.lang]["invite"]}</button>`;
        this.querySelector(".FriendInviteButton").onclick = () => {
            this.dispatchEvent(new CustomEvent("friendinvite", { detail: this, bubbles: true }));
        }
    }
}

customElements.define("friend-invite-entry", FriendInviteEntry);

export class InviteFriendsPopup extends HTMLElement {
    constructor() {
        super();
        this.lang = localStorage.getItem("lang");
        this.friendsList = [];
        this.outerClickHandler = (event) => {
            if (!this.contains(event.target)) {
                this.hide();
            }
        }
    }
    async sendInviteTo(user) {
        const userId = user.userId;
        const roomId = router.route.params["id"];
        console.log("sending invite to:", userId, " roomId:", roomId);
        const inviteData = { userId, roomId };
        const req = await ApiWrapper.post("/rooms/invite", inviteData);
        if (!req.ok) {
            console.log("failed to send invite to user");
            return;
        }
        const resp = await req.json();
        Toast.success(resp.detail);
        this.hide();
    }
    show() {
        forceUpdateUserInfo().then((userinfo) => {
            const friends = userinfo.friends;
            console.log("friends: ", friends);
            for (let friend of friends) {
                this.friendsList.push(new FriendInviteEntry(friend.username, ApiWrapper.getUrl() + friend.pfp, friend.id, friend.online_status));
            }
            document.body.appendChild(this);

        })
    }
    async connectedCallback() {
        this.innerHTML = `
            <div class="InviteFriendsPopupHeader">${langInviteFriendsPopup[this.lang]["inviteFriends"]}</div>
            <div class="InviteFriendsPopupEntries"></div>
        `;
        for (let friend of this.friendsList)
            this.querySelector(".InviteFriendsPopupEntries").append(friend);
        this.addEventListener("friendinvite", (event) => { this.sendInviteTo(event.detail); })
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