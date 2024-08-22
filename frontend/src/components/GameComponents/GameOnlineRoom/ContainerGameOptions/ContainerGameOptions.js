import { roomData } from "../RoomPage.js";
import { GameMode } from "./GameMode.js";
import { GameTime } from "./GameTime.js";
import { GameTeamSize } from "./GameTeamSize.js";
import { Customizations } from "./Customizations.js";

const gameSetting = [
    {
        title : "Gamemode",
        element : new GameMode()
    },
    {
        title : "Time",
        element : new GameTime()
    },
    {
        title : "Team size",
        element : new GameTeamSize()
    },
    {
        title : "Customizations",
        element : new Customizations()
    },
]

export class ContainerGameOptions extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="ContainerGameOptions">
                ${gameSetting.map((item, index) => (
                    `
                        <div class="ContainerGameOptions_Team">
                            <h2>${item.title}</h2>
                            ${item.element.outerHTML}
                        </div>
                        ${index + 1 < gameSetting.length ? (
                            `
                                <div style="height: 100%;display: flex;align-items: center;">
                                    <div class="line_y"></div>
                                </div>
                            `
                        ) : ""}
                    `
                )).join("")}
            </div>
            <div class="ContainerFooter">
                <div>
                    <p style="display:none;" class="ContainerFooter_reminder">Unable to start the game: not enough players in the room</p>
                </div>
                <div class="BtnStartGame">
                    <button type="button" id="BtnStartGame">Start game!</button>
                </div>
            </div>
        `

        const btnStartGame = document.getElementById("BtnStartGame");
        btnStartGame.onclick = (e) => {
            console.log("room data: ", roomData)
        }
    }
}

customElements.define("container-game-options", ContainerGameOptions);