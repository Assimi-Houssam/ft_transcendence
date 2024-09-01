import ApiWrapper from "../utils/ApiWrapper.js"
import { Search } from "./Search.js";
import { getUserInfo } from "../utils/utils.js";


export class Navbar extends HTMLElement {
  constructor() {
    super();
    this.username = null;
  }
  async load() {
    const userInfo = await getUserInfo();
    if (!userInfo)
      return false;
    this.username = userInfo;
    return true;
  }
  update(userInfo) {
    this.userInfo = userInfo;
    this.connectedCallback();
  }
  connectedCallback() {
    this.classList.add("navbar_");
    this.innerHTML = `
          <search-component></search-component >
          <div class="navbar_right_elements" >
              <div class="navbar_notification_btn gradient-dark-bg gradient-dark-border" >
                <div class="dot_"></div>
                <img src="../../assets/icons/notification.png" />
              </div>
              <div class="nav_username gradient-dark-bg gradient-dark-border">
                <p class="nav_username_id">
                ${this.username.username}
                </p>
                <img src="${"http://localhost:8000" + this.username.pfp}" />
              </div>
          </div>`;
  }
}
customElements.define('navbar-component', Navbar);