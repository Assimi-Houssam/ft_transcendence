export class Loader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="loading_">
        <img class="loading_icon" src="assets/icons/loading.gif" alt="loading" />
        <p class="loading_text">Loading...</p>
      </div>
    `
  }
}

export class PreloaderMini extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <div class="mini_loading_">
    <img src='../../assets/icons/preloader.gif' alt='loading' />
    </div>
    `
  }
}

customElements.define('app-loader', Loader);
customElements.define('preloader-mini', PreloaderMini);