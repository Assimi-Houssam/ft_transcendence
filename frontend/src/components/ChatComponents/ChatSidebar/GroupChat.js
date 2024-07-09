export class GroupChat extends HTMLElement{
	constructor(){
		super();
	}
	connectedCallback(){
		this.innerHTML = `
			<div class="group-chats">
				<h3><img src="../../assets/icons/ping.png" alt="ping" class="ping">GROUP CHATS</h3>
				<ul class="chat-list">
					<li class="chat-item">
						<img src="../../assets/icons/p3.png" alt="AGA Group" class="player">
						<div class="chat-info">
							<span class="chat-name"> </span>
							<span class="last-message"> </span>
						</div>
						<span class="message-time"> </span>
					</li>
				</ul>
			</div>
		`;
	}
}
customElements.define("group-chat", GroupChat);