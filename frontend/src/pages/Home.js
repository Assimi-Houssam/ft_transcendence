import { MessageBox } from "../components/MessageBox.js"
export class HomePage extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
     <h1> home </h1>
    `
  }
};

customElements.define("home-page", HomePage);