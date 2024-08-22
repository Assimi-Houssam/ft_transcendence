import { roomData } from "../RoomPage.js";

export class GameMode extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div id="BtnGameMode" class="BtnGamemode">
                <button name="hockey">
                    <img src="../../../assets/images/hockey.png" width="35px">
                </button>
                <button id="gameMode" name="pong">
                    <img src="../../../assets/images/pong.png" width="35px">
                </button>
            </div>`;

        const btnGameMode = document.getElementById("BtnGameMode");
        for (let i = 0; i < btnGameMode.children.length; i++) {
            btnGameMode.children[i].addEventListener("click", () => {
                const gameMode = document.getElementById("gameMode");
                if (gameMode) gameMode.id = "";
                btnGameMode.children[i].id = "gameMode";
                const selectedGameMode = btnGameMode.children[i];
                roomData.gamemode  = selectedGameMode.name;
                const roomTeamGameType = document.getElementById("RoomTeamGameType");
                roomTeamGameType.src = roomData.gamemode === "hockey" ? "../../../assets/images/hockey.png" : "../../../assets/images/pong.png";
                console.log("gamemode: ", selectedGameMode.name);
            })
        }
    }
}

customElements.define("game-mode", GameMode);