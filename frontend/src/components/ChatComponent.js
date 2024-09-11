export class ChatSidebarEntry extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
            #general
        `;
    }
}

export class ChatSidebar extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = ``;
    }
};

customElements.define("chat-sidebar", ChatSidebar);

export class ChatPopup extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
            <div class="chat-popup-header">
                <img src="../../assets/icons/chat.png">
                Chat
            </div>
            <div class="chat-popup-content"></div>`;
        this.querySelector(".chat-popup-content").appendChild(new ChatSidebar());
    }
}

customElements.define("chat-popup", ChatPopup);