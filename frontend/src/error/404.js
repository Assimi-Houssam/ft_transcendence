export default class Error404 extends HTMLElement {
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
                404 Not Found
            </div>
        `;
    }
}

customElements.define('error-404', Error404);