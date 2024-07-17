export class ErrorPage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<div class="error-msg">An error has occured!</div>`;
    }
};

customElements.define("error-page", ErrorPage);