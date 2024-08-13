import { roomData } from "../Rooms.js";

const gameSetting = [
    {
        title : "Gamemode",
        element : "<game-mode></game-mode>"
    },
    {
        title : "Time",
        element : "<game-time></game-time>"
    },
    {
        title : "Team size",
        element : "<game-team-size></game-team-size>"
    },
    {
        title : "Customizations",
        element : "<game-customiz></game-customiz>"
    },
]

export class ContainerGameOptions extends HTMLElement {
    constructor(){
        super();
    }

    connectedCallback(){
        this.innerHTML = `
            <div class="ContainerGameOptions">
                ${gameSetting.map((item, index) => (
                    `
                        <div class="ContainerGameOptions_Team">
                            <h2>${item.title}</h2>
                            ${item.element}
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
            <div class="ContinerFooter">
                <div>
                    <p class="ContinerFooter_reminder">Unable to start the game: not enough players in the room</p>
                </div>
                <div class="BtnStartGame">
                    <button type="button" id="BtnStartGame">Start game!</button>
                </div>
            </div>
        `

        const BtnStartGame =document.getElementById("BtnStartGame");
        BtnStartGame.onclick = (e) => {
            console.log("roome : ", roomData)
        }
    }
}

customElements.define("container-game-options", ContainerGameOptions);