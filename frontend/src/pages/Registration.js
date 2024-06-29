export function RegistrationPage() {
	let home = document.createElement('div');
	home.classList.add('registration-page');
	home.innerHTML = `
	<div class="registration-page" >
	<div class="Registration-container">
	<img src="../../assets/images/logo.png" alt="Logo" class="logo">
	<h1>Create your Account</h1>
	<p class="paragraph">Please enter your data to continue</p>
	<form class="login-form">
		<div>
			Full Name
			<input class="input" id="name" type="text" name="name" placeholder="Dummy noob" required>
		</div>
		<div>
			Email
			<input class = "input" id="email" type="email" name="email" placeholder="e.g.dummy@domain.com" required>
		</div>
		<div>
			Password
			<input class="input" id="password" type="password" name="password" pattern="[a-z0-5]{8,}" placeholder="************" required>
		</div>
		<div>
			Repeat Password
			<input class = "input" id="repeat_password" type="password" name="repeat_password" pattern="[a-z0-5]{8,}" placeholder="************" required>
		</div>
		<div class="buttons">
			<button type="submit" class="btn" data="Create Account"></button>
		</div>
	</form>
	<p class="ref">Already have account ? login <a class="anchor" href="/login">here</a></p>
</div>
	</div>
	`
	return home;
}