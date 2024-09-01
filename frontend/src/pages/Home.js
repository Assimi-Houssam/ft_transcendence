export class HomePage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="home_">
        <div class="home_header_">
          <h1>Home</h1>
        </div>
        <div class="home_frined_">
          <p>Welcome to the home page!</p>  
        </div>
      </div>`
  }
};

customElements.define("home-page", HomePage);