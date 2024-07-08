import { ChatSidebar } from "../components/ChatComponents/ChatSidebar/ChatSidebar.js";
import { ChatMain } from "../components/ChatComponents/ChatMain/ChatMain.js";
import { ProfileSidebar } from "../components/ChatComponents/ProfileSidebar/ProfileSidebar.js";

export class ChatContainer extends HTMLElement{
	// instantiate the component
	constructor(){
		// inheriting the parent class properties
		super();
	}
	connectedCallback(){
		// Render our initial HTML 
		this.innerHTML = `
		<div class="chat-container">
			<chat-sidebar></chat-sidebar>
			<chat-main></chat-main>
			<profile-sidebar></profile-sidebar>
		</div>
		`;
	}
}

customElements.define("chat-container", ChatContainer);