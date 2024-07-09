import { ProfileContent } from "./ProfileContent.js";
import	{ProfileHeader } from "./ProfileHeader.js";

export class ProfileSidebar extends HTMLElement{
	constructor(){
		super();
	}
	connectedCallback(){
		this.innerHTML = ` 
			<aside class="profile-sidebar">
				<profile-header></profile-header>
				<profile-content></profile-content>
			</aside>
			`;
	}
}

customElements.define("profile-sidebar", ProfileSidebar);