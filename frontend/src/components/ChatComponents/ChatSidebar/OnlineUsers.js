export class OnlineUsers extends HTMLElement{
	constructor(){
		super();
	}
	connectedCallback(){
		this.innerHTML = `
			<div class="online-users">
				<h3 class="ellipsize-left">online Now</h3>
				<div class="users-list">
					<span><img src="../../assets/icons/p1.png" alt="player1" class="player-online"></span>
					<span><img src="../../assets/icons/p2.png" alt="player2" class="player-online"></span>
					<span><img src="../../assets/icons/p3.png" alt="player3" class="player-online"></span>
					<span><img src="../../assets/icons/p4.png" alt="player4" class="player-online"></span>
					<span><img src="../../assets/icons/p5.png" alt="player5" class="player-online"></span>
				</div>
			</div>`;
	}
}

customElements.define("online-users", OnlineUsers);