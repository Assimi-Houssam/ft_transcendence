import { SettingsUserForm } from "../components/settings/SettingsUserForm.js";
import { SettingsUserPFP } from "../components/settings/SettingsUserPFP.js";
import { ComfirmPasswordPopUp } from "../components/settings/ComfirmPasswordPopUp.js";

export class SettingsPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <div class="settings_">
                <div class="settings_bg_"></div>
                <div class="settings_content_body">
                    <div class="settings_text_desc">
                        <h2>Account settings</h2>
                        <p>Edit your name, avatar, email, ect...</p>
                    </div>
                    <div class="settings_form_data">
                        <user-settings-form-page></user-settings-form-page>
                        <user-settings-pfp></user-settings-pfp>
                    </div>
                </div>
            </div>
        `;
  }
}

customElements.define("settings-page", SettingsPage);