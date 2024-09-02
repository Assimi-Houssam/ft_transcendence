class FriendsCard extends HTMLElement {
  constructor(user) {
    super();
    this.user  = user;
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="friend_cad_left">
        <img src="../../../assets/images/amine.png" >
        <div>
          <h2>mamazzal</h2>
          <p class="friend_status online">online</p>
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
      <div id="friends_list">
        <friend-card></friend-card>
      </div>
    `
  }
}

customElements.define("profile-friends", ProfileFriends);