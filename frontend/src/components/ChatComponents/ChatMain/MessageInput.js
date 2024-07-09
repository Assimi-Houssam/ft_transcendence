// Handle message sending on enter key or button click -->
export class MessageInput extends HTMLElement{
	constructor(){
		super();
	}
	connectedCallback(){
		this.innerHTML = `
		<div class="message-input">
		<input type="text" placeholder="Type message...">
		<button class="send-message">
			send
		</button>
		</div>
		`;
	}
}

customElements.define("message-input", MessageInput);