// need to add functionality to update profile information
export class ProfileContent extends HTMLElement{
	constructor(){
		super();
	}
	connectedCallback(){
		this.innerHTML =`
			<div class="profile-content">
				<img src="../../assets/icons//noura.png" alt="Noura El Moussaoui" class="profile-pic">
				<h3 class="profile-name">Noura El Moussaoui</h3>
				<p class="profile-username">@nel-mous</p>
				
				<div class="profile-actions">
					<a href="#" class="profile-action">View Profile</a>
				</div>
			</div>
		 `;
	}
}

customElements.define("profile-content", ProfileContent);