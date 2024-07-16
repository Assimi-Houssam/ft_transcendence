export class SettingsUserPFP extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="user_settings_pfp_">
                <h2 class="user_settings_pfp_label">Upload new Avatar</h2>
                <div class="user_settings_pfp_input_box">
                    <img class="settings_pfp_image" src="../../../assets/images/mamazzal.jpg" >
                    <img class="settings_pfp_camera_upload" src="../../../assets/icons/camera.png" >
                    <input type="file"  id="user_pfp" />
                    <div class="settings_input_error user_pfp_err"></div>
                </div>
                <div class="settings_pfp_delete">
                    <button > Delete Your Account </button>
                    <p>You will receive an email to confirm your decision
                    Please note, that all boards you have created will be 
                    permanently erased.</p>
                </div>
            </div>
        `
    }
}

customElements.define('user-settings-pfp', SettingsUserPFP);