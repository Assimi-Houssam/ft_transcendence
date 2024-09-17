import { router } from "../../../routes/routes.js";
import { langOfflineMode } from "../../../utils/translate/gameTranslate.js";

export class OfflineMode extends HTMLElement{
    constructor(){
        super();
        this.lang =localStorage.getItem("lang");
    }
    connectedCallback(){
        this.innerHTML = `
            <button class="btn-gameselection" id="BtnOfflineMode">
                <img src="../../../assets/images/offlineMode.png" width="183px">
                <p>${langOfflineMode[this.lang]["BtnOfflineMode"]}</p>
            </button>
        `
        const BtnOnlineMode = document.getElementById("BtnOfflineMode");
        BtnOnlineMode.addEventListener("click", () => {
            router.navigate("/tournament");
        });
    }
}

customElements.define("offline-mode", OfflineMode);