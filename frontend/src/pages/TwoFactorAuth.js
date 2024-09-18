import Toast from "../components/Toast.js";
import { router } from "../routes/routes.js";
import ApiWrapper from "../utils/ApiWrapper.js";
import { langMFA } from "../utils/translate/gameTranslate.js";


export default class TwoFactorAuth extends HTMLElement {
    constructor(username, password) {
        super();
        this.username = username;
        this.password = password;
        this.lang = localStorage.getItem("lang");
    }
    async validateOtp(otp) {
        if (otp.length !== 6) {
            return;
        }
        const req = await ApiWrapper.post("/login/mfa", {username: this.username, password: this.password, otp: otp});
        const resp = await req.json();
        if (!req.ok) {
            Toast.error(resp.detail);
            return;
        }
        router.navigate("/home");
    }
    connectedCallback() {
        if (!this.username || !this.password) {
            router.navigate("/login");
            return;
        }
        this.innerHTML = `
            <div class="two_factor_card_header">
                <img src="../../assets/icons/twofa.webp" alt="two factor icon" />
                <h3>${langMFA[this.lang]["Title"]}</h3>
                <p>${langMFA[this.lang]["InputTotp"]}</p>
            </div>
            <div class="twofactor_code">
                <div class="two_factor">
                    <p>${langMFA[this.lang]["EnterCode"]}</p>
                    <div id="twofa_inputs" class="twofa_inputs">
                        <input type="text" />
                        <input type="text" />
                        <input type="text" />
                        <input type="text" />
                        <input type="text" />
                        <input type="text" />
                    </div>
                    <button>${langMFA[this.lang]["VerifyTotp"]}</button>
                </div>
            </div>
        `
        const inputs = document.getElementById("twofa_inputs");
        inputs.addEventListener("input", (e) => {
            const input = e.target;
            if (isNaN(input.value))
                input.value = ""
            else if (input.value.length == 1) {
                const next_input = input.nextElementSibling;
                next_input && (next_input.focus(), next_input.value = "")
            } else if (input.value.length > 1)
                input.value = input.value[0];
            else {
                input.focus();
                return;
            }
        })

        inputs.addEventListener("keyup", (e) => {
            const input = e.target;
            if (e.key.toLowerCase() == "backspace" || e.key.toLowerCase() == "delete") {
                input.value = "";
                const prev = input.previousElementSibling
                if (prev)
                    prev.focus();
            }
        });

        this.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                let haxx = this.querySelector(".twofa_inputs");
                let otp = Array.from(haxx.children).map(input => input.value).join("");
                this.validateOtp(otp);
            }
        });
        this.querySelector("button").onclick = (e) => {
            let haxx = this.querySelector(".twofa_inputs");
            let otp = Array.from(haxx.children).map(input => input.value).join("");
            this.validateOtp(otp);
        }
    }
}

customElements.define("two-factor-page", TwoFactorAuth);