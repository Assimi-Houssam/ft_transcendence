import { ProfileStatistics } from "./ProfileStatistics.js";
import { MatchHistory } from "./MtachHistory.js";
import ApiWrapper from "../../utils/ApiWrapper.js"
import Toast from "../Toast.js";
import { router } from "../../routes/routes.js";

export class ProfileActions extends HTMLElement {
  constructor(user, auth, requests) {
    super();
    this.user = user;
    this.auth = auth;
    this.friendRequest = requests;
  }
  async addFriendEven() {
    console.log("send request to [ ", this.user.username, " ]");
    const res = await ApiWrapper.post(`/friends/send_request/${this.user.id}`);
    const json = await res.json();
    if (res.status === 201)
      Toast.success(json.detail);
    else
      Toast.error(json.detail);
  }

  async acceptFriendRequest() {
    const requestID = this.friendRequest.find(item => item.from_user.id === this.user.id).id
    console.log(requestID)
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

  async blockUser() {
    //todo next : creat a best way for  blocking user 
    const res = await ApiWrapper.post(`/user/block/${this.user.id}`);
    const json  = await res.json();
    Toast.success(json.detail);
  }
  connectedCallback() {
    this.innerHTML = `
      ${this.user.friends.find(item => item.id === this.auth.id) === undefined ?
        this.friendRequest.find(item => item.from_user.id === this.user.id) != undefined ? (`
            <button id="accept_friend_request">
              <img src="../../../assets/icons/accept_user.png" >
            </button>
          `) : (`
            <button id="add_friend">
              <img src="../../../assets/icons/add_friend.png" >
            </button>
        `) : ""
      }
      <button id="send_message">
        <img src="../../../assets/icons/message.png"
      </button> 
      <button id="block_user">Block</button>
    `
    const addFriendBtn = document.getElementById("add_friend");
    if (addFriendBtn) addFriendBtn.onclick = () => this.addFriendEven();
    const acceptFriendBtn = document.getElementById("accept_friend_request");
    if (acceptFriendBtn) acceptFriendBtn.onclick = () => this.acceptFriendRequest();
    const blockUserBtn = document.getElementById("block_user");
    blockUserBtn.onclick = () => this.blockUser();
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