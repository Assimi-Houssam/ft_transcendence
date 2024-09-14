import getUserInfo from "../utils/services/userInfo.services.js";
import ApiWrapper from "../utils/ApiWrapper.js";

export class ChatSidebarEntry extends HTMLElement {
    constructor(name, id, pfp) {
        super();
        this.name = name;
        this.message_container = new ChatMessagesContainer();
        this.addEventListener("click", this.clickEventHandler.bind(this));
        this.id = id;
        this.pfp = pfp;
    }
    clickEventHandler() {
        this.dispatchEvent(new CustomEvent("chatEntryClick", { detail: this, bubbles: true }));
    }
    connectedCallback() {
        this.innerHTML = `${this.pfp ? `<img src="${ApiWrapper.getUrl() + this.pfp}">` : ""} </img> ${this.name}`;
    }
    onMessageReceived(time, username, message) {
        if (!time)
            time = Math.floor(Date.now() / 1000);
        this.message_container.addMessage(new ChatMessageEntry(time, username, message));
    }
}

customElements.define("chat-sidebar-entry", ChatSidebarEntry);

export class ChatSidebar extends HTMLElement {
    constructor() {
        super();
        this.sidebar_entries = [];
        this.sidebar_entries.push(new ChatSidebarEntry("#general", -1));
        this.active_sidebar_entry = this.sidebar_entries[0];
        this.active_sidebar_entry.style.border = '2px solid white';
    }
    connectedCallback() {
        for (let sidebarEntry of this.sidebar_entries) {
            this.appendChild(sidebarEntry);
        }
    }
    getActiveSidebarEntry() {
        return this.active_sidebar_entry;
    }
    setActiveSidebarEntry(newEntry) {
        this.active_sidebar_entry.style.border = '';
        this.active_sidebar_entry = newEntry;
        this.active_sidebar_entry.style.border = '2px solid white';
    }
    appendMessage(id, msg) {
        for (let sidebarEntry of this.sidebar_entries) {
            if (id == sidebarEntry.id) {
                sidebarEntry.onMessageReceived(msg.time, msg.username, msg.message);
                return;
            }
        }
    }
    getSidebarEntry(id) {
        for (let sidebarEntry of this.sidebar_entries) {
            if (id == sidebarEntry.id) {
                return sidebarEntry;
            }
        }
        return null;
    }
    createSideBarEntry(userId, username, pfp) {
        if (this.getSidebarEntry(userId))
            return;
        const newEntry = new ChatSidebarEntry(username, userId, pfp);
        this.sidebar_entries.push(newEntry);
        this.setActiveSidebarEntry(newEntry);
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
        this.messages.slice().reverse().forEach(msg => {this.appendChild(msg)});
    }
    addMessage(message) {
        this.messages.push(message);
        this.connectedCallback();
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

        const message = this.querySelector(".chat-message-input");

        if (!message) {
            return;
        }

        message.addEventListener("keypress", (evt) => {
            if (evt.key.toLowerCase() === "enter") {
               if(String(message.value).trim().length === 0)
                   return;
                this.dispatchEvent(new CustomEvent("chatPopupInputEnter", {detail: message.value, bubbles: true}));
                message.value = "";
            }
        });

        if (this.current_message_container) {
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
        this.user = null;
        this.popped = false;
        this.ws.onopen = async () => {
            this.chatMain.replaceMessageContainer(this.sidebar.getActiveSidebarEntry().message_container);
            this.user = await getUserInfo();
        }
        this.ws.onmessage = this.handleWsMessage.bind(this);
        
        this.addEventListener("chatEntryClick", (evt) => {
            const sidebar_entry = evt.detail;
            this.chatMain.replaceMessageContainer(sidebar_entry.message_container);
            this.sidebar.setActiveSidebarEntry(evt.detail);
        });
        this.outerClickHandler = (e) => {
            if (!e.target.className.startsWith("chat") && !e.target.localName.startsWith("chat"))
                this.pop();        
        };
        this.addEventListener("chatPopupInputEnter", this.handleInputEnter.bind(this));
        document.addEventListener("notiReceivedDm", this.handleDirectMessage.bind(this));
        document.addEventListener("chatDmStarted", this.startChatDm.bind(this));
    }
    handleInputEnter(evt) {
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
            console.log("detail:", evt_detail);
            document.dispatchEvent(new CustomEvent("notiSendDM", {detail: evt_detail, bubbles: true}));
            const ts = Math.floor(Date.now() / 1000);
            console.log("ts:", ts);
            this.sidebar.appendMessage(evt_detail.userId, { message: msg, username: this.user.username, time: null });
        }
    }
    startChatDm(evt) {
        const userInfo = evt.detail;
        console.log("chat dm userinfo:", userInfo);
        if (!this.popped)
            this.pop();
        this.sidebar.createSideBarEntry(userInfo.userId, userInfo.username, userInfo.pfp);
        this.chatMain.replaceMessageContainer(this.sidebar.getActiveSidebarEntry().message_container);
    }
    handleDirectMessage(evt) {
        const messageDetails = evt.detail;
        const sidebarEntry = this.sidebar.getSidebarEntry(messageDetails.from.id);
        if (!sidebarEntry)
            this.sidebar.createSideBarEntry(messageDetails.from.id, messageDetails.from.username, messageDetails.from.pfp);
        const messageEntryRaw = {
            message: messageDetails.message,
            username: messageDetails.from.username,
            time: messageDetails.time
        }
        this.sidebar.appendMessage(messageDetails.from.id, messageEntryRaw);
    }
    handleWsMessage(evt) {
        const msg = JSON.parse(evt.data);
        this.sidebar.appendMessage(-1, msg);
    }
    connectedCallback() {
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
    pop() {
        if (this.popped) {
            this.popped = false;
            this.hide();
        }
        else {
            this.popped = true;
            this.show();
        }
    }
    show() {
        document.body.appendChild(this);
        document.getElementById('root').style.pointerEvents = 'none';
        anime({
            targets: this,
            top: ["100%", "55%"],
            opacity: 1,
            duration: 450,
            easing: 'easeOutQuint',
            complete: () => {
                document.body.addEventListener("click", this.outerClickHandler);
            }
        });
    }
    hide() {
        document.getElementById('root').style.pointerEvents = 'auto';
        document.body.removeEventListener("click", this.outerClickHandler);
        anime({
            targets: this,
            top: ["55%", "100%"],
            opacity: 0,
            duration: 500,
            easing: 'easeOutQuint',
            complete: () => {
                try {
                    if (!this.popped) {
                        document.body.removeChild(this);
                    }
                }
                catch (e) { }
            }
        });
    }
}

customElements.define("chat-popup", ChatPopup);