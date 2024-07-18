export class Test extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
            <div>
                <h1>test page for subpaths</h1>
            </div>
        `
    }
}

customElements.define('test-page', Test);