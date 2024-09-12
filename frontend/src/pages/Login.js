import { router } from "../routes/routes.js";
import { genRandomString } from "../utils/utils.js";
import { OAuthIntercept } from "../utils/utils.js";
import ApiWrapper from "../utils/ApiWrapper.js";
import Toast from "../components/Toast.js"
import { langLogin } from "../utils/translate/gameTranslate.js";

export class LoginPage extends HTMLElement {
	constructor() {
		super();
		this.loginUser = this.loginUser.bind(this);
		this.OAuthLogin = this.OAuthLogin.bind(this);
		this.err = "";
		this.lang = localStorage.getItem("lang");
	}
	async loginUser(event) {
		// todo: block button input with animations after this is called
		event.preventDefault();
		const username = this.username_elem.value;
		const password = this.password_elem.value;
		if (!username || !password) {
			return;
		}
		const login_data = { username, password };
		try {
			// todo: display some sort of loading animation here
			const req = await ApiWrapper.post("/login", login_data);
			const data = await req.json();
			if (!req.ok) {
				Toast.error(data.detail);
				return;
			}
			router.navigate("/home");
		}
		catch (error) {
			// display some toast notification here
			console.log("[LoginPage]: an exception has occured:", error);
		}
	}
	OAuthLogin(event) {
		event.preventDefault();
		let state = genRandomString(16);
		localStorage.setItem('state', state);
		let oauth_url = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-9b817b5c046ec73f656311d30af3240cfd77ca2e5a01259a1d39c0223ce5f2fd&redirect_uri=http%3A%2F%2Flocalhost%2Flogin&response_type=code&state=${state}`;
		window.location.replace(oauth_url);
	}
	async connectedCallback() {
		if (localStorage.getItem('state')) {
			this.err = await OAuthIntercept();
			if (!this.err) {
				router.navigate("/home");
				return;
			}
		}
		this.innerHTML = `
			<div class="login-page">
				<div class="login-container">
					<img src="../../assets/images/logo.png" alt="Logo" class="logo">
					<h1>${langLogin[this.lang]["Login"]}</h1>
					<p class="paragraph">${langLogin[this.lang]["Paragraph"]}</p>
					<form class="login-form"> 
						<div>
							${langLogin[this.lang]["Email"]}
							<input class="input" id="email" name="email" placeholder="${langLogin[this.lang]["EmailPlaceHold"]}">
						</div>
						<div>
							<p class="password"><span>${langLogin[this.lang]["Password"]}</span><span><a href="/reset-password" class="forgot-password-link">${langLogin[this.lang]["ForgorPass"]}</a></span></p>
							<input class="input" id="password" type="password" name="password" placeholder="************">
						</div>
						<div class="buttons">
							<button class="primary-btn" data="${langLogin[this.lang]["BtnLogin"]}"></button>
							<p class="space">OR</p>
							<button class="secondary-btn"><span><img src="../../assets/images/42.svg" alt="42" class="fortyTwo"></span><span>${langLogin[this.lang]["secondaryBtn"]}</span></button>
						</div>
					</form>
					<p class="ref">${langLogin[this.lang]["Ref"]}<a class="anchor" href="/register">${langLogin[this.lang]["Here"]}</a></p>
					</div>
			</div>
		`;
		this.username_elem = document.getElementById('email');
		this.password_elem = document.getElementById('password');
		this.querySelector('.primary-btn').addEventListener('click', this.loginUser);
		this.querySelector('.secondary-btn').addEventListener('click', this.OAuthLogin);
	}

};

customElements.define("login-page", LoginPage);