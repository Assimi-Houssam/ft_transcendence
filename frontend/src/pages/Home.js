import { ProfileInfo } from "../components/profile/ProfileInfo.js";
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