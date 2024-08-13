import { roomData } from "../Rooms.js";
export class GameMode extends HTMLElement {
    constructor(){
        super();
    }

    connectedCallback(){
        this.innerHTML = `
            <div id="BtnGameMode" class="BtnGamemode">
                <button name="hokey">
                    <img src="../../../assets/images/hoky.png" width="35px">
                </button>
                <button id="gameMode" name="pingpong">
                    <img src="../../../assets/images/ping.png" width="35px">
                </button>
            </div>
        `

        const BtnGameMode = document.getElementById("BtnGameMode");
        for (let i = 0; i < BtnGameMode.children.length; i++) {
            BtnGameMode.children[i].addEventListener("click", () => {
                const gameMode = document.getElementById("gameMode");
                if (gameMode) gameMode.id = "";
                BtnGameMode.children[i].id = "gameMode";
                this.SelectedGameMode = BtnGameMode.children[i];
                roomData.gameMood  = this.SelectedGameMode.name;
                const RoomTeamGameType = document.getElementById("RoomTeamGameType");
                if (roomData.gameMood === "hokey") 
                    RoomTeamGameType.src = "../../../assets/images/hoky.png"
                else
                    RoomTeamGameType.src = "../../../assets/images/ping.png"
                console.log("selected: ", this.SelectedGameMode.name);
            })
        }
    }
}

customElements.define("game-mode", GameMode);