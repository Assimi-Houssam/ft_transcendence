export class LineDrawingDownWinSemiFinal extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback(){
        this.innerHTML = `
            <svg class="line-drawing-up-semi-final" width="39" height="61" viewBox="0 0 39 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0.999999H18.4342C26.6958 0.999999 33.4022 7.68043 33.4341 15.942L33.5067 34.7143L33.5719 51.5714L33.5836 54.6045C33.5952 57.5877 36.0168 60 39 60V60" stroke="#828E97"/>
            </svg>
            <svg class="line-drawing-down-semi-final" width="116" height="58" viewBox="0 0 116 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 57H17.9386C26.2468 57 32.9724 50.2469 32.9384 41.9387L32.8692 25L32.8038 9V9C32.7858 4.58702 36.3582 1 40.7712 1H116" stroke="#24CE90"/>
            </svg>
        `
    }

}

customElements.define("line-drawing-down-win-semi-final", LineDrawingDownWinSemiFinal);