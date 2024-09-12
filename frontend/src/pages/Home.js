import { MessageBox } from "../components/MessageBox.js"
import { ChatPopup } from "../components/ChatComponent.js";
export class HomePage extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
     <h1> home </h1>
    `;
  }
};

customElements.define("home-page", HomePage);