import getUserInfo from "../utils/services/userInfo.services.js";

export class ChatSidebarEntry extends HTMLElement {
    constructor(name, id) {
        super();
        this.name = name;
        this.message_container = new ChatMessagesContainer();
        this.addEventListener("click", this.clickEventHandler.bind(this));
        this.id = id;
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
        this.sidebar_entries = [];
        this.sidebar_entries.push(new ChatSidebarEntry("#general", -1));
        this.active_sidebar_entry = this.sidebar_entries[0];
    }
    connectedCallback() {
        for (let sidebarEntry of this.sidebar_entries) {
            this.appendChild(sidebarEntry);
        }
    }
    getActiveSidebarEntry() {
        return this.active_sidebar_entry;
    }
    appendMessage(id, msg) {
        for (let sidebarEntry of this.sidebar_entries) {
            if (id == sidebarEntry.id) {
                console.log(msg)
                sidebarEntry.onMessageReceived(msg.time, msg.username, msg.message);
            }
        }
    }
    createSideBarEntry(userId, username, pfp) {
        const newEntry = new ChatSidebarEntry(username, userId);
        this.sidebar_entries.push(newEntry);
        this.active_sidebar_entry = newEntry;
        this.connectedCallback();
    }
}

customElements.define("chat-sidebar", ChatSidebar);

export class ChatMessageEntry extends HTMLElement {
    constructor(time, username, message, isRoomHost) {
        super();
        this.time = time;
        this.username = username;
        this.message = message;
        this.isRoomHost = isRoomHost;

        const now = new Date(this.time * 1000);
        this.hours = now.getHours();
        console.log("hours:", now.getHours());
        this.minutes = now.getMinutes();
        this.seconds = now.getSeconds();
        this.websocket = null;
    }

    async connectedCallback() {
        this.isRoomHost = true;
        this.innerHTML = `
            <span class="msg-time">${this.hours}:${this.minutes < 10 ? `0${this.minutes}` : `${this.minutes}`}:${this.seconds < 10 ? `0${this.seconds}` : `${this.seconds}`}</span>
            <span class="chat-username" ${this.isRoomHost ? `style="color: purple;"` : `style="color: green;"`}>${this.username}</span>            </div>
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
    async connectedCallback() {
        this.innerHTML = `
            <div class="input_chat_popup">
                <input type="text" placeholder="Type something..." class="chat-message-input" id="chat-message-input">
            </div>`;

        // console.log(this.innerHTML);

        const message = this.querySelector(".chat-message-input");
        console.log('Message input field:', message);

        if (!message) {
            console.error("Message input field not found!");
            return;
        }

        message.addEventListener("keypress", (evt) => {
            if (evt.key.toLowerCase() === "enter") {
               if(String(message.value).trim().length === 0)
                   return;
                console.log('Sending message:', message.value);
                this.dispatchEvent(new CustomEvent("chatPopupInputEnter", {detail: message.value, bubbles: true}));
                message.value = "";
            }
        });
        if (this.current_message_container) {
            console.log("message cont: ", this.current_message_container);
            this.appendChild(this.current_message_container);
        }
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
        this.sidebar = new ChatSidebar();
        this.chatMain = new ChatMain();
        this.ws = new WebSocket("ws://localhost:8000/ws/chat/");
        this.ws.onopen = () => {
            console.log("connected to server");
            this.chatMain.replaceMessageContainer(this.sidebar.getActiveSidebarEntry().message_container);
        }
        this.ws.onmessage = this.handleWsMessage.bind(this);
        this.addEventListener("chatPopupInputEnter", (evt) => {
            const msg = evt.detail;
            console.log("active sidebar entry:", this.sidebar.getActiveSidebarEntry().id);
            if (this.sidebar.getActiveSidebarEntry().id == -1) {
                console.log("msg aaa:", msg);
                this.ws.send(JSON.stringify({"message": msg}));
            }
            else {
                console.log("sending dm to notificiation");
                const evt_detail = {
                    message: msg,
                    userId: this.sidebar.getActiveSidebarEntry().id
                }
                document.dispatchEvent(new CustomEvent("notiSendDM", {detail: evt_detail, bubbles: true}));
            }
        });
        this.addEventListener("chatEntryClick", (evt) => {
            const sidebar_entry = evt.detail;
            this.chatMain.replaceMessageContainer(sidebar_entry.message_container);
            this.sidebar.active_sidebar_entry = evt.detail;
            console.log("entry clicked:", evt.detail.name);
        });
        document.addEventListener("notiReceivedDm", this.handleDirectMessage.bind(this));
        document.addEventListener("chatDmStarted", this.startChatDm.bind(this));
    }
    startChatDm(evt) {
        const userInfo = evt.detail;
        console.log("chat dm userinfo:", userInfo);
        this.show();
        this.sidebar.createSideBarEntry(userInfo.id, userInfo.username, userInfo.pfp);
    }
    handleDirectMessage(evt) {

    }
    handleWsMessage(evt) {
        const msg = JSON.parse(evt.data);
        this.sidebar.appendMessage(-1, msg);
        console.log("received message from server:", msg);
        
    }
    async connectedCallback() {
        this.innerHTML = `
            <div class="chat-popup-header">
                <img src="../../assets/icons/chat.png">
                Chat
            </div>
            <div class="chat-main-container">
            </div>`;
        this.querySelector(".chat-main-container").appendChild(this.sidebar);
        this.querySelector(".chat-main-container").appendChild(this.chatMain);
    
    }
    show() {
        document.body.appendChild(this);
    }
    hide() {
        document.body.removeChild(this);
    }
}

customElements.define("chat-popup", ChatPopup);