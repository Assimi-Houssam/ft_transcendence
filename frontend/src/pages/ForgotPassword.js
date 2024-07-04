export class ForgotPasswordPage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="login-page">
        <div class="login-container">
            <h1>Forgot Password</h1>
            <p class="paragraph">Please enter your email address. We will send you an email to reset your password.</p>
            <form class="login-form">
                <div>
                    Email
                    <input class ="input" id="email" type="email" name="email" placeholder="e.g.dummy@domain.com">
                </div>
                <div class="buttons">
                    <button type="submit" class="password-btn" data="Sign up"></button>
                </div>
            </form>
            <p class="ref">Remembered your password? Login <a class="anchor" href="/login">here</a></p>
            </div>
        </div>`;
    }
}

customElements.define("forgot-password-page", ForgotPasswordPage);