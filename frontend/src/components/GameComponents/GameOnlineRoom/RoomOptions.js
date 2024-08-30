class RoomOption extends HTMLElement {
    constructor(name, color, options, optionsImgs, evtName, optional = false, locked = false) {
        super();
        this.name = name;
        this.color = color;
        this.options = options;
        this.optionsImgs = optionsImgs;
        this.evtName = evtName;
        this.optional = optional;
        this.selected = !this.optional ? options[0] : null;
        this.locked = locked;
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

        buttons.forEach((elem) => {
            if (this.locked)
                return; 
            elem.addEventListener("click", (evt) => {
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
    enableOpt(opt) {
        if (!this.options.includes(opt))
            return;
        const buttons = this.querySelectorAll("button");
        for (let button of buttons) {
            if (button.name === opt) {
                buttons.forEach((buttonn) => { buttonn.style.backgroundColor = ""; });
                button.style.backgroundColor = this.color;
                this.selected = opt;
            }
        }
    }
}

customElements.define("room-option", RoomOption);


export class RoomOptions extends HTMLElement {
    constructor(roomData = null, locked = false) {
        super();
        this.gameModeOpt = new RoomOption("Gamemode", "#581352", ["pong", "hockey"], ["../../../assets/images/pong.png", "../../../assets/images/hockey.png"], "gameModeChange", false, locked);
        this.timeOpt = new RoomOption("Time", "#24CE90", ["3", "5"], [], "timeChange", false, locked);
        this.teamSizeOpt = new RoomOption("Team size", "#FAE744", ["1", "2"], [], "teamSizeChange", false, locked);
        this.customizationsOpt = new RoomOption("Customizations", "#FF6666", ["hidden", "fastForward"], ["../../../../assets/icons/half.png", "../assets/icons/forward.png"], "customizationChange", true, locked);
        this.roomData = roomData;
    }
    connectedCallback() {
        this.appendChild(this.gameModeOpt);
        this.appendChild(this.timeOpt);
        this.appendChild(this.teamSizeOpt);
        this.appendChild(this.customizationsOpt);
    }
    update(roomData) {
        this.roomData = roomData;
        this.enableOption("Gamemode", roomData.gamemode);
        this.enableOption("Time", roomData.time);
        this.enableOption("Teamsize", roomData.teamSize);
        this.enableOption("Customizations", roomData.customization);
    }
    enableOption(optName, optVal) {
        switch (optName) {
            case "Gamemode": {
                this.gameModeOpt.enableOpt(optVal);
                return;
            }
            case "Time": {
                this.timeOpt.enableOpt(optVal);
                return;
            }
            case "Teamsize": {
                this.teamSizeOpt.enableOpt(optVal);
                return;
            }
            case "Customizations": {
                this.customizationsOpt.enableOpt(optVal);
                return;
            }
        }
    }
}

customElements.define("room-options", RoomOptions);