// Need to  Implement profile editing functionality 

export class ProfileHeader extends HTMLElement{
	constructor(){
		super();
	}
	connectedCallback(){
		this.innerHTML = `
			<header class="profile-header">
				<div class="profile-header">
					<h2>Profile</h2>
				</div>
			/header>
		`;
	}
}

customElements.define("profile-header", ProfileHeader);