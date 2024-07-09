import { MessageHeader } from "./MessageHeader.js";
import { OnlineUsers } from "./OnlineUsers.js";
import { GroupChat } from "./GroupChat.js";
import { AllMessages } from "./AllMessages.js";

export class ChatSidebar extends HTMLElement {
	constructor() {
		super();
	}
	connectedCallback() {
		this.innerHTML = `
			<aside class="chat-sidebar">
				<message-header></message-header>
				<online-users></online-users>
				<group-chats></group-chats>
				<all-messages></all-messages>
			</aside>
		`;
	}
}

customElements.define("chat-sidebar", ChatSidebar);

