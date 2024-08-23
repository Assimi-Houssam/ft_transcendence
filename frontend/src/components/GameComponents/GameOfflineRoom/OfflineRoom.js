import { OfflineRoom1Vs1 } from "./Rooms/OfflineRoom1Vs1.js";
import { OfflineRoom2Vs1 } from "./Rooms/OfflineRoom2Vs1.js";
import { OfflineRoom2Vs2 } from "./Rooms/OfflineRoom2Vs2.js";

// export class OfflineRoom extends HTMLElement{
//     constructor(){
//         super();
//         this.bracketSize = 1;
//         this.teamSize = 1;
//     }

    
//     connectedCallback(){
//         let roomElement;
//         if (this.bracketSize === 1 && this.teamSize === 1) {
//             roomElement = '<offline-room-1vs1></offline-room-1vs1>';
//         } else if (this.bracketSize === 2 && this.teamSize === 1) {
//             roomElement = '<offline-room-2vs1></offline-room-2vs1>';
//         } else if (this.bracketSize === 2 && this.teamSize === 2) {
//             roomElement = '<offline-room-2vs2></offline-room-2vs2>';
//         }
//         this.innerHTML = `
//             <div>
//                 <div class="OfflineTournamentTitle">
//                     <h2>Offline tournament</h2>
//                 </div>
//                 <div class="content_line">
//                     <div class="line_x"></div>
//                 </div>
//             </div>
//             <div class="ContainerCardOffline">            
//                 ${roomElement}
//             </div>
//             <div class="content_line">
//                 <div class="line_x"></div>
//             </div>
//             <container-game-options></container-game-options>
//     `
//     }
// }

export class OfflineRoom extends HTMLElement{
    constructor(){
        super();
        this.bracketSize = 1;
        this.teamSize = 1;
    }

    static getInstance() {
        return document.querySelector('offline-room');
    }

    updateRoom() {
        let roomElement;
        if (this.bracketSize === 1 && this.teamSize === 1) {
            roomElement = '<offline-room-1vs1></offline-room-1vs1>';
        } else if (this.bracketSize === 2 && this.teamSize === 1) {
            roomElement = '<offline-room-2vs1></offline-room-2vs1>';
        } else if (this.bracketSize === 2 && this.teamSize === 2) {
            roomElement = '<offline-room-2vs2></offline-room-2vs2>';
        }
        this.innerHTML = `
            <div>
                <div class="OfflineTournamentTitle">
                    <h2>Offline tournament</h2>
                </div>
                <div class="content_line">
                    <div class="line_x"></div>
                </div>
            </div>
            <div class="ContainerCardOffline">            
                ${roomElement}
            </div>
            <div class="content_line">
                <div class="line_x"></div>
            </div>
            <container-game-options></container-game-options>
    `
    }

    connectedCallback(){
        this.updateRoom();
    }
}

customElements.define("offline-room", OfflineRoom);

const offlineRoom = OfflineRoom.getInstance();
if (offlineRoom) {
    // Replace 'change' with the actual event that is fired when the game settings change
    this.addEventListener('click', () => {
        offlineRoom.bracketSize = this.value; // or this.bracketSize, depending on your implementation
        offlineRoom.updateRoom();
    });
}