import { router } from "../routes/routes.js";

// temporary
function genRandomString(length) {
	let result = '';
	let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

function loginUser(event) {
	event.preventDefault();
	const username = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	if (!username || !password) {
		return;
	}
	const login_data = { username, password };
	fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(login_data)
    })
    .then(response => response.json())
    .then(data => {
        if ('detail' in data) {
			const login_err_elem = document.getElementById('login-error-message');
        	login_err_elem.textContent = data.detail;
        }
		else {
			localStorage.setItem('access_token', data.access);
			localStorage.setItem('refresh_token', data.refresh);
            router.navigate("/home");
        }
    })
    .catch((error) => {
        console.error(`an exception occurred: ${error}`);
    });
}

function OAuthLogin(event) {
	event.preventDefault();
	let client_id = "u-s4t2ud-9b817b5c046ec73f656311d30af3240cfd77ca2e5a01259a1d39c0223ce5f2fd";
	let state = genRandomString(16);
	localStorage.setItem('state', state);
	console.log(`settings state: `, state);
	let oauth_url = `https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=http%3A%2F%2Flocalhost%2F&response_type=code&state=${state}`;
	window.location.replace(oauth_url);
}

window.loginUser = loginUser;
window.OAuthLogin = OAuthLogin;

export class LoginPage extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<div class="login-page">
				<div class="login-container">
					<img src="../../assets/images/logo.png" alt="Logo" class="logo">
					<h1>Welcome Back</h1>
					<p class="paragraph">Please enter your credentials to continue</p>
					<form class="login-form">
						<div>
							Email
							<input class="input" id="email" name="email" placeholder="e.g.dummy@domain.com">
						</div>
						<div>
							<p class="password"><span>Password</span><span><a href="/reset-password" class="forgot-password-link">Forgot password?</a></span></p>
							<input class="input" id="password" type="password" name="password" placeholder="************">
						</div>
						<div class="buttons">
							<button class="primary-btn" data="Login" onclick="loginUser(event)"></button>
							<p class="space">OR</p>
							<button class="secondary-btn" onclick="OAuthLogin(event)"><span><img src="../../assets/images/42.svg" alt="42" class="fortyTwo"></span><span>Login with Intranet</span></button>
						</div>
					</form>
					<p class="ref">New here? create an account by clicking <a class="anchor" href="/register">here</a></p>
					<p id="login-error-message" class="login-error-message"></p>
					</div>
			</div>`
	}
};

customElements.define("login-page", LoginPage);