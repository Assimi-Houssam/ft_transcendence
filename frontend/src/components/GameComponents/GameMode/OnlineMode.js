import { GameSelection } from "../../../pages/GameSelectionMenu.js";
import { router } from "../../../routes/routes.js";

export class OnlineMode extends HTMLElement{
    constructor(){
        super();
    }
    connectedCallback(){
        this.innerHTML = `
            <button class="btn-gameselection" id="BtnOnlineMode">
                <img src="../../../assets/images/onlineMode.png" width="183px">
                <p>Online Mode</p>
            </button>
        `
        const BtnOnlineMode = document.getElementById("BtnOnlineMode");
        BtnOnlineMode.addEventListener("click", () => {
            router.navigate("/rooms");
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