import { roomData } from "../RoomPage.js";

export class Customizations extends HTMLElement {
    constructor() {
        super();
        this.SelectCustomizations = null;
    }

    connectedCallback() {
        this.innerHTML = `
            <div id="BtnCustomizations" class="BtnCustomizations">
                <button name="half">
                    <img src="../../../assets/icons/half.png">
                </button>
                <button name="forward">
                    <img src="../../../assets/icons/forward.png">
                </button>
            </div>
        `

        const btnCustomizations = document.getElementById("BtnCustomizations");
        for (let i = 0; i < btnCustomizations.children.length; i++) {
            btnCustomizations.children[i].addEventListener('click', () => {
                if (this.SelectCustomizations === btnCustomizations.children[i]) {
                    btnCustomizations.children[i].id = this.SelectCustomizations = "";
                    return;
                }
                if (this.SelectCustomizations?.id)
                    this.SelectCustomizations.id = "";
                btnCustomizations.children[i].id = "customizations";
                this.SelectCustomizations = btnCustomizations.children[i];
                console.log("customization:", this.SelectCustomizations.name);
            });
        }
    }
}

customElements.define("game-customization", Customizations);