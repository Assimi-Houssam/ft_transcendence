import { synchronousFetch } from "../utils/utils.js";

export class Navbar extends HTMLElement {
    constructor() {
        super();
        this.classList.add("navbar_");
    }

    updateData() {
      this.connectedCallback();
    }
    async connectedCallback() {
        const req_headers = {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json"
        };
        const resp = await synchronousFetch("http://localhost:8000/me", "GET", null, req_headers);
        const json = await resp.json();
        let log_username = json.username;
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
                    ${
                      log_username && 
                        (log_username.length > 10
                          ? log_username.slice(0, 13) + "..."
                          : log_username) 
                        || "loading" // temporary
                    }
                    </p>
                    <img src="./assets/images/mamazzal.jpg" />
                  </div>
              </div>
          `;
    }
}
customElements.define('navbar-component', Navbar);