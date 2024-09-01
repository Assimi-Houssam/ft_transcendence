import { router } from "../routes/routes.js";
import { Sidebar } from "./Sidebar.js";
import { Navbar } from "./Navbar.js";

/*
* if the element is fetching data from the server (which is the case 99% of the time) => isLoaded shoudl return the fetch promise
* otherwise, we create our own promise
*/
export class LayoutWrapper extends HTMLElement {
  constructor() {
    super();
    this.navbar = null;
  }
  async load() {
    const nav = new Navbar();
    const res = await nav.load();
    if (!res)
      return false;
    this.navbar = nav;
    return true;
  }
  connectedCallback() {
    this.innerHTML = `
      <sidebar-component></sidebar-component>
      <div class="content_">
          <div class="content_body_"></div>
      </div>`;
    this.querySelector(".content_").prepend(this.navbar);
  }
}

customElements.define("layout-wrapper", LayoutWrapper);
