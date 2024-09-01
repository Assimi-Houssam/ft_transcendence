import ApiWrapper from "../utils/ApiWrapper.js"
import { Search } from "./Search.js";
import { getUserInfo } from "../utils/utils.js";


export class Navbar extends HTMLElement {
  constructor() {
    super();
    this.data = null;
  }
  async load() {
    const userInfo = await getUserInfo();
    if (!userInfo)
      return false;
    this.data = userInfo;
    return true;
  }
  async connectedCallback() {
    this.classList.add("navbar_");
    let log_username = this.data.username ? this.data.username : "loading..";
    this.innerHTML = `
          <search-component></search-component >
          <div class="navbar_right_elements" >
              <div class="navbar_notification_btn gradient-dark-bg gradient-dark-border" >
                <div class="dot_"></div>
                <img src="../../assets/icons/notification.png" />
              </div>
              <div class="nav_username gradient-dark-bg gradient-dark-border">
                <p class="nav_username_id">
                ${log_username}
                </p>
                <img src="${"http://localhost:8000" + this.data.pfp}" />
              </div>
          </div>
      `;
  }
}
customElements.define('navbar-component', Navbar);