import { roomData } from "../Rooms.js";

export class Customizations extends HTMLElement{
    constructor(){
        super();
        this.SelectCustomizations;
    }

    connectedCallback(){
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

        const BtnCustomizations = document.getElementById("BtnCustomizations");
        for (let i = 0; i < BtnCustomizations.children.length; i++) {
            BtnCustomizations.children[i].addEventListener('click', () => {
                if (this.SelectCustomizations?.id)
                    this.SelectCustomizations.id = ""
                BtnCustomizations.children[i].id = "customizations";
                this.SelectCustomizations = BtnCustomizations.children[i];
                console.log("Customizations", this.SelectCustomizations.name);
            })
        }
    }
}

customElements.define("game-customiz", Customizations);