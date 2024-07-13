import { synchronousFetch } from "../utils/utils.js";

async function api_get(endpoint, data = null) {
  const base_url = "http://localhost:8000";
  const req_headers = {
    // whatever, will deal with it l8r
    "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "application/json"
  };
  const req_opt = {
    method: 'GET',
    headers: req_headers,
    body: data
  };
  const resp = await fetch(base_url + endpoint, req_opt);
  return resp;
}

export class Navbar extends HTMLElement {
    constructor() {
        super();
        this.data = null;
        // this.loaded_promise = new Promise((resolved, rejected) => {
        //   this.resolved_callback = resolved;
        //   this.rejected_callback = rejected;
        // });
        this.loaded_promise = this.fetchData();
      }
      async isLoaded() {
        return this.loaded_promise;
      }
      async fetchData() {
        console.log("[navbar]: fetching data");
        const req = await api_get("/me");
        this.data = await req.json();
        console.log("[navbar] data: ", this.data);
        console.log("[navbar]: data fetched");
        return req;
      }
      async connectedCallback() {
        this.classList.add("navbar_");
        let log_username = this.data.username;
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