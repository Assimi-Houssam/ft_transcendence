import { langErrors } from "../utils/translate/gameTranslate.js";

export default class Error404 extends HTMLElement {
    constructor() {
        super();
        this.lang = localStorage.getItem("lang");
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                @keyframes fadeInBounce {
                    0% {
                        opacity: 0;
                        transform: translateY(-50px);
                    }
                    70% {
                        transform: translateY(10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .error {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 94vh;
                    font-size: 5rem;
                    color: #f00;
                    margin-top: 20px;
                    animation: fadeInBounce 2s ease-out;
                }
            </style>
            <div class="error">
                <p>${langErrors[this.lang]["ErrorNotFound"]}</p>
            </div>
        `;
    }
}

customElements.define('error-404', Error404);