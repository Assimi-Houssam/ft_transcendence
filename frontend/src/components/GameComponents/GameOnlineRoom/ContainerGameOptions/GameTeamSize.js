export class GameTeamSize extends HTMLElement {
    constructor(){
        super();
        this.SelectTeamSize;
    }

    connectedCallback() {
        this.innerHTML = `
            <div id="BtnTeamSize" class="BtnTeamSize">
                <button name="oneTeam">1</button>
                <button name="twoTeam">2</button>
            </div>
        `

        const BtnTeamSize = document.getElementById("BtnTeamSize");

        for (let i = 0; i < BtnTeamSize.children.length; i++) {
            BtnTeamSize.children[i].addEventListener("click", () => {
                if (this.SelectTeamSize?.id)
                    this.SelectTeamSize.id = "";
                BtnTeamSize.children[i].id = "gameTeamSize";
                this.SelectTeamSize = BtnTeamSize.children[i];
                console.log("Team: ", this.SelectTeamSize.name);
            })
        }
    }
}

customElements.define("game-team-size", GameTeamSize);