import { roomData } from "../RoomPage.js";

export class GameMode extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div id="BtnGameMode" class="BtnGamemode">
                <button name="hokey">
                    <img src="../../../assets/images/hockey.png" width="35px">
                </button>
                <button id="gameMode" name="pong">
                    <img src="../../../assets/images/pong.png" width="35px">
                </button>
            </div>`;

        const BtnGameMode = document.getElementById("BtnGameMode");
        for (let i = 0; i < BtnGameMode.children.length; i++) {
            BtnGameMode.children[i].addEventListener("click", () => {
                const gameMode = document.getElementById("gameMode");
                if (gameMode) gameMode.id = "";
                BtnGameMode.children[i].id = "gameMode";
                this.SelectedGameMode = BtnGameMode.children[i];
                roomData.gameMode  = this.SelectedGameMode.name;
                const RoomTeamGameType = document.getElementById("RoomTeamGameType");
                RoomTeamGameType.src = roomData.gameMode === "hokey" ? "../../../assets/images/hockey.png" : "../../../assets/images/pong.png";
                console.log("selected: ", this.SelectedGameMode.name);
            })
        }
    }
}

customElements.define("game-mode", GameMode);