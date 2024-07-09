import { ChatSidebar } from "../components/ChatComponents/ChatSidebar/ChatSidebar.js";
import { ChatMain } from "../components/ChatComponents/ChatMain/ChatMain.js";
import { ProfileSidebar } from "../components/ChatComponents/ProfileSidebar/ProfileSidebar.js";

export class ChatContainer extends HTMLElement{
	constructor(){
		super();
	}
	connectedCallback(){
		this.innerHTML = `
			<chat-sidebar></chat-sidebar>
			<chat-main></chat-main>
			<profile-sidebar></profile-sidebar>
		`;
	}
}

customElements.define("chat-container", ChatContainer);