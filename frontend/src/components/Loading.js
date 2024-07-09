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

customElements.define('app-loader', Loader);

/**
 * TODO:
 * the loader will be displayed for 1.5 seconds
 * the setTimeout function is temporary and will be replaced with a real check
 */
export function isPageLoaded() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1500);
    //reload js files
  });
}