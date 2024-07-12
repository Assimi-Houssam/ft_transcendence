export class ComfirmPasswordPopUp extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="settings_confirm_password_popup_container">
            <div class="settings_confirm_password_popup">
                <button id="setting_close_popup" class="settings_confirm_password_popup_button_x">x</button>
                <h2 class="settings_confirm_password_popup_title">Confirm Password</h2>
                <div>
                    <p class="settings_confirm_password_popup_text">Please enter your password to continue</p>
                    <input id="settings_password_confirmation" type="password" class="settings_confirm_password_popup_input gradient-dark-bg gradient-dark-border" placeholder="Password">
                    <p class="settings_input_error confirm_password_err"></p>
                </div>
                <button id="settings_popup_conf_psw" class="settings_confirm_password_popup_button">Confirme</button>
            </div>
         </div>
        `
    }
}

customElements.define('comfirm-password-pop-up', ComfirmPasswordPopUp);