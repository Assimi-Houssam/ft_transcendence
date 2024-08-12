export class GameMode extends HTMLElement {
    constructor(){
        super();
        this.SelectedGameMode;
    }

    connectedCallback(){
        this.innerHTML = `
            <div id="BtnGameMode" class="BtnGamemode">
                <button name="hokey">
                    <img src="../../../assets/images/hoky.png" width="35px">
                </button>
                <button name="pingpong">
                    <img src="../../../assets/images/ping.png" width="35px">
                </button>
            </div>
        `

        const BtnGameMode = document.getElementById("BtnGameMode");
        for (let i = 0; i < BtnGameMode.children.length; i++) {
            BtnGameMode.children[i].addEventListener("click", () => {
                if (this.SelectedGameMode?.id)
                    this.SelectedGameMode.id = "";
                BtnGameMode.children[i].id = "gameMode";
                this.SelectedGameMode = BtnGameMode.children[i];
                console.log("selected: ", this.SelectedGameMode.name);
            })
        }
    }
}

customElements.define("game-mode", GameMode);