import userInfo from "../../utils/services/UserInfo.services.js";

export class SettingsUserForm extends HTMLElement {
  constructor() {
    super();
    this.data = {};
    this.innerHTML = "loading...";
  }
  async fechUserInfo() {
    this.data = await userInfo();
  }
  async render() {
    this.fechUserInfo().then(() => {
        this.connectedCallback();
    })
  }
  connectedCallback() {
    this.fechUserInfo().then(() => {
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
                            value=""
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
        document.dispatchEvent(new CustomEvent('user-settings-form-page:load'));// this is the event that will be listened to in the SettingsPage.js to check if the page is loaded
    }).catch((err) => {
        this.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center">
                <img width="30" hight="30" src="../../../assets/icons/err.png" alt="error" />
                <p style="margin-left: 20px;color: red">An error occured while fetching user data</p>
            </div>
         `;
    })
  }
}

customElements.define("user-settings-form-page", SettingsUserForm);
