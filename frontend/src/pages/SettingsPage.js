import { SettingsUserForm } from "../components/settings/SettingsUserForm.js";
import { SettingsUserPFP } from "../components/settings/SettingsUserPFP.js";
import { ComfirmPasswordPopUp } from "../components/settings/ComfirmPasswordPopUp.js";

export class SettingsPage extends HTMLElement {
    constructor() {
        super();
        this.updateProfile = this.updateProfile.bind(this);
    }
    showPopupSetting() {
        const settings = document.querySelector("settings-page");
        const confirmPopup = document.createElement("comfirm-password-pop-up");
        settings.appendChild(confirmPopup);
        const close_popup = document.getElementById("setting_close_popup");
        close_popup.onclick = () => {
            confirmPopup.remove();
        }
    }

    changeImageWhenUpload(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const img = document.getElementsByClassName("settings_pfp_image")[0];
            img.src = reader.result;
        }
        reader.readAsDataURL(file);
    }

    getFormData() {
        const data = {
            user_name: document.getElementById("user_name").value,
            user_email: document.getElementById("user_email").value,
            user_password: document.getElementById("user_password").value,
        }
        return data;
    }
    async updateProfile(event) {
        event.preventDefault();
        const data = this.getFormData();
        data["confirm_password"] = document.getElementById("settings_password_confirmation").value;
        if (data["confirm_password"] === "") {
            document.getElementsByClassName("confirm_password_err")[0].innerHTML = "Password is required, can't be empty";
            return;
        }
        /**
         * get the return data from @getFormData function
         * send data to backend here
        */
    }
    async validateForm() {
        const data = this.getFormData();
        for (const key in data) {
            if (data[key])
                document.getElementsByClassName(key + "_err")[0].innerHTML = "";
        }
        let isValid = true;
        for (const key in data) {
            if (!data[key]) {
                document.getElementsByClassName(key + "_err")[0].innerHTML = `${key} is required and can't be empty`;
                isValid = false;
            }
        }
        return isValid;
    }

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
        document.getElementById("user_pfp").addEventListener("change", (e) => {
            this.changeImageWhenUpload(e);
        });
        document.getElementById("save_setting_btn").addEventListener("click", () => {
            this.validateForm().then((isValid) => {
                if (isValid) {
                    this.showPopupSetting();
                    document.getElementById("settings_popup_conf_psw").addEventListener("click", this.updateProfile);
                }
            })
        });
  }
}

customElements.define("settings-page", SettingsPage);