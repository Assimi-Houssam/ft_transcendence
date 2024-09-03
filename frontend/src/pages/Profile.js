import { ProfileInfo } from "../components/profile/ProfileInfo.js";
import { FriendsCard, ProfileFriends } from "../components/profile/ProfileFriends.js";
import {router}  from '../routes/routes.js'
import ApiWrapper from "../utils/ApiWrapper.js";
import { Loader, PreloaderMini } from "../components/Loading.js";
import { ProfileActions } from "../components/profile/ProfileInfo.js";

export class Profile extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = new Loader().outerHTML
    this.user = null;
    this.auth  = undefined;
    this.friendRequest = undefined;
  }

  async getAuth()  {
    const res = await ApiWrapper.get("/me");
    const userJson = await res.json();
    this.auth = userJson;
  }

  async fetchUser() {
    const res = await ApiWrapper.get(`/user/` + router.route.params["userID"]);
    console.log(res)
    if (res.status == 200) {
      const userJson  = await res.json();
      this.user = userJson.detail;
      console.log(this.user)
    } else {
      router.navigate("/404");
    }
  }

  async fetchFriendRequest() {
    const res = await ApiWrapper.get("/friends/requests");
    const json = await res.json();
    if (res.status === 200)
      this.friendRequest = json;
    else
      Toast.error("Faild to get your friends requests");
  }

  setUserUnfo() {
    const banner = document.getElementById("profile_banner");
    const pfp = document.getElementById("profile_pfp");
    const username = document.getElementById("profile_login");
    const joined = document.getElementById("joined");

    banner && (banner.style.backgroundImage = `url(${ApiWrapper.getUrl()}${this.user.banner})`);
    pfp && (pfp.src = ApiWrapper.getUrl() + this.user.pfp);
    username && (username.innerHTML = this.user.username);
    joined &&  (joined.innerHTML = "joined " + new Date(this.user.date_joined).toDateString("en-US"))
  }

  setFriendsList() {
    const friendsList = document.getElementById("friends_list")
    if (this?.user?.friends.length > 0) {
      this.user.friends.map(item => friendsList.appendChild(new FriendsCard(item)))
      return ;
    }
    friendsList && (friendsList.innerHTML = '<p class="no_friends"> You have no friends right now to display</p>');
  }

  //to set the  acions button (add as friend, send message, block)
  setActions() {
    const profileActions = document.getElementById("profile_actions");
    if (profileActions && this.auth.id !== this.user.id)
      profileActions.appendChild(new ProfileActions(this.user, this.auth, this.friendRequest));
  }

  async  connectedCallback() {
    await this.fetchUser();
    await this.getAuth();
    await this.fetchFriendRequest();
    this.innerHTML = `
      <profile-info> </profile-info>
      <profile-friends></profile-friend-list>
    `
    this.setUserUnfo();
    this.setFriendsList();
    this.setActions();
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