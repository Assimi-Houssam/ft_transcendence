export function LoginPage() {
	let home = document.createElement('div');
	home.classList.add('login-page');
	home.innerHTML = `
		<div class="login-page">
			<div class="login-container">
				<img src="../../assets/images/logo.png" alt="Logo" class="logo">
				<h1>Welcome Back</h1>
				<p class="paragraph">Please enter your credentials to continue</p>
				<form class="login-form">
					<div>
						Email
						<input class="input" id="email" type="email" name="email" placeholder="e.g.dummy@domain.com" required>
					</div>
					<div>
						<p class="password"><span>Password</span><span><a href="/reset-password" class="forgot-password-link">Forgot password?</a></span></p>
						<input class = "input" id="password" type="password" name="password" pattern="[a-z0-5]{8,}" placeholder="************" required>
					</div>
					<div class="buttons">
						<button type="submit" class="primary-btn" data="Login"></button>
						<p class="space">OR</p>
						<button type="submit" class="secondary-btn"><span><img src="../../assets/images/42.svg" alt="42" class="fortyTwo"></span><span> Login with Intranet</span></button>
					</div>
				</form>
				<p class="ref">You are new here? create account by clicking <a class="anchor" href="/register">here</a></p>
				<a href="/home" class="anchor">Back to Home</a>
			</div>
		</div>
	`
	return home;
}
