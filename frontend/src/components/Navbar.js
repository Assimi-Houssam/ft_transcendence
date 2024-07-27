import ApiWrapper from "../utils/ApiWrapper.js"
import { NotificationCenter } from "./NotificationCenter.js";

export class Navbar extends HTMLElement {
  constructor() {
    super();
    this.data = null;
    this.loaded_promise = new Promise((resolved, rejected) => {
      this.resolved_callback = resolved;
      this.rejected_callback = rejected;
    });
    this.notification_center = new NotificationCenter();
  }
  load() {
    ApiWrapper.get("/me").then((req) => {
      if (!req) {
        throw new Error("/me request failed");
      }
      if (!req.ok) {
        console.log("[Navar]: server returned: ", req.status);
        throw new Error("Req failed");
      }
      return req.json();
    })
    .then((data) => {
      console.log("[Navbar]: data was received successfully!");
      this.data = data;
      this.resolved_callback();
    })
    .catch(error => {
      this.rejected_callback(error);
    })
  }
  isLoaded() {
    return this.loaded_promise;
  }
  async connectedCallback() {
    this.classList.add("navbar_");
    let log_username = this.data.username ? this.data.username : "loading..";
    this.innerHTML = `
          <div class="nav_search_ gradient-dark-bg gradient-dark-border">
              <img src="../../assets/icons/search.png" />
              <input
                type="text" 
                placeholder="Search for user by email or username"
              />
          </div>
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
      const noti_btn = this.querySelector(".navbar_notification_btn");
      noti_btn.addEventListener("click", () => {
        this.notification_center.show();
      })
  }
}
customElements.define('navbar-component', Navbar);