import { router } from "../routes/routes.js";
let sidebar_links = ["/"]; // add the name of the sidebar routes paths here

const Navbar = () => {
  let navbar = document.createElement("nav");
  navbar.classList.add("navbar_");
  let log_username = "mamazzal1337425555555";
  navbar.innerHTML = `
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
  return navbar;
};

const Sidebar = () => {
  let sidebar = document.createElement("div");
  let route = undefined;
  sidebar.classList.add("sidebar_");
  sidebar.innerHTML = `
        <div class="logo_"> 
            <img src="./assets/images/logo.png" alt="logo" />
        </div>
        <div class="sidebar_links">
            ${sidebar_links.map((link) => {
              route = router.routes.find((r) => r.path === link);
              return `<a
                    href="${route.path}"
                    class="${
                      route.path === window.location.pathname
                        ? "active_link"
                        : ""
                    }"> 
                    <img 
                        src="${
                          route.path === window.location.pathname
                            ? route.icon_ac
                            : route.icon
                        }"
                        alt="${route.path}" />
                </a>`;
            })}
        </div>
    `;
  return sidebar;
};

export class LayoutWrraper extends HTMLElement {
  children;
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        ${Sidebar().outerHTML}
            <div class="content_">
                ${Navbar().outerHTML}
                <div class="content_body_">
                    ${this.children}
                </div>
            </div>
        `;
  }
}

customElements.define("layout-wrraper", LayoutWrraper);
const root = document.getElementById("root");
const layout = document.createElement("layout-wrraper");
root.appendChild(layout);
router.render();
