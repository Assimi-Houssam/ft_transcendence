export class GameTime extends HTMLElement{
    constructor(){
        super();
        this.SellectTime;
    }

    connectedCallback(){
        this.innerHTML = `
            <div id="BtnTime" class="BtnTime">
                <button name="fivemin">5</button>
                <button name="treemin">3</button>
            </div>
        `

        const BtnTime = document.getElementById("BtnTime");
        for (let i = 0; i < BtnTime.children.length; i++) {
            BtnTime.children[i].addEventListener('click', () => {
                if (this.SellectTime?.id)
                    this.SellectTime.id = "";
                BtnTime.children[i].id = "gameTime";
                this.SellectTime = BtnTime.children[i];
                console.log("time: ", this.SellectTime.name);
            })
        }
    }
}

customElements.define("game-time", GameTime);