import { NotificationCenter } from "../components/NotificationCenter.js"; 
import { MessageBox } from "../components/MessageBox.js"
export class HomePage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="home_">
        <div class="home_header_">
          <h1>Home</h1>
          <div class="test">klsdjflsdkf</div>
          <a href="/chat/start">start chat</a>
        </div>
      </div>`
      // this.querySelector(".test").onclick = () => {
      //   new MessageBox("sadasd", "asldksald", "sdasd", () => {}).show();
      // }
      // this.querySelector(".home_").appendChild(new NotificationCenter());
  }
};

customElements.define("home-page", HomePage);