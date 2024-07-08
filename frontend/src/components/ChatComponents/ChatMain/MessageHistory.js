// NEED to update chat messages 
export class MessageHistory extends HTMLElement {
	constructor() {
		super();
	}
	connectedCallback(){
		this.innerHTML = `
			<div class="message-history">
				<div class="message received">
					<div class="profile-info received">
						<div><img src="../../assets/icons/noura.png" alt="User 1" class="player_received"></div>
						<div class="user_receive">
							<p class="username">Noura El Moussaoui</p>
							<p class="timestamp">03:10</p>
						</div>
			
					</div>
					<div class="message-content received">
						<p>On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer mise en page elle-même.</p>
					</div>
				</div>
			
				<div class="divider-time"></div>
			
				<div class="message sent">
					<div class="profile-info sent">
						<div><img src="../../assets/icons/noura.png" alt="User 1" class="player_send"></div>	
						<div class="user_sent">
							<span class="username">You</span>
							<span class="timestamp">03:11</span>
						</div>
					</div>
					<div class="message-content sent">
						<p>On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer mise en page elle-même.</p>
					</div>
				</div>
			</div>`;
	}
}

customElements.define("message-history", MessageHistory);