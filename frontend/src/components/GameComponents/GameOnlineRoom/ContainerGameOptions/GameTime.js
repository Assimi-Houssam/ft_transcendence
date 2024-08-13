import { roomData } from "../Rooms.js";
export class GameTime extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        this.innerHTML = `
            <div id="BtnTime" class="BtnTime">
                <button name="fivemin">5</button>
                <button id="gameTime" name="treemin">3</button>
            </div>
        `

        const BtnTime = document.getElementById("BtnTime");
        for (let i = 0; i < BtnTime.children.length; i++) {
            BtnTime.children[i].addEventListener('click', () => {
                const gameTime = document.getElementById("gameTime");
                if (gameTime) gameTime.id = "";
                BtnTime.children[i].id = "gameTime";
                this.SellectTime = BtnTime.children[i];
                roomData.time = this.SellectTime.name;
                const RoomTeamTime = document.getElementById("RoomTeamTime");
                RoomTeamTime.innerHTML = `${roomData.time === "treemin" ? "3" : "5"} min`
            })
        }
    }
}

customElements.define("game-time", GameTime);