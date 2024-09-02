import ApiWrapper from "../../utils/ApiWrapper.js";

export class FriendsCard extends HTMLElement {
  constructor(user) {
    super();
    this.user  = user;
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="friend_cad_left">
        <img src="${ApiWrapper.getUrl()}${this.user.pfp}" >
        <div>
          <h2>${this.user.username}</h2>
        </div>
      </div>
      <button>
        <img src="../../../assets/icons/block_user.png" >
      </button>
    `
  }
}

customElements.define("friend-card", FriendsCard)


export class ProfileFriends extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <h1>Friends List</h1>
      <div id="friends_list"></div>
    `
  }
}

customElements.define("profile-friends", ProfileFriends);