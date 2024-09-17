import { langSettingUserForm } from "../../utils/translate/gameTranslate.js";

export class SettingsUserForm extends HTMLElement {
  constructor() {
    super();
    this.lang = localStorage.getItem("lang");
  }

  connectedCallback() {
    this.innerHTML = `
            <div class="settings_user_form_" >
                <div class="settings_form_control">
                    <label>${langSettingUserForm[this.lang]["Username"]}</label>
                    <input
                        class="gradient-dark-bg gradient-dark-border" 
                        type="text" 
                        id="username" 
                        placeholder="${langSettingUserForm[this.lang]["Username"]}" >
                    <div class="settings_input_error user_username_err"></div>
                </div>
                <div class="settings_form_control">
                    <label>${langSettingUserForm[this.lang]["Email"]}</label>
                    <input 
                        class="gradient-dark-bg gradient-dark-border" 
                        type="email" 
                        id="email" 
                        placeholder="${langSettingUserForm[this.lang]["Email"]}" >
                    <div class="settings_input_error user_email_err"></div>
                    </div>
                    <div class="settings_form_control">
                        <label>${langSettingUserForm[this.lang]["Password"]}</label>
                        <input 
                            class="gradient-dark-bg gradient-dark-border" 
                            type="password" 
                            id="password"
                            placeholder="${langSettingUserForm[this.lang]["Password"]}" >
                    <div class="settings_input_error user_password_err"></div>
                </div>
                <div class="settings_form_btn">
                    <button class="settings_user_form_btn_cancel">${langSettingUserForm[this.lang]["Cancel"]}</button>
                    <button id="save_setting_btn" class="settings_user_form_btn_save" >${langSettingUserForm[this.lang]["Save"]}</button>
                </div>
            </div>
        `;
  }
}

customElements.define("user-settings-form-page", SettingsUserForm);
