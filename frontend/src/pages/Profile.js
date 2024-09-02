import { ProfileInfo } from "../components/profile/ProfileInfo.js";
import { ProfileFriends } from "../components/profile/ProfileFriends.js";
import {router}  from '../routes/routes.js'
import ApiWrapper from "../utils/ApiWrapper.js";
import { PreloaderMini } from "../components/Loading.js";

export class Profile extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = new PreloaderMini().outerHTML
    this.user = null;
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
    document.getElementById("profile_banner").style.backgroundImage = `url(${ApiWrapper.getUrl()}${this.user.pfp})`;
    document.getElementById("profile_pfp").src = ApiWrapper.getUrl() + this.user.pfp;
    document.getElementById("profile_login").innerHTML = this.user.username;
    document.getElementById("joined").innerHTML = new Date.prototype.toDateString(this.user.date_joined)

  }
  async  connectedCallback() {
    await this.fetchUser();
    this.innerHTML = `
      <profile-info> </profile-info>
      <profile-friends></profile-friend-list>
    `
    this.setUserUnfo();
  }
};

customElements.define("profile-page", Profile);