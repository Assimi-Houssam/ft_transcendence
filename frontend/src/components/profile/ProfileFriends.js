import { router } from "../../routes/routes.js";
import ApiWrapper from "../../utils/ApiWrapper.js";
import { PreloaderMini } from "../Loading.js";
import Toast from "../Toast.js";

export class FriendsCard extends HTMLElement {
  constructor(user) {
    super();
    this.user  = user;
  }

  async unfriendHandler(e) {
    e.innerHTML = new PreloaderMini().outerHTML;
    const res = await ApiWrapper.post(`/unfriend/${this.user.id}`);
    const json = await res.json();
    if (res.status === 200) {
      Toast.success(this.user.username + " Has been removed from your friend list");
      const parrent = document.getElementById("friends_list")
      parrent.removeChild(this);
      if (parrent.children.length === 0)
        parrent.innerHTML = `<p class="no_friends"> You have no friends right now to display</p>`
    } else {
      Toast.success(json.detail);
    }
  }

  connectedCallback() {
    this.innerHTML = `
      <a href="/user/${this.user.id}" class="friend_card_left">
        <img src="${ApiWrapper.getUrl()}${this.user.pfp}" >
        <div>
          <h2>${this.user.username}</h2>
          <p class="friend_status online">online</p>
        </div>
      </a>
      <button id="unfriend_btn">
        <img src="../../../assets/icons/unfriend.png" > <p>unfriend</p>
      </button>
    `
    const unfriendBtn = document.getElementById("unfriend_btn")
    unfriendBtn.onclick = (e) => this.unfriendHandler(e);
  }
}

customElements.define("friend-card", FriendsCard)


export class ProfileFriends extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <h1 class="profile_friends_title">Friends List</h1>
      <div id="friends_list"></div>
    `
  }
}

customElements.define("profile-friends", ProfileFriends);