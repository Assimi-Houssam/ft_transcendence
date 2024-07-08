//Need to  update message list
export class AllMessages extends HTMLElement{
	constructor(){
		super();
	}
	connectedCallback(){
		this.innerHTML = `
			<div class="all-messages">
				<h3 class="all-messages">All Messages</h3>
				<ul class="message-list">
					<li class="message-item">
						<img src="../../assets/icons/p1.png" alt="player1" class="player">
						<div class="message-info">
							<span class="user-name"></span>
							<span class="last-message"></span>
						</div>
						<span class="message-time"></span>
					</li>
					<li class="message-item">
						<img src="../../assets/icons/p2.png" alt="player2" class="player">
						<div class="message-info">
							<span class="user-name"></span>
							<span class="last-message"></span>
						</div>
						<span class="message-time"></span>
					</li>
				</ul>
			</div>
		`;
	}
}

customElements.define("all-messages", AllMessages);