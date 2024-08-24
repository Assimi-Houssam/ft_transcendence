import { router } from "../../../routes/routes.js";
import { OfflineGame } from "../GameOfflineRoom/OfflineGame.js";

export class OfflineMode extends HTMLElement{
    constructor(){
        super();
    }
    connectedCallback(){
        this.innerHTML = `
            <button class="btn-gameselection" id="BtnOfflineMode">
                <img src="../../../assets/images/offlineMode.png" width="183px">
                <p>Offline Mode</p>
            </button>
        `

        const BtnOnlineMode = document.getElementById("BtnOfflineMode");
        BtnOnlineMode.addEventListener("click", () => {
            // const parrentElemnt = document.querySelector("game-selection");
            router.navigate("/tournament");
        });
    }
}

customElements.define("offline-mode", OfflineMode);