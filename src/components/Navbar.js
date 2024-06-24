export class Navbar extends HTMLElement {
    constructor() {
        super();
        this.classList.add("navbar_");
    }

    connectedCallback() {
        let log_username = "mamazzal1337425555555";
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
                      log_username.length > 10
                        ? log_username.slice(0, 13) + "..."
                        : log_username
                    }
                    </p>
                    <img src="./assets/images/mamazzal.jpg" />
                  </div>
              </div>
          `;
    }
}