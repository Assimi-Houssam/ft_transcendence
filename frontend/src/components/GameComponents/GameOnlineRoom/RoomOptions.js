class RoomOption extends HTMLElement {
    constructor(name, color, options, optionsImgs, evtName, optional = false) {
        super();
        this.name = name;
        this.color = color;
        this.options = options;
        this.optionsImgs = optionsImgs;
        this.evtName = evtName;
        this.optional = optional;
        this.selected = !this.optional ? options[0] : null;
    }
    connectedCallback() {
        this.innerHTML = `
            <h2>${this.name}</h2>
            <div class="OptionsContainer">
                <button name="${this.options[0]}" style="border: 6px solid ${this.color}">
                    ${this.optionsImgs.length ? `<img src="${this.optionsImgs[0]}" style="width: 50%"></img>` : this.options[0]}
                </button>
                <button name="${this.options[1]}" style="border: 6px solid ${this.color}">
                    ${this.optionsImgs.length ? `<img src="${this.optionsImgs[1]}" style="width: 50%"></img>` : this.options[1]}
                </button>
            </div>`;
        const buttons = this.querySelectorAll("button");
        
        if (!this.optional)
            buttons[0].style.backgroundColor = this.color;

        buttons.forEach((elem) => { elem.addEventListener("click", (evt) => {
            const target = evt.target.tagName === "IMG" ? evt.target.parentNode : evt.target;
            if (this.selected === target.name && !this.optional)
                return;
            buttons.forEach((button) => { button.style.backgroundColor = ""; });
            if (this.selected === target.name && this.optional) {
                this.selected = "";
                this.dispatchEvent(new CustomEvent(this.evtName, { detail: this.selected, bubbles: true }));
                return;
            }
            target.style.backgroundColor = this.color;
            this.selected = target.name;
            this.dispatchEvent(new CustomEvent(this.evtName, { detail: this.selected, bubbles: true }));
        })});
    }
}

customElements.define("room-option", RoomOption);


export class RoomOptions extends HTMLElement {

    connectedCallback() {
        this.appendChild(new RoomOption("Gamemode", "#581352", ["hockey", "pong"], ["../../../assets/images/pong.png", "../../../assets/images/hockey.png"], "gameModeChange"));
        this.appendChild(new RoomOption("Time", "#24CE90", ["3", "5"], [], "timeChange"));
        this.appendChild(new RoomOption("Team size", "#FAE744", ["1", "2"], [], "teamSizeChange"));
        this.appendChild(new RoomOption("Customizations", "#FF6666", ["hidden", "fastForward"], ["../../../../assets/icons/half.png", "../assets/icons/forward.png"], "customizationChange", true));
    }
}

customElements.define("room-options", RoomOptions);