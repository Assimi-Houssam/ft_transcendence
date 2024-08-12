export class ContainerGameOptions extends HTMLElement {
    constructor(){
        super();
    }

    connectedCallback(){
        this.innerHTML = `
            <div class="ContainerGameOptions">
                <div class="ContainerGameOptions_Gamemode">
                    <h2>Gamemode</h2>
                    <game-mode></game-mode>
                </div>
                <div style="height: 100%;display: flex;align-items: center;">
                    <div class="line_y"></div>
                </div>
                <div class="ContainerGameOptions_Time">
                    <h2>Time</h2>
                    <game-time></game-time>
                </div>
                <div style="height: 100%;display: flex;align-items: center;">
                    <div class="line_y"></div>
                </div>
                <div class="ContainerGameOptions_Team">
                    <h2>Team size</h2>
                    <game-team-size></game-team-size>
                </div>
                <div style="height: 100%;display: flex;align-items: center;">
                    <div class="line_y"></div>
                </div>
                <div class="ContainerGameOptions_Customizations">
                    <h2>Customizations</h2>
                    <game-customiz></game-customiz>
                </div>
            </div>
            <div class="ContinerFooter">
                <div>
                    <p class="ContinerFooter_reminder">Unable to start the game: not enough players in the room</p>
                </div>
                <div class="BtnStartGame">
                    <button type="button" id="BtnStartGame">Start game!</button>
                </div>
            </div>
        `
    }
}

customElements.define("container-game-options", ContainerGameOptions);