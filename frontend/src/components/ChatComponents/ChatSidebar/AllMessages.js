class ViewMessageItem extends HTMLElement {
	constructor() {super()}
	connectedCallback() {
		this.innerHTML = `
			<div class="view-message-left-item">
				<div class="view-message-item-avatar">
					<img src="../../assets/icons/p1.png" alt="user avatar">
				</div>
				<div class="message-item-data">
					<h2>${this.getAttribute("name")}</h2>
					<p>${
						this.getAttribute("last_message").length > 20 ?
						this.getAttribute("last_message").slice(0, 20) + "..." :
						this.getAttribute("last_message")
					}</p>
				</div>
			</div>
			<div class="view-message-right-item">
				<p>${this.getAttribute("time")}</p>
			</div>
		`
	}
}

customElements.define("view-message-item", ViewMessageItem);
export class AllMessages extends HTMLElement{
	constructor(){
		super();
	}
	connectedCallback(){
		this.innerHTML = `
			<h3 class="all-messages-title">All Messages</h3>
			<div class="last-messages-items">
				<view-message-item 
					name="Amine Amazzal" 
					last_message="Hello" 
					time="12:00">
				</view-message-item>
				<view-message-item 
					name="Amine Amazzal" 
					last_message="Hello" 
					time="12:00">
				</view-message-item>
				<view-message-item 
					name="Amine Amazzal" 
					last_message="Hello" 
					time="12:00">
				</view-message-item>
			</div>
		`;
	}
}

customElements.define("all-messages", AllMessages);