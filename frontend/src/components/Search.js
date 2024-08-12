
export class Search extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
            <div class="nav_search_ gradient-dark-bg gradient-dark-border">
                <img src="../../assets/icons/search.png" />
                <input
                    type="text" 
                    placeholder="Search for user by email or username"
                />
            </div>
        `
    }
}

customElements.define('search-component', Search);