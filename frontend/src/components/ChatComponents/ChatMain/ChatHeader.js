export class ChatHeader extends HTMLElement{
	constructor(){
		super();
	}
	connectedCallback(){
		this.innerHTML = `
			<header class="chat-header">
				<div class="current-user">
					<img src="../../assets/icons/noura.png" alt="" class="player">
					<div class="user-info">
						<span class="user-name">Noura El Moussaoui</span>
						<!-- Need to update user status using js-->
						<span class="user-status">connecting ...</span>
					</div>
				</div>
			</header>
		`;
	}
}

customElements.define("chat-header", ChatHeader);