import { router } from "../routes/routes.js";
import ApiWrapper from "../utils/ApiWrapper.js";
import Toast from "../components/Toast.js";
import { PreloaderMini } from "../components/Loading.js";
import { langRegistration } from "../utils/translate/gameTranslate.js";

export class RegistrationPage extends HTMLElement {
    constructor() {
        super();
        this.lang = localStorage.getItem("lang");
        this.registerUser = this.registerUser.bind(this);
    }
    async registerUser(event) {
        event.preventDefault();
        event.target.innerHTML = new PreloaderMini().outerHTML;
		event.target.disabled = true;
        const username = this.username_elem.value;
        const email = this.email_elem.value;
        const password = this.password_elem.value;
        const repeat_password = this.repeat_password.value;
        if (!username || !email || !password || !repeat_password)  {
            event.target.innerHTML = langRegistration[this.lang]["BtnCreate"];
            event.target.disabled = false;
            return;
        }
        if (password !== repeat_password) {
            event.target.innerHTML = langRegistration[this.lang]["BtnCreate"];
            event.target.disabled = false;
            Toast.error(langErrors[this.lang]["ErrorPassNotMatch"]);
            return;
        }
        const registration_data = { username, email, password };
        try {
            const req = await ApiWrapper.post("/register", registration_data);
            if (req.status === 500) {
                event.target.innerHTML = langRegistration[this.lang]["BtnCreate"];
                event.target.disabled = false;
                Toast.error(langErrors[this.lang]["ErrorInternalServer"]);
                return;
            }
            const data = await req.json();
            event.target.innerHTML = langRegistration[this.lang]["BtnCreate"];
            event.target.disabled = false;
            if (!req.ok) {
                Toast.error(data.detail[0]);
                return;
            }
            Toast.success(data.detail);
            router.navigate("/login");
        }
        catch (error) {
            event.target.innerHTML = langRegistration[this.lang]["BtnCreate"];
            event.target.disabled = false;
            Toast.error(langErrors[this.lang]["ErrorTryAgain"]);
        } 
    }
    connectedCallback() {
        this.innerHTML = `
        <div class="registration-page">
            <div class="registration-container">
                <img src="../../assets/images/logo.png" alt="Logo" class="logo">
                <h1>${langRegistration[this.lang]["Registration"]}</h1>
                <p class="paragraph">${langRegistration[this.lang]["Paragraph"]}</p>
                <form class="login-form">
                    <div>
                        ${langRegistration[this.lang]["Username"]}
                        <input class="input" id="name" type="text" name="name" placeholder="${langRegistration[this.lang]["Username"]}">
                    </div>
                    <div>
                        ${langRegistration[this.lang]["Email"]}
                        <input class="input" id="email" name="email" placeholder="${langRegistration[this.lang]["EmailPlaceHold"]}">
                    </div>
                    <div>
                        ${langRegistration[this.lang]["Password"]}
                        <input class="input" id="password" type="password" name="password" placeholder="************">
                    </div>
                    <div>
                        ${langRegistration[this.lang]["RepeatPass"]}
                        <input class = "input" id="repeat_password" type="password" name="repeat_password" placeholder="************">
                    </div>
                    <div class="buttons">
                        <button class="btn"></button>
                    </div>
                </form>
                <p class="ref">${langRegistration[this.lang]["Ref"]}<a class="anchor" href="/login">${langRegistration[this.lang]["Here"]}</a></p>
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