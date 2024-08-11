import { OfflineRoom } from "../GameOfflineRoom/OfflineRoom.js";

export class OfflineMode extends HTMLElement{
    constructor(){
        super();
    }
    connectedCallback(){
        this.innerHTML = `
            <button class="btn-gameselection" id="BtnOfflineMode">
                <img src="../../../assets/images/offlineMode.png" width="183px">
                <p class="mb-0">Offline Mode</p>
            </button>
        `

        const BtnOnlineMode = document.getElementById("BtnOfflineMode");
        BtnOnlineMode.addEventListener("click", () => {
            const parrentElemnt = document.querySelector("game-selection");
            parrentElemnt.innerHTML = "<offline-room></offline-room>"
        });
    }
}

customElements.define("offline-mode", OfflineMode);