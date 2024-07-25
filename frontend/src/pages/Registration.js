import { router } from "../routes/routes.js";
import ApiWrapper from "../utils/ApiWrapper.js";
import Toast from "../components/Toast.js";

export class RegistrationPage extends HTMLElement {
    constructor() {
        super();
        this.registerUser = this.registerUser.bind(this);
    }
    async registerUser(event) {
        event.preventDefault();
        const username = this.username_elem.value;
        const email = this.email_elem.value;
        const password = this.password_elem.value;
        const repeat_password = this.repeat_password.value;
        if (!username || !email || !password || !repeat_password)
            return;
        if (password !== repeat_password) {
            Toast.error("Passwords do not match.");
            return;
        }
        const registration_data = { username, email, password };
        try {
            const req = await ApiWrapper.post("/register", registration_data);
            if (req.status === 500) {
                Toast.error("An internal server error occured.");
                return;
            }
            const data = await req.json();
            if (!req.ok) {
                Toast.error(data.detail[0]);
                return;
            }
            Toast.success(data.detail);
            router.navigate("/login");
        }
        catch (error) {
            Toast.error(error);
        } 
    }
    connectedCallback() {
        this.innerHTML = `
        <div class="registration-page">
            <div class="registration-container">
                <img src="../../assets/images/logo.png" alt="Logo" class="logo">
                <h1>Create your account</h1>
                <p class="paragraph">Please enter your data to continue</p>
                <form class="login-form">
                    <div>
                        Username
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
                        <button class="btn" data="Create Account"></button>
                    </div>
                </form>
                <p class="ref">Already have account? login <a class="anchor" href="/login">here</a></p>
                <p id="registration-error-message" class="registration-error-message"></p>
            </div>
        </div>`;
        this.querySelector(".btn").addEventListener("click", this.registerUser);
        this.username_elem = document.getElementById('name');
        this.email_elem = document.getElementById('email');
        this.password_elem = document.getElementById('password');
        this.repeat_password = document.getElementById('repeat_password');
    }
};

customElements.define("registration-page", RegistrationPage);