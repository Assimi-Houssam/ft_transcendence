import { GameSelection } from "../../../pages/gameSelectionMenu/GameSelectionMenu.js"
import { router } from "../../../routes/routes.js";

export class OnlineMode extends HTMLElement{
    constructor(){
        super();
    }
    connectedCallback(){
        this.innerHTML = `
            <button class="btn-gameselection" id="BtnOnlineMode">
                <img src="../../../assets/images/OnlineMode.png" width="183px">
                <p class="mb-0">Online Mode</p>
            </button>
        `
        const BtnOnlineMode = document.getElementById("BtnOnlineMode");
        BtnOnlineMode.addEventListener("click", () => {
            const parrentElemnt = document.querySelector("game-selection");
            parrentElemnt.innerHTML = "<online-room-list></online-room-list>"
            // this.showOnlineRoomList();
        });

    }

    // showOnlineRoomList() {
    //     const onlineRoomList = document.createElement("online-room-list");

    //     onlineRoomList.classList.add("fade-in");

    //     this.innerHTML = "";
    //     this.appendChild(onlineRoomList);

    //     onlineRoomList.offsetWidth;

    //     onlineRoomList.classList.add("show");
    // }

}

customElements.define("online-mode", OnlineMode);