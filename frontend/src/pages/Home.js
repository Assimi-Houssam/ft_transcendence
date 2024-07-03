export class HomePage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="home_">
        <div class="home_header_">
          <h1>Home</h1>
          <a href="/login">Login</a>
        </div>
      </div>`
  }
};

customElements.define("home-page", HomePage);