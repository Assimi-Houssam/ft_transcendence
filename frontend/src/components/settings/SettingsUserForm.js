export class SettingsUserForm extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="settings_user_form_" >
                <div class="settings_form_control">
                    <label>Your Name</label>
                    <input class="gradient-dark-bg gradient-dark-border" type="text" id="user_name" placeholder="Amine Amazzal" >
                </div>
                <div class="settings_form_control">
                    <label>Your Email</label>
                    <input class="gradient-dark-bg gradient-dark-border" type="email" id="user_email" placeholder="mamazzal@gmail.com" >
                </div>
                <div class="settings_form_control">
                    <label>Your Password</label>
                    <input class="gradient-dark-bg gradient-dark-border" type="password" id="user_password" placeholder="mamazzal@gmail.com" >
                </div>
                <div class="settings_form_btn">
                    <button class="settings_user_form_btn_cancel" >Cancel</button>
                    <button id="save_setting_btn" class="settings_user_form_btn_save" >Save</button>
                </div>
            </div>
        `
    }
}


customElements.define('user-settings-form-page', SettingsUserForm);