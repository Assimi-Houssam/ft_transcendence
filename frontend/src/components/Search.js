
export class Search extends HTMLElement {
    constructor() {
        super();
    }
    onInputFocus(e) {
        const searchResult = document.getElementsByClassName("nav_search_result")[0];
        searchResult.classList.add("show_search_result");
    }
    onInputBlur(e) {
        const searchResult = document.getElementsByClassName("nav_search_result")[0];
        searchResult.classList.remove("show_search_result")
    }
    connectedCallback() {
        this.innerHTML = `
            <div class="nav_search_ gradient-dark-bg gradient-dark-border">
                <img src="../../assets/icons/search.png" />
                <input
                    id="searchBox"
                    type="text" 
                    placeholder="Search for user by email or username"
                />
            </div>
            <div class="nav_search_result"></div>
        `
        // anime({
        //     targets: '.nav_search_result',
        //     translateY: [0, 250],
        //     easing: 'easeOutBounce'
        // });
        const searchBox = document.getElementById("searchBox");
        searchBox.onfocus = (e) => this.onInputFocus(e);
        searchBox.onblur = (e) => this.onInputBlur(e);
    }
}

customElements.define('search-component', Search);