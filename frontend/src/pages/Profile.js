import { ProfileInfo } from "../components/profile/ProfileInfo.js";
import { FriendsCard, ProfileFriends } from "../components/profile/ProfileFriends.js";
import {router}  from '../routes/routes.js'
import ApiWrapper from "../utils/ApiWrapper.js";
import { Loader, PreloaderMini } from "../components/Loading.js";
import { ProfileActions } from "../components/profile/ProfileInfo.js";
import Toast from "../components/Toast.js";
import { forceUpdateUserInfo, getUserInfo } from "../utils/utils.js";
import { langErrors } from "../utils/translate/gameTranslate.js";

export class Profile extends HTMLElement {
  constructor() {
    super();
    this.lang = localStorage.getItem("lang");
    this.innerHTML = new Loader().outerHTML;
    this.user = null;
    this.auth = null;
    this.friendRequest = null;
    this.scores = null;
  }

  async getAuth()  {
    this.auth = await getUserInfo();
  }

  async fetchUser() {
    try {
      const res = await ApiWrapper.get(`/user/` + router.route.params["userID"]);
      if (res.status == 200) {
        const userJson  = await res.json();
        this.user = userJson.detail;
      } else {
        return false;
      }
      return true;
    }
    catch (e) {
      return false;
    }
  }

  async fetchFriendRequest() {
    const res = await ApiWrapper.get("/friends/requests");
    const json = await res.json();
    if (res.status === 200)
      this.friendRequest = json;
    else
      Toast.error(langErrors[this.lang]["ErrorFaildGetFriends"]);
  }

  //to set the  acions button (add as friend, send message, block)
  setActions() {
    const profileActions = document.getElementById("profile_actions");
    if (profileActions && this.auth.id !== this.user.id)
      profileActions.appendChild(new ProfileActions(this.user, this.auth, this.friendRequest));
  }

  async blockUser(e) {
    e.target.innerHTML = new PreloaderMini().outerHTML;
    const res = await ApiWrapper.post(`/user/block/${this.user.id}`);
    const json  = await res.json();
    if (res.status === 201) {
      this.auth = await forceUpdateUserInfo();
      Toast.success(json.detail);
      this.connectedCallback();
    }else {
      Toast.error(json.detail);
      e.target.innerHTML = "Block"
    }
  }

  async unblockUser(e) {
    e.target.innerHTML = new PreloaderMini().outerHTML;
    const res = await ApiWrapper.post(`/user/unblock/${this?.user?.id}`);
    const json = await res.json();
    if (res.status === 200) {
      this.auth = await forceUpdateUserInfo();
      Toast.success(json.detail)
      this.connectedCallback();
    } else {
      Toast.error(json.detail)
      e.target.innerHTML = "Unblock"
    }
  }
  async fetchUserScores(){
    const req = await ApiWrapper.get("/scores/" + router.route.params["userID"]);
    if (!req.ok) {
      return null;
    }
    const matches = await req.json();
    this.scores = matches;
    return this.scores;
  }
  async connectedCallback() {
    const res = await this.fetchUser();
    if (!res) {
      router.navigate("/404");
      return;
    }
    await this.getAuth();
    await this.fetchFriendRequest();
    await this.fetchUserScores();
    this.innerHTML = ``
    this.appendChild(new ProfileInfo(this.user, this.scores)); 
    this.appendChild(new ProfileFriends(this.user));
    this.setActions();
    const blockUserBtn = document.getElementById("block_user");
    blockUserBtn && (blockUserBtn.onclick = (e) => this.blockUser(e));
    const unblockBtn = document.getElementById("unblock_user");
    unblockBtn && (unblockBtn.onclick = (e) => this.unblockUser(e))
    const friendListComponent = document.querySelector("profile-friends");
    if (friendListComponent) {
      if (this.user.id !== this.auth.id) {
        const profileInfo = document.querySelector("profile-info");
        profileInfo.style.flex = 1;
        this.removeChild(friendListComponent);
      }
    }
  }
};

customElements.define("profile-page", Profile);