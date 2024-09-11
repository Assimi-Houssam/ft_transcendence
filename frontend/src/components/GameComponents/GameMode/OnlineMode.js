import { router } from "../../../routes/routes.js";
import { langOfflineMode } from "../../../utils/translate/gameTranslate.js";

export class OnlineMode extends HTMLElement{
    constructor(){
        super();
        this.lang =localStorage.getItem("lang");
    }
    connectedCallback(){
        this.innerHTML = `
            <button class="btn-gameselection" id="BtnOnlineMode">
                <img src="../../../assets/images/onlineMode.png" width="183px">
                <p>${langOfflineMode[this.lang]["BtnOnlineMode"]}</p>
            </button>
        `
        const BtnOnlineMode = document.getElementById("BtnOnlineMode");
        BtnOnlineMode.addEventListener("click", () => {
            router.navigate("/rooms");
        });

    }
}

customElements.define("online-mode", OnlineMode);