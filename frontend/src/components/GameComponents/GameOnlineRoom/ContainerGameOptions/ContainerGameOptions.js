import { roomData } from "../RoomPage.js";
import { GameMode } from "./GameMode.js";
import { GameTime } from "./GameTime.js";
import { GameTeamSize } from "./GameTeamSize.js";
import { Customizations } from "./Customizations.js";
import { GameBracketSize } from "./BracketSize.js";

const gameSetting = [
    {
        title : "Gamemode",
        element : new GameMode()
    },
    {
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
        const path = window.location.pathname;
        if (path === "/tournament") {
            gameSetting[1] = {
                title : "Bracket size",
                element : new GameBracketSize()
            }
        }
        else {
            gameSetting[1] = {
                title : "Time",
                element : new GameTime()
            }
        }
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
            // if (roomData.users && roomData.users.length >= 2) {
                const tournamentinputs = document.querySelectorAll("tournament-group input");
                const playersName = [];
                tournamentinputs.forEach(input => {
                    playersName.push(input.value)
                })
                roomData["playersName"] = playersName;
                console.log("start game: ", roomData);
            // }
            // else {
            //     const reminder = document.querySelector(".ContainerFooter_reminder");
            //     reminder.style.display = "block";
            //     setTimeout(() => {
            //         reminder.style.display = "none";
            //     }, 3000);
            // }
        }
    }
}

customElements.define("container-game-options", ContainerGameOptions);