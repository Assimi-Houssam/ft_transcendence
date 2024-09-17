export default class Error500 extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .error {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    font-size: 3rem;
                    color: #f00;
                    marginTop: 20px;
                }
            </style>
            <div class="error">
                HTTP 500 Internal Server Error
            </div>
        `;
    }
}

customElements.define('error-500', Error500);