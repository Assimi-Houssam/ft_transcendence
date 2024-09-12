import { langForgotPassword } from "../utils/translate/gameTranslate.js";

export class ForgotPasswordPage extends HTMLElement {
    constructor() {
        super();
        this.lang = localStorage.getItem("lang");
    }

    connectedCallback() {
        this.innerHTML = `
        <div class="login-page">
        <div class="login-container">
            <h1>${langForgotPassword[this.lang]["Title"]}</h1>
            <p class="paragraph">${langForgotPassword[this.lang]["Paragraph"]}</p>
            <form class="login-form">
                <div>
                    ${langForgotPassword[this.lang]["Email"]}
                    <input class ="input" id="email" type="email" name="email" placeholder="${langForgotPassword[this.lang]["EmailPlaceHold"]}">
                </div>
                <div class="buttons">
                    <button type="submit" class="password-btn" data="${langForgotPassword[this.lang]["BtnSignUp"]}"></button>
                </div>
            </form>
            <p class="ref">${langForgotPassword[this.lang]["Ref"]}<a class="anchor" href="/login">${langForgotPassword[this.lang]["Here"]}</a></p>
            </div>
        </div>`;
    }
}

customElements.define("forgot-password-page", ForgotPasswordPage);