import { synchronousFetch } from "../utils/utils.js";

async function refresh_token() {
  const data = {
    refresh: localStorage.getItem("refresh_token")
  }
  const req = await api_post("/login/refresh", JSON.stringify(data));
  // refresh token expired, need to login again
  if (!resp.ok) {
    return false;
  }
  const json = await req.json();
  localStorage.setItem("access_token", json.access);
  return true;
}
async function api_post(endpoint, data, requires_auth = true) {
  const base_url = "http://localhot:8000";
  const req_headers = {
    "Content-Type": "application/json"
  };
  if (requires_auth) {
    req_headers["Authorization"] = `Bearer ${localStorage.getItem("access_token")}`
  }
  const req_opt = {
    method: "POST",
    headers: req_headers,
    body: data
  }
  return fetch(base_url + endpoint, req_opt);
}

async function api_get(endpoint) {
  const base_url = "http://localhost:8000";
  const req_headers = {
    "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "application/json"
  };
  const req_opt = {
    method: 'GET',
    headers: req_headers,
    body: null
  };
  const resp = fetch(base_url + endpoint, req_opt);
  // token expired, let's request a refresh token
  if (!response.ok) {
    await refresh_token();
  }
  return resp;
}

export class Navbar extends HTMLElement {
  constructor() {
    super();
    this.data = null;
    this.loaded_promise = new Promise((resolved, rejected) => {
      this.resolved_callback = resolved;
      this.rejected_callback = rejected;
    });
  }
  load() {
    api_get("/me").then(response => {
      if (!response.ok) {
        throw new Error('[Navbar]: server returned: ', response.status);
      }
      return response.json();
    })
    .then(data => {
      this.data = data;
      console.log("[Navbar]: received resp from server: ", this.data);
      this.resolved_callback();
    })
    .catch(error => {
      this.rejected_callback(error);
    });
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
                <img src="./assets/images/mamazzal.jpg" />
              </div>
          </div>
      `;
  }
}
customElements.define('navbar-component', Navbar);