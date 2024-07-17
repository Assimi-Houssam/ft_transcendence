export class HomePage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="home_">
        <div class="home_header_">
          <h1>Home</h1>
          <a href="/chat/start">start chat</a>
        </div>
      </div>`
  }
};

customElements.define("home-page", HomePage);