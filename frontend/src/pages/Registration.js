import { router } from "../routes/routes.js";

export function registerUser(event) {
    event.preventDefault();
    const username = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const repeat_password = document.getElementById('repeat_password').value;
    if (!username || !email || !password || !repeat_password)
        return;
    if (password !== repeat_password) {
        let registration_err_elem = document.getElementById('registration-error-message');
        registration_err_elem.textContent = "Passwords do not match";
        return;
    }
    const registration_data = { username, email, password };
    fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registration_data)
    })
    .then(response => response.json())
    .then(data => {
        if ('error' in data) {
            let registration_err_elem = document.getElementById('registration-error-message');
            registration_err_elem.textContent = data.error;
            console.log(`registration failed, server returned: ${data.error}`);
        }
        else {
            router.navigate("/login");
        }
    })
    .catch((error) => {
        console.error(`an exception occurred: ${error}`);
    });
}

window.registerUser = registerUser;

export class RegistrationPage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="registration-page">
            <div class="registration-container">
                <img src="../../assets/images/logo.png" alt="Logo" class="logo">
                <h1>Create your Account</h1>
                <p class="paragraph">Please enter your data to continue</p>
                <form class="login-form">
                    <div>
                        Full Name
                        <input class="input" id="name" type="text" name="name" placeholder="Dummy noob">
                    </div>
                    <div>
                        Email
                        <input class="input" id="email" name="email" placeholder="e.g.dummy@domain.com">
                    </div>
                    <div>
                        Password
                        <input class="input" id="password" type="password" name="password" placeholder="************">
                    </div>
                    <div>
                        Repeat Password
                        <input class = "input" id="repeat_password" type="password" name="repeat_password" placeholder="************">
                    </div>
                    <div class="buttons">
                        <button type="submit" class="btn" data="Create Account" onclick="registerUser(event)"></button>
                    </div>
                </form>
                <p class="ref">Already have account? login <a class="anchor" href="/login">here</a></p>
                <p id="registration-error-message" class="registration-error-message"></p>
            </div>
        </div>`
    }
};

customElements.define("registration-page", RegistrationPage);