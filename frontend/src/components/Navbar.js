import ApiWrapper from "../utils/ApiWrapper.js"
import { Search } from "./Search.js";
import { getUserInfo } from "../utils/utils.js";

import { NotificationCenter } from "./NotificationCenter.js";
import { ChatPopup } from "./ChatComponent.js";

export class Navbar extends HTMLElement {
  constructor() {
    super();
    this.userInfo = null;
    this.notificationCenter = new NotificationCenter();
    this.chat = new ChatPopup();
  }
  async load() {
    const userInfo = await getUserInfo();
    if (!userInfo)
      return false;
    this.userInfo = userInfo;
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
              <a href="/user/${this.userInfo.id}" class="nav_username gradient-dark-bg gradient-dark-border">
                <p class="nav_username_id">
                ${this.userInfo.username}
                </p>
                <img src="${"http://localhost:8000" + this.userInfo.pfp}" />
              </a>
          </div>
      `;
      const noti_btn = this.querySelector(".navbar_notification_btn");
      // todo: make sure this cant be clickable once its clicked
      noti_btn.addEventListener("click", () => {
        this.notificationCenter.show();
      });
      document.addEventListener('keydown', (evt) => {
        if (evt.target.nodeName === 'INPUT') {
          return;
        }
        if (evt.ctrlKey && evt.key === 'y') {
          console.log("chat pop req");
          this.chat.pop();
        }
      });
  }
}
customElements.define('navbar-component', Navbar);