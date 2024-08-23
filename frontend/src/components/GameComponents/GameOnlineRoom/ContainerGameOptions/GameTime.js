import { roomData } from "../RoomPage.js";

export class GameTime extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div id="BtnTime" class="BtnTime">
                <button name="5">5</button>
                <button id="gameTime" name="3">3</button>
            </div>
        `

        const btnTime = document.getElementById("BtnTime");
        for (let i = 0; i < btnTime.children.length; i++) {
            btnTime.children[i].addEventListener('click', () => {
                const gameTime = document.getElementById("gameTime");
                if (gameTime) gameTime.id = "";
                btnTime.children[i].id = "gameTime";
                let selectedTime = BtnTime.children[i];
                roomData.time = selectedTime.name;
                const roomTeamTime = document.getElementById("RoomTeamTime");
                roomTeamTime.innerHTML = `${roomData.time === "3" ? "3" : "5"} min`
            })
        }
    }
}

customElements.define("game-time", GameTime);