import getUserInfo from "../utils/services/userInfo.services.js";
import ApiWrapper from "../utils/ApiWrapper.js";
import Toast from "./Toast.js";
import { router } from "../routes/routes.js";

export class ChatSidebarEntry extends HTMLElement {
    constructor(name, id, pfp) {
        super();
        this.name = name;
        this.messageContainer = new ChatMessagesContainer();
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
        this.messageContainer.addMessage(new ChatMessageEntry(time, username, message));
    }
}

customElements.define("chat-sidebar-entry", ChatSidebarEntry);

export class ChatSidebar extends HTMLElement {
    constructor() {
        super();
        this.sidebarEntries = [];
        this.sidebarEntries.push(new ChatSidebarEntry("#general", -1));
        this.activeSidebarEntry = this.sidebarEntries[0];
        this.activeSidebarEntry.style.border = '2px solid white';
    }
    connectedCallback() {
        for (let sidebarEntry of this.sidebarEntries) {
            this.appendChild(sidebarEntry);
        }
    }
    getActiveSidebarEntry() {
        return this.activeSidebarEntry;
    }
    setActiveSidebarEntry(newEntry) {
        this.activeSidebarEntry.style.border = '';
        this.activeSidebarEntry = newEntry;
        this.activeSidebarEntry.style.border = '2px solid white';
    }
    appendMessage(id, msg) {
        for (let sidebarEntry of this.sidebarEntries) {
            if (id == sidebarEntry.id) {
                sidebarEntry.onMessageReceived(msg.time, msg.username, msg.message);
                return;
            }
        }
    }
    getSidebarEntry(id) {
        for (let sidebarEntry of this.sidebarEntries) {
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
        this.sidebarEntries.push(newEntry);
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
        this.messages.slice().reverse().forEach(msg => { this.appendChild(msg); });
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
        this.currentMessageContainer = null;
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
                if (message.value === "/invite") {
                    console.log("dispatching chatSendInvite event");
                    this.dispatchEvent(new CustomEvent("chatSendInvite", { detail: null, bubbles: true }));
                }
                else
                    this.dispatchEvent(new CustomEvent("chatPopupInputEnter", { detail: message.value, bubbles: true }));
                message.value = "";
            }
        });

        if (this.currentMessageContainer) {
            this.appendChild(this.currentMessageContainer);
        }
    }

    replaceMessageContainer(new_message_container) {
        this.currentMessageContainer = new_message_container;
        this.connectedCallback();
    }
};

customElements.define("chat-main", ChatMain);

let haxx = false;

export class ChatPopup extends HTMLElement {
    constructor() {
        super();
        if (!haxx)
            haxx = true;
        else
            return;
        console.log("chat ctor called");
        this.sidebar = new ChatSidebar();
        this.chatMain = new ChatMain();
        this.ws = new WebSocket("ws://localhost:8000/ws/chat/");
        this.user = null;
        this.popped = false;
        this.ws.onopen = async () => {
            this.chatMain.replaceMessageContainer(this.sidebar.getActiveSidebarEntry().messageContainer);
            this.user = await getUserInfo();
        }
        this.ws.onmessage = this.handleWsMessage.bind(this);
        
        this.addEventListener("chatEntryClick", (evt) => {
            const sidebarEntry = evt.detail;
            this.chatMain.replaceMessageContainer(sidebarEntry.messageContainer);
            this.sidebar.setActiveSidebarEntry(evt.detail);
        });
        this.outerClickHandler = (e) => {
            if (!e.target.className.startsWith("chat") && !e.target.localName.startsWith("chat"))
                this.pop();        
        };
        this.addEventListener("chatPopupInputEnter", this.handleInputEnter.bind(this));
        this.addEventListener("chatSendInvite", this.handleInviteEvent.bind(this));
        document.addEventListener("notiReceivedDm", this.handleDirectMessage.bind(this));
        document.addEventListener("chatDmStarted", this.startChatDm.bind(this));
    }
    async handleInviteEvent(evt) {
        const userId = this.sidebar.getActiveSidebarEntry().id;
        if (userId == -1) {
            Toast.error("Cant send an invite in general");
            return;
        }
        console.log("pathname:", window.location.pathname);
        if (window.location.pathname === "/rooms" || !window.location.pathname.includes("room")) {
            Toast.error("You're not in a room");
            return;
        }
        const roomId = router.route.params["id"];
        console.log("sending invite to:", userId, " roomId:", roomId);
        const inviteData = { userId, roomId };
        const req = await ApiWrapper.post("/rooms/invite", inviteData);
        if (!req.ok) {
            Toast.error("An error has occured");
            return;
        }
        const resp = await req.json();
        console.log("resp:", resp);
        Toast.success(resp.detail);
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
            const evtDetail = {
                message: msg,
                userId: this.sidebar.getActiveSidebarEntry().id
            }
            console.log("detail:", evtDetail);
            document.dispatchEvent(new CustomEvent("notiSendDM", {detail: evtDetail, bubbles: true}));
            const ts = Math.floor(Date.now() / 1000);
            console.log("ts:", ts);
            this.sidebar.appendMessage(evtDetail.userId, { message: msg, username: this.user.username, time: null });
        }
    }
    startChatDm(evt) {
        const userInfo = evt.detail;
        console.log("chat dm userinfo:", userInfo);
        if (!this.popped)
            this.pop();
        this.sidebar.createSideBarEntry(userInfo.userId, userInfo.username, userInfo.pfp);
        this.sidebar.setActiveSidebarEntry(this.sidebar.getSidebarEntry(userInfo.userId));
        this.chatMain.replaceMessageContainer(this.sidebar.getActiveSidebarEntry().messageContainer);
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