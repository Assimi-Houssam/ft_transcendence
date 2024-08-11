import { OnlineMode } from "../../components/GameComponents/GameMode/OnlineMode.js";
import { OfflineMode } from "../../components/GameComponents/GameMode/OfflineMode.js";
import { router } from "../../routes/routes.js";
import { OnlineRoomList } from "../../components/GameComponents/GameOnlineRoom/OnlineRoomList.js";
import { GameMode } from "../../components/GameComponents/GameOnlineRoom/ContainerGameOptions/GameMode.js";
import { GameTime } from "../../components/GameComponents/GameOnlineRoom/ContainerGameOptions/GameTime.js";
import { GameTeamSize } from "../../components/GameComponents/GameOnlineRoom/ContainerGameOptions/GameTeamSize.js";
import { Customizations } from "../../components/GameComponents/GameOnlineRoom/ContainerGameOptions/Customizations.js";
import { InviteFriends } from "../../components/GameComponents/GameOnlineRoom/InviteFriends.js";
import { RoomName } from "../../components/GameComponents/GameOnlineRoom/RoomName/RoomName.js";


export class GameSelection extends HTMLElement {
    constructor() {
        super();
        this.roomName = "";
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="ContainerGameSelection" id="GameSelection_">
                <online-mode name="OnlineMode"></online-mode>
                <offline-mode name="OflineMode""></offline-mode>
            </div>
        `;

        const GameSelection = document.getElementById("GameSelection_");
        for (let i = 0; i < GameSelection.children.length; i++) {
            GameSelection.children[i].addEventListener('click', () => {
                if (this.GameSelected?.id)
                    this.GameSelected.id = ""
                GameSelection.children[i].id = "gameselection";
                this.GameSelected = GameSelection.children[i];
                console.log("selected: ", this.GameSelected.getAttribute('name'))
            })
        }
    }
}

customElements.define("game-selection", GameSelection);



{/* <div class="ContainerPopupInviteFreiends">
    <div class="ContainerPopupInviteFreiends_card">
        <div class="TitlePopup">
            <h2>Invite friends</h2>
        </div>
        <div class="content_line">
            <div class="line_x">
            </div>
        </div>
        <div class="InviteFreindsPopup">
            <div class="InviteFreindsPopupNoOne">
                    <h3>No one is currently online :(</h3>
            </div>
        </div>
    </div>
</div> */}