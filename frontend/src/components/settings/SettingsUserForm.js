export class SettingsUserForm extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.data = JSON.parse(this.getAttribute("data"));
    this.innerHTML = `
            <div class="settings_user_form_" >
                <div>
                    <div class="settings_user_form_fullname">
                        <div class="settings_form_control">
                            <label>First name</label>
                            <input
                                class="gradient-dark-bg gradient-dark-border" 
                                value="${this.data.first_name || ""}"
                                type="text" 
                                id="user_firstname" 
                                placeholder="Amine Amazzal" >
                                <div class="settings_input_error user_firstname_err"></div>
                        </div>
                        <div class="settings_form_control">
                            <label>Last name</label>
                            <input
                                class="gradient-dark-bg gradient-dark-border" 
                                value="${this.data.last_name || ""}"
                                type="text" 
                                id="user_lastname" 
                                placeholder="Amine Amazzal" >
                                <div class="settings_input_error user_lastname_err"></div>
                        </div>
                    </div>
                </div>
                <div class="settings_form_control">
                    <label>Your username (LOGIN)</label>
                    <input
                        class="gradient-dark-bg gradient-dark-border" 
                        value="${this.data.username || "loading..."}"
                        type="text" 
                        id="user_name" 
                        placeholder="Amine Amazzal" >
                    <div class="settings_input_error user_name_err"></div>
                </div>
                <div class="settings_form_control">
                    <label>Your Email</label>
                    <input 
                        class="gradient-dark-bg gradient-dark-border" 
                        type="email" 
                        id="user_email" 
                        value="${this.data.email || "loading..."}"
                        placeholder="mamazzal@gmail.com" >
                    <div class="settings_input_error user_email_err"></div>
                    </div>
                    <div class="settings_form_control">
                        <label>Your Password</label>
                        <input 
                            class="gradient-dark-bg gradient-dark-border" 
                            type="password" 
                            value="${this.data.password || "loading..."}"
                            id="user_password" 
                            placeholder="example@gmail.com" >
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
