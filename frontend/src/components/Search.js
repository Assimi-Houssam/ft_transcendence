import ApiWrapper from '../utils/ApiWrapper.js'
import Toast from './Toast.js';

export class Search extends HTMLElement {
    constructor() {
        super();
        this.delayTime = 250;
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
    }

    onInputFocus(e) {
        const searchResult = document.getElementsByClassName("nav_search_result")[0];
        if (searchResult.classList.contains("show_search_result"))
            return;
        anime({
            targets: '.nav_search_result',
            height: ['0px', '350px'],
            duration: this.delayTime,
            easing: 'easeInOutQuad',
            begin: () => {
                searchResult.classList.add("show_search_result");
            }
        });
        document.addEventListener('click', this.handleDocumentClick);
    }


    handleDocumentClick(e) {
        const searchResult = document.getElementsByClassName("nav_search_result")[0];
        if (!this.contains(e.target)) {
            anime({
                targets: '.nav_search_result',
                height: ['350px', '0px'],
                duration: this.delayTime,
                easing: 'easeInOutQuad',
                complete: () => {
                    setTimeout(() => {
                        searchResult.classList.remove("show_search_result")
                        document.removeEventListener('click', this.handleDocumentClick);
                    }, this.delayTime);
                },
            });
        }
    }

    async handleOnChange (e) {
        const  show_search_result = document.getElementsByClassName("show_search_result")[0];
        show_search_result.innerHTML = `
            <div>Searching...</div>
        `
        setTimeout( async () => {
            const res = await ApiWrapper.get(`/users/filter?query=${e.target.value}`);
            const data = await res.json()
            console.log(data.detail)
            if (res.ok) {
                if (data.detail.length > 0) {
                    show_search_result.innerHTML =
                        `
                            ${data.detail.map((user) => (
                                `
                                    <div>
                                        ${user.username}
                                    </div
                                `
                            ))}
                        `
                }else {
                    show_search_result.innerHTML = `<div>No result found sorry</div>`
                }
            }else {
                show_search_result.innerHTML = `<div>faild to load data</div>`
            }
        }, 200);
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
        `;
        const searchBox = document.getElementById("searchBox");
        searchBox.onfocus = (e) => this.onInputFocus(e);
        searchBox.addEventListener("keyup", (e) => {
            this.handleOnChange(e)
        })
    }
}

customElements.define('search-component', Search);