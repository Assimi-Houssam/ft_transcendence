const icons = {
    english : "../../../assets/icons/usa.png",
    espagnol : "../../../assets/icons/es.png",
    french : "../../../assets/icons/fr.png"
}

const flags = {
    english : "../../../assets/icons/usa_flag.webp",
    espagnol : "../../../assets/icons/es_flag.svg",
    french : "../../../assets/icons/fr_flag.jpeg"
}

const data = [
    {slug : "English",},
    {slug : "Espagnol",},
    {slug : "French",},
]

const shortcutNames = {
    english : "en",
    espagnol : "es",
    french : "fr"
}

export class LanguageComponent extends HTMLElement {
    constructor() {
        super();
        const local =  localStorage.getItem("lang");
        for (let key in shortcutNames) {
            if (shortcutNames[key] === local) {
                this.selectedItem = key;
                break;
            }
        }
        // this.callBack = callBack;
    }

    closeDropmMenu(selectChildItems, arrowIcon) {
        selectChildItems.style.display = "none"
        selectChildItems.innerHTML = ""
        arrowIcon.classList.remove("rotat_arrow_icon")
    }
    handleLangClick(e) {
        const selectChildItems = document.getElementById("select_child_items");
        const arrowIcon = document.getElementById("arrow_icon");
        if (selectChildItems.hasChildNodes()) {
            this.closeDropmMenu(selectChildItems, arrowIcon)
        } else {
            arrowIcon.classList.add("rotat_arrow_icon")
            selectChildItems.style.display = "block"
            selectChildItems.innerHTML = `
                ${data.map(item => (
                    `
                        <div value="${item.slug}" class="lang_items_dropdown">
                            <div class="lang_left_items">
                                <img class="lang_befor_icon" src="${flags[item.slug.toLowerCase()]}" />
                                <p>${item.slug}</p>
                            </div>
                            ${item.slug === this.selectedItem ? (
                                `<img class="verified_icon_lang" src="../../../assets/icons/verified.png" />`
                            ) : ""}
                        </div>
                    `
                )).join("")
                }
            `
            const lists = document.querySelectorAll(".lang_items_dropdown");
            lists.forEach(item =>  {
                item.addEventListener("click", (e) => {
                    const slug = item.getAttribute("value");
                    this.selectedItem = slug;
                    localStorage.setItem("lang", shortcutNames[slug.toLowerCase()])
                    const beforIcon = document.getElementById("lang_icon");
                    const selectedLangSlug = document.getElementById("selected_lang_slug");
                    beforIcon.src = icons[slug.toLowerCase()]
                    selectedLangSlug.innerHTML = slug;
                    this.closeDropmMenu(selectChildItems, arrowIcon)
                })
            })
        }
    }
    connectedCallback() {
        this.innerHTML = `
            <div id="select_items_btn" class="select_items">
                <div class="lang_desc">
                    <img id="lang_icon" class="lang_icon" src="${icons[this.selectedItem]}">
                    <p id="selected_lang_slug">${data.find(item => item.slug.toLowerCase() === this.selectedItem).slug}</p>
                </div>
                <img id="arrow_icon" class="arrow_down" src="../../../assets/icons/arrow_down.png">
            </div>
            <div id="select_child_items" class="select_child_items"></div>
        `
        const selectLangBtn = document.getElementById("select_items_btn");
        selectLangBtn.onclick = (e) => this.handleLangClick(e); 
    }
}


customElements.define("language-component", LanguageComponent)