import { router } from "../routes/routes.js";
import { Sidebar } from "./Sidebar.js";
import { Navbar } from "./Navbar.js";

export class LayoutWrapper extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <sidebar-component></sidebar-component>
      <div class="content_">
          <navbar-component></navbar-component>
          <div class="content_body_"></div>
      </div>`;
  }
}

customElements.define("layout-wrapper", LayoutWrapper);
