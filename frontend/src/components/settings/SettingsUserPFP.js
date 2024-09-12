import { langSettingUserPFP } from "../../utils/translate/gameTranslate.js";

export class SettingsUserPFP extends HTMLElement {
    constructor() {
        super();
        this.lang = localStorage.getItem("lang");
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="user_settings_pfp_">
                <h2 class="user_settings_pfp_label">${langSettingUserPFP[this.lang]["UploadAvatar"]}</h2>
                <div class="user_settings_pfp_input_box">
                    <img class="settings_pfp_image" src="../../../assets/images/mamazzal.jpg" >
                    <img class="settings_pfp_camera_upload" src="../../../assets/icons/camera.png" >
                    <input type="file"  id="pfp" />
                    <div class="settings_input_error user_pfp_err"></div>
                </div>
                <div class="settings_pfp_delete">
                    <button>${langSettingUserPFP[this.lang]["DeleteAccount"]}</button>
                    <p>${langSettingUserPFP[this.lang]["ConfirmDelete"]}</p>
                </div>
            </div>
        `
    }
}

customElements.define('user-settings-pfp', SettingsUserPFP);