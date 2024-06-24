import { router } from "../routes/routes.js";
import { Sidebar } from "./Sidebar.js";
import { Navbar } from "./Navbar.js";

export class LayoutWrraper extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
            <sidebar-component></sidebar-component>
            <div class="content_">
                <navbar-component></navbar-component>
                <div class="content_body_"></div>
            </div>
        `;
  }
}

customElements.define("layout-wrraper", LayoutWrraper);
customElements.define('sidebar-component', Sidebar);
customElements.define('navbar-component', Navbar);

const root = document.getElementById("root");
const layout = document.createElement("layout-wrraper");

root.appendChild(layout);
router.render();
