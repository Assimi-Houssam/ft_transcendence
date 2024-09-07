export class LineDrawingSemiFinal extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <svg class="line-drawing-up-semi-final" width="116" height="58" viewBox="0 0 116 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 1H17.9386C26.2468 1 32.9724 7.75315 32.9384 16.0613L32.8692 33L32.8038 49V49C32.7858 53.413 36.3582 57 40.7712 57H116" stroke="#828E97"/>
            </svg>
            <svg class="line-drawing-down-semi-final" width="39" height="61" viewBox="0 0 39 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 60H18.4342C26.6958 60 33.4022 53.3196 33.4341 45.058L33.5067 26.2857L33.5719 9.42857L33.5836 6.39547C33.5952 3.41227 36.0168 1 39 1V1" stroke="#828E97"/>
            </svg>
        `
    }

}

customElements.define("line-drawing-semi-final", LineDrawingSemiFinal);