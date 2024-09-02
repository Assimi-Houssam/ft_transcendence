import { ProfileInfo } from "../components/profile/ProfileInfo.js";
import { ProfileFriends } from "../components/profile/ProfileFriends.js";
export class HomePage extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
      <profile-info> </profile-info>
      <profile-friends></profile-friend-list>
    `
  }
};

customElements.define("profile-page", HomePage);