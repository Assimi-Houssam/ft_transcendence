import { ChatHeader } from "./ChatHeader.js";
import { MessageHistory } from "./MessageHistory.js";
import { MessageInput } from "./MessageInput.js";

export class ChatMain extends HTMLElement {
	constructor(){
		super();
	}
	connectedCallback(){
		this.innerHTML =` 
			<main class="chat-main">
				<chat-header></chat-header>
				<message-history></message-history>
				<message-input></message-input>
			</main>
		`;
	}
}

customElements.define("chat-main", ChatMain);