export class BracketLineTop extends HTMLElement {

    connectedCallback() {
        this.innerHTML = `
            <svg class="line-drawing-up-semi-final" width="116" height="58" viewBox="0 0 116 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 1H17.9386C26.2468 1 32.9724 7.75315 32.9384 16.0613L32.8692 33L32.8038 49V49C32.7858 53.413 36.3582 57 40.7712 57H116" stroke="#828E97"/>
            </svg>`;
    }
};

customElements.define("bracket-line-top", BracketLineTop);