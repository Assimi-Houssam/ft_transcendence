import { ProfileStatistics } from "./ProfileStatistics.js";
import { MatchHistory } from "./MatchHistory.js";
import ApiWrapper from "../../utils/ApiWrapper.js"
import Toast from "../Toast.js";
import { router } from "../../routes/routes.js";
import { ProfileGraph } from "./ProfileGraph.js";

export class ProfileActions extends HTMLElement {
  constructor(user, auth, requests) {
    super();
    this.user = user;
    this.auth = auth;
    this.friendRequest = requests;
  }
  async addFriendEven() {
    const res = await ApiWrapper.post(`/friends/send_request/${this.user.id}`);
    const json = await res.json();
    if (res.status === 201)
      Toast.success(json.detail);
    else
      Toast.error(json.detail);
  }

  async acceptFriendRequest() {
    const requestID = this.friendRequest.find(item => item.from_user.id === this.user.id).id
    const res = await ApiWrapper.post(`/friends/accept_request/${requestID}`);
    const json = await res.json();
    if (res.status === 200) {
      const acceptFrientBtn = document.getElementById("accept_friend_request");
      this.removeChild(acceptFrientBtn)
      Toast.success(json.detail)
    }
    else
      Toast.error(res.detail)
  }

  connectedCallback() {
    this.innerHTML = `
      ${
        this.auth.block_list.find(item => item.id === this.user.id) === undefined ? (
          this.user.friends.find(item => item.id === this.auth.id) === undefined ?
            this.friendRequest.find(item => item.from_user.id === this.user.id) != undefined ? (`
                <button id="accept_friend_request">
                  <img src="../../../assets/icons/accept_user.png" >
                </button>
              `) : (`
                <button id="add_friend">
                  <img src="../../../assets/icons/add_friend.png" >
                </button>
            `) : ""
        ) : ""
      }
      ${
        this.auth.block_list.find(item => item.id === this.user.id) != undefined ? "" : `<button id="send_message">
          <img src="../../../assets/icons/message.png" >
        </button> `
      }
      ${
        this.auth.block_list.find(item => item.id === this.user.id) != undefined ? 
          `<button id="unblock_user">Unblock</button>`
          : `<button id="block_user">Block</button>`
      }
    `
    const addFriendBtn = document.getElementById("add_friend");
    if (addFriendBtn) addFriendBtn.onclick = () => this.addFriendEven();
    const acceptFriendBtn = document.getElementById("accept_friend_request");
    if (acceptFriendBtn) acceptFriendBtn.onclick = () => this.acceptFriendRequest();
  }
}

customElements.define("profile-actions", ProfileActions);

export class ProfileInfo extends HTMLElement {
  constructor(user, scores) {
    super();
    this.user = user;
    this.classList.add("profile_left_items");
    this.status = this.user.online_status;
    this.scores = scores;
  }

  connectedCallback() {
    this.innerHTML = `
      <div  
        style="background-image=url(${ApiWrapper.getUrl()}${this.user.banner})"
        id="profile_banner"> </div>
      <div class="profile_user_info">
        <div class="profile_user_info_left_items">
            <img id="profile_pfp"  src="${ApiWrapper.getUrl() + this.user.pfp}" alt="user profile">
            <div>
              <h2 id="profile_login">${this.user.username}</h2>
              <div class="profile_joined">
                <p id="joined">Joined ${new Date(this.user.date_joined).toDateString("en-US")}</p>
                <p id="${this.status ? "online" : "offline"}">${this.status ? "online" : "offline"}</p>
              </div>
            </div>
        </div>
        <div id="profile_actions"></div>
      </div>
      <div class="line_"></div>`;
    const banner  = document.getElementById("profile_banner");
    banner && (banner.style.backgroundImage = `url(${ApiWrapper.getUrl()}${this.user.banner})`);
    this.appendChild(new ProfileStatistics(this.user));
    this.appendChild(new MatchHistory(this.scores));
    this.appendChild(new ProfileGraph(this.scores));
  }
}

customElements.define("profile-info", ProfileInfo);