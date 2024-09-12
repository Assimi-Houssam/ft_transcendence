export class ChatSidebarEntry extends HTMLElement {
    constructor(name) {
        super();
        this.name = name;
        this.message_container = new ChatMessagesContainer();
        this.addEventListener("click", this.clickEventHandler.bind(this));
    }
    clickEventHandler() {
        this.dispatchEvent(new CustomEvent("chatEntryClick", { detail: this, bubbles: true }));
    }
    connectedCallback() {
        this.innerHTML = `${this.name}`;
    }
    onMessageReceived(time, username, message) {
        this.message_container.addMessage(new ChatMessageEntry(time, username, message));
        this.message_container.connectedCallback();
    }
}

customElements.define("chat-sidebar-entry", ChatSidebarEntry);

export class ChatSidebar extends HTMLElement {
    constructor() {
        super();
        this.general_entry = new ChatSidebarEntry("#general");
    }
    connectedCallback() {
        this.appendChild(this.general_entry);
        setTimeout(() => {
            console.log("triggering message!");
            // callback dial websocket
            this.general_entry.onMessageReceived("okay", "miyako", "hello2");
        }, 3000);
        this.appendChild(new ChatSidebarEntry("#test"));
    }
};

customElements.define("chat-sidebar", ChatSidebar);

export class ChatMessageEntry extends HTMLElement {
    constructor(time, username, message) {
        super();
        this.time = time;
        this.username = username;
        this.message = message;
    }
    connectedCallback() {
        this.innerHTML = `
            <span class="msg-time">22:00:00</span>
            <span class="chat-username">${this.username}</span>
            <span class="chat-message">${this.message}</span>
        `;
    }
}

customElements.define("chat-messages-entry", ChatMessageEntry);

export class ChatMessagesContainer extends HTMLElement {
    constructor() {
        super();
        this.messages = [];
    }
    connectedCallback() {
        for (let message of this.messages) {
            this.appendChild(message);
        }
    }
    addMessage(message) {
        this.messages.push(message);
    }
};

customElements.define("chat-messages-container", ChatMessagesContainer);

export class ChatMain extends HTMLElement {
    constructor() {
        super();
        this.current_message_container = null;
    }
    connectedCallback() {
        this.innerHTML = `
            <div class="input_chat_popup">
                <input type="text" placeholder="Type something..." class="chat-message-input" id="chat-message-input">
            </div>`;
        if (this.current_message_container)
            this.appendChild(this.current_message_container);
    }
    replaceMessageContainer(new_message_container) {
        this.current_message_container = new_message_container;
        this.connectedCallback();
    }
};

customElements.define("chat-main", ChatMain);

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
            <div class="chat-main-container">
            </div>`;
        const chatMain = new ChatMain();
        this.querySelector(".chat-main-container").appendChild(new ChatSidebar());
        this.querySelector(".chat-main-container").appendChild(chatMain);
        this.addEventListener("chatEntryClick", (evt) => {
            const sidebar_entry = evt.detail;
            chatMain.replaceMessageContainer(sidebar_entry.message_container);
            console.log("entry clicked:", evt.detail.name);
        });
    }
}

customElements.define("chat-popup", ChatPopup);