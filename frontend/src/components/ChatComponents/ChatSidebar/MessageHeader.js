// Need to update the message-count
export class MessageHeader extends HTMLElement{
	constructor(){
		super();
	}
	connectedCallback(){
		this.innerHTML = `
			<header class="message-header">
				<h2>Messages<span class="message-count">(10)</span><span><img class="search-input" src="../../assets/icons/search.png"></span></h2>
			</header>
		`;
	}
}

customElements.define("message-header", MessageHeader);