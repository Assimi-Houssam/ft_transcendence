import { Tournament } from "../../GameOfflineRoom/tournament/Tournament.js";
import { roomData } from "../RoomPage.js";
export class GameBracketSize extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        this.innerHTML = `
            <div id="BtnBracketSize" class="BtnTime">
                <button id="gameBracketSize" name="1">1</button>
                <button name="2">2</button>
            </div>
        `

        const BtnBracketSize = document.getElementById("BtnBracketSize");
        for (let i = 0; i < BtnBracketSize.children.length; i++) {
            BtnBracketSize.children[i].addEventListener('click', () => {
                const gameBracketSize = document.getElementById("gameBracketSize");
                if (gameBracketSize) gameBracketSize.id = "";
                BtnBracketSize.children[i].id = "gameBracketSize";
                this.SellectBracketSize = BtnBracketSize.children[i];
                roomData.bracketSize = this.SellectBracketSize.name;
                console.log("roomData.bracketSize : ", roomData.bracketSize);
                const tournament  = document.getElementById("tournament_node");
                if (tournament) {
                    console.log("parseInt(roomData.bracketSize) -> ", parseInt(roomData.bracketSize))
                    const tourn =  new Tournament(parseInt(roomData.teamSize), parseInt(roomData.bracketSize));
                    tournament.replaceChildren(tourn)
                }
            })
        }
    }
}

customElements.define("game-bracket-size", GameBracketSize);