import { router } from "../routes/routes.js";
import { genRandomString } from "../utils/utils.js";
import { OAuthIntercept } from "../utils/utils.js";
import ApiWrapper from "../utils/ApiWrapper.js";
import Toast from "../components/Toast.js"
import { PreloaderMini } from "../components/Loading.js";

export class LoginPage extends HTMLElement {
	constructor() {
		super();
		this.loginUser = this.loginUser.bind(this);
		this.OAuthLogin = this.OAuthLogin.bind(this);
		this.err = "";
	}
	async loginUser(event) {
		event.target.innerHTML = new PreloaderMini().outerHTML;
		event.target.disabled = true;
		event.preventDefault();
		const username = this.username_elem.value;
		const password = this.password_elem.value;
		if (!username || !password) {
			event.target.innerHTML = "Login";
			event.target.disabled = false;
			return;
		}
		const login_data = { username, password };
		try {
			const req = await ApiWrapper.post("/login", login_data);
			const data = await req.json();
			event.target.disabled = false;
			event.target.innerHTML = "Login";
			if (!req.ok) {
				Toast.error(data.detail);
				return;
			}
			router.navigate("/home");
		}
		catch (error) {
			event.target.innerHTML = "Login";
			event.target.disabled = false;
			Toast.err("Error : an error has occured, please try again later");
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
					<h1>Welcome Back</h1>
					<p class="paragraph">Please enter your credentials to continue</p>
					<form class="login-form">
						<div>
							<label>Username</label>
							<input class="input" id="email" type="text" name="email" placeholder="username">
						</div>
						<div>
							<div class="password_label">
								<span>Password</span>
									<span><a href="/reset-password" class="forgot-password-link">Forgot password?</a>
								</span>
							</div>
							<input class="input" id="password" type="password" name="password" placeholder="************">
						</div>
						<div style="width: 110%;" class="buttons">
							<button class="primary-btn">Login</button>
							<p class="space">OR</p>
							<button class="secondary-btn"><span><img src="../../assets/images/42.svg" alt="42" class="fortyTwo"></span><span>Login with Intranet</span></button>
						</div>
					</form>
					<p class="ref">New here? create an account by clicking <a class="anchor" href="/register">here</a></p>
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