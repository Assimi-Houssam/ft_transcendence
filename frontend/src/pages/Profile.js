import { ProfileInfo } from "../components/profile/ProfileInfo.js";
import { FriendsCard, ProfileFriends } from "../components/profile/ProfileFriends.js";
import {router}  from '../routes/routes.js'
import ApiWrapper from "../utils/ApiWrapper.js";
import { PreloaderMini } from "../components/Loading.js";
import { ProfileActions } from "../components/profile/ProfileInfo.js";

export class Profile extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = new PreloaderMini().outerHTML
    this.user = null;
    this.auth  = undefined;
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

  setUserUnfo() {
    document.getElementById("profile_banner").style.backgroundImage = `url(${ApiWrapper.getUrl()}${this.user.banner})`;
    document.getElementById("profile_pfp").src = ApiWrapper.getUrl() + this.user.pfp;
    document.getElementById("profile_login").innerHTML = this.user.username;
    let options = { year: 'numeric', month: 'short', day: 'numeric' };
    document.getElementById("joined").innerHTML = "joined " + new Date(this.user.date_joined).toDateString("en-US", options)
  }

  setFriendsList() {
    const friendsList = document.getElementById("friends_list")
    if (this.user.friends.length > 0) {
        for (let item in this.user.friends)
          friendsList.appendChild(new FriendsCard(item));
        return ;
    } 
    friendsList.innerHTML = '<p class="no_friends"> You have no friends right now to display</p>'
  }

  //to set the  acions button (add as friend, send message, block)
  setActions() {
    const profileActions = document.getElementById("profile_actions");
    if (this.auth.id !== this.user.id)
      profileActions.appendChild(new ProfileActions(this.user, this.auth));
  }

  async  connectedCallback() {
    await this.fetchUser();
    await this.getAuth();
    this.innerHTML = `
      <profile-info> </profile-info>
      <profile-friends></profile-friend-list>
    `
    this.setUserUnfo();
    this.setFriendsList();
    this.setActions();
  }
};

customElements.define("profile-page", Profile);