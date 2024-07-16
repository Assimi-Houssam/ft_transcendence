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
    this.loaded_promise = new Promise((resolved, rejected) => {
      this.resolved_callback = resolved;
      this.rejected_callback = rejected;
    });
    this.navbar = null;
  }
  load() {
    const nav = new Navbar();
    nav.load();
    nav.isLoaded().then(() => {
      this.navbar = nav;
      this.resolved_callback();
    })
    .catch(error => {
      this.rejected_callback(error);
    })
  }
  isLoaded() {
    return this.loaded_promise;
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
