import { SettingsUserForm } from "../components/settings/SettingsUserForm.js";
import { SettingsUserPFP } from "../components/settings/SettingsUserPFP.js";
import { ComfirmPasswordPopUp } from "../components/settings/ComfirmPasswordPopUp.js";
import Toast from "../components/Toast.js";
import Axios from "../utils/axios.js";
import userInfo from "../utils/services/UserInfo.services.js";

export class SettingsPage extends HTMLElement {
  constructor() {
    super();
    this.updateProfile = this.updateProfile.bind(this);
    this.userData = {};
  }
  async fechUserInfo() {
    this.userData = await userInfo();
  }
  removePopup() {
    const popup = document.querySelector("comfirm-password-pop-up");
    // check if the popup is already exist
    if (popup) popup.remove();
  }
  showPopupSetting() {
    const settings = document.querySelector("settings-page");
    const confirmPopup = document.createElement("comfirm-password-pop-up");
    settings.appendChild(confirmPopup);
    const close_popup = document.getElementById("setting_close_popup");
    close_popup.onclick = () => {
      confirmPopup.remove();
    };
  }

  changeImageWhenUpload(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.getElementsByClassName("settings_pfp_image")[0];
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  getFormData() {
    const data = {
      user_firstname: document.getElementById("user_firstname").value,
      user_lastname: document.getElementById("user_lastname").value,
      user_name: document.getElementById("user_name").value,
      user_email: document.getElementById("user_email").value,
      user_password: document.getElementById("user_password").value,
    };
    return data;
  }
  async updateProfile(event) {
    event && event.preventDefault();
    /**
     * need to defined the @user_id in the data object
     * also need to desplay the loged user data in inputs and profile
     */
    const data = this.getFormData();
    data["user_id"] = this.userData.id;
    if (!this.userData.intra_id)
      data["confirm_password"] = document.getElementById(
        "settings_password_confirmation"
      ).value;
    if (data["confirm_password"] === "") {
      document.getElementsByClassName("confirm_password_err")[0].innerHTML =
        "Password is required, can't be empty";
      return;
    }
    console.log("data =>", data);
    /**
     * get the return data from @getFormData function
     * send data to backend here
     */
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        data: data,
      };
      const res = await Axios.put("/user/update", config);
      if (res.ok) {
        console.log("response =>", res);
        Toast.success("Profile updated successfully");
        this.removePopup();
        this.fechUserInfo();
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      Toast.error(err);
    }
  }
  async validateForm() {
    const data = this.getFormData();
    for (const key in data) {
      if (data[key])
        document.getElementsByClassName(key + "_err")[0].innerHTML = "";
    }
    let isValid = true;
    for (const key in data) {
      if (!data[key] && key !== "user_password") {
        document.getElementsByClassName(
          key + "_err"
        )[0].innerHTML = `${key} is required and can't be empty`;
        isValid = false;
      }
    }
    return isValid;
  }
  /**
   * the way i pass data in incorrect
   * so i nned to fix it
   */
  connectedCallback() {
    this.innerHTML = `<h1>loading</h1>`;
    this.fechUserInfo().then(() => {
      this.innerHTML = `
                <div class="settings_">
                    <div class="settings_bg_"></div>
                    <div class="settings_content_body">
                        <div class="settings_text_desc">
                            <h2>Account settings</h2>
                            <p>Edit your name, avatar, email, ect...</p>
                        </div>
                        <div class="settings_form_data">
                            <user-settings-form-page data=${JSON.stringify(this.userData )} ></user-settings-form-page>
                            <user-settings-pfp></user-settings-pfp>
                        </div>
                    </div>
                </div>
            `;
      document.getElementById("user_pfp").addEventListener("change", (e) => {
        this.changeImageWhenUpload(e);
      });
      document
        .getElementById("save_setting_btn")
        .addEventListener("click", (e) => {
          this.validateForm().then((isValid) => {
            if (isValid && !this.userData.intra_id) {
              this.showPopupSetting();
              document
                .getElementById("settings_popup_conf_psw")
                .addEventListener("click", this.updateProfile);
            } else if (this.userData.intra_id) {
              this.updateProfile(null);
            }
          });
        });
    });
  }
}

customElements.define("settings-page", SettingsPage);
