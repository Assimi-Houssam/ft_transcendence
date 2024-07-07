export class SettingsUserForm extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <form class="settings_user_form_" action="#">
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
                    <button class="settings_user_form_btn_cancel" type="submit">Cancel</button>
                    <button class="settings_user_form_btn_save" type="submit">Save</button>
                </div>
            </form>
        `
    }
}


customElements.define('user-settings-form-page', SettingsUserForm);