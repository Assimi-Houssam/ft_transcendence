export class SettingsUserForm extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
            <div class="settings_user_form_" >
                <div class="settings_form_control">
                    <label>Username</label>
                    <input
                        class="gradient-dark-bg gradient-dark-border" 
                        type="text" 
                        id="username" 
                        placeholder="Amine Amazzal" >
                    <div class="settings_input_error user_username_err"></div>
                </div>
                <div class="settings_form_control">
                    <label>Email</label>
                    <input 
                        class="gradient-dark-bg gradient-dark-border" 
                        type="email" 
                        id="email" 
                        placeholder="mamazzal@gmail.com" >
                    <div class="settings_input_error user_email_err"></div>
                    </div>
                    <div class="settings_form_control">
                        <label>Password</label>
                        <input 
                            class="gradient-dark-bg gradient-dark-border" 
                            type="password" 
                            id="password"
                            placeholder="password" >
                    <div class="settings_input_error user_password_err"></div>
                </div>
                <div class="settings_form_btn">
                    <button class="settings_user_form_btn_cancel" >Cancel</button>
                    <button id="save_setting_btn" class="settings_user_form_btn_save" >Save</button>
                </div>
            </div>
        `;
  }
}

customElements.define("user-settings-form-page", SettingsUserForm);
