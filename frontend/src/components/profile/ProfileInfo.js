import { ProfileStatistics } from "./ProfileStatistics.js";
import { MatchHistory } from "./MtachHistory.js";

export class ProfileActions extends HTMLElement {
  constructor(user, auth) {
    super();
    this.user = user;
    this.auth = auth;
  }
  addFriendEven() {
    console.log("send request to [ ", this.user.username, " ]");
  }

  /**
   * TODOS
   *  send friend request by auth
   *  check if the auth already sent request
   *  hide the user friend list from the auth visitor 
   */
  connectedCallback() {
    this.innerHTML = `
      <button id="add_friend">
        <img src="../../../assets/icons/add_friend.png" >
      </button>
      <button id="send_message">
        <img src="../../../assets/icons/message.png"
      </button> 
      <button id="block_user">Block</button>
    `
    document.getElementById("add_friend").onclick = () => this.addFriendEven();
  }
}

customElements.define("profile-actions", ProfileActions);

export class ProfileInfo extends HTMLElement {
  constructor() {
    super();
    this.classList.add("profile_left_items");
  }

  connectedCallback() {
    this.innerHTML = `
      <div  id="profile_banner"> </div>
      <div class="profile_user_info">
        <div class="profile_user_info_left_items">
            <img id="profile_pfp"  src="" alt="user profile">
            <div>
              <h2 id="profile_login">mamazzal</h2>
              <div class="profile_joined">
                <p id="joined">Joined Jul 11, 2024</p>
                <p id="online">online</p>
              </div>
            </div>
        </div>
        <div id="profile_actions"></div>
      </div>
      <div class="line_"></div>
      <profile-statistics></profile-statistics>
      <match-history></match-history>
    `
  }
}

customElements.define("profile-info", ProfileInfo);