import { SettingsUserForm } from "../components/settings/SettingsUserForm.js";
import { SettingsUserPFP } from "../components/settings/SettingsUserPFP.js";
import { ComfirmPasswordPopUp } from "../components/settings/ComfirmPasswordPopUp.js";
import Toast from "../components/Toast.js";
import Axios from "../utils/axios.js";
import userInfo from "../utils/services/UserInfo.services.js";
import { router } from "../routes/routes.js";

export class SettingsPage extends HTMLElement {
  constructor() {
    super();
    this.updateProfile = this.updateProfile.bind(this);
    this.userData = {};
  }

  /**
   * @function fechUserInfo
   * @returns {void}
   * @description fetch the user info from the server
   * @returns {object} user data
   */
  async fechUserInfo() {
    this.userData = await userInfo();
  }

  /**
   * @function removePopup
   * @returns {void}
   * @description remove the popup confirmation password
   */
  removePopup() {
    const popup = document.querySelectorAll("comfirm-password-pop-up");
    if (popup) {
      popup.forEach((pop) => {
        pop.remove();
      });
    }
  }

  /**
   * @function showPopupSetting
   * @returns {void}
   * @description show the popup for confirmation password
   */
  showPopupSetting() {
    const settings = document.querySelector("settings-page");
    let confirmPopup = document.querySelector("comfirm-password-pop-up")
    if (!confirmPopup) {
      confirmPopup = document.createElement("comfirm-password-pop-up");
      settings.appendChild(confirmPopup);
      const close_popup = document.getElementById("setting_close_popup");
      close_popup.onclick = () => {
        confirmPopup.remove();
      };
    }
  }

  /**
   * @function changeImageWhenUpload
   * @returns {void}
   * @param {*} e => event
   * @description change the image when upload
   */
  changeImageWhenUpload(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.getElementsByClassName("settings_pfp_image")[0];
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  /**
   * @function getFormData
   * @returns  {object} data
   * @description get the form data from inputs
   */
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
  /**
   * @function updateNavbar
   * @returns {void}
   * @description update the navbar after updating the profile
   */
  updateNavbar() {
    const navbar = document.querySelector("navbar-component");
    navbar.updateData();
  }
  async updateProfile(event) {
    event && event.preventDefault();
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
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        data: data,
      };
      const res = await Axios.put("/user/update", config);
      if (res.ok) {
        Toast.success("Profile updated successfully");
        this.removePopup();
        this.updateNavbar();
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      Toast.error(err);
    }
  }

  /**
   * @description validate the form data
   * @returns {boolean} isValid
   */
  async validateForm() {
    const data = this.getFormData();
    for (const key in data) {
      if (data[key])
        document.getElementsByClassName(key + "_err")[0].innerHTML = "";
    }
    let isValid = true;
    for (const key in data) {
      if (!data[key] && key !== "user_password") {
        document.getElementsByClassName(key + "_err")[0].innerHTML = `${key} is required and can't be empty`;
        isValid = false;
      }
    }
    return isValid;
  }
  updateEvent(e) {
    this.validateForm().then((isValid) => {
      if (isValid && !this.userData.intra_id) {
        this.showPopupSetting();
        const settings_popup_conf_psw = document.getElementById("settings_popup_conf_psw");
        settings_popup_conf_psw.onclick = (e) => this.updateProfile(e);
      } else if (this.userData.intra_id && isValid) {
        this.updateProfile(null);
      }
    });
  }
  connectedCallback() {
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
                        <user-settings-form-page ></user-settings-form-page>
                        <user-settings-pfp></user-settings-pfp>
                    </div>
                </div>
          </div>
        `;
      document.addEventListener("user-settings-form-page:load", () => {
        document.getElementById("user_pfp").onchange = (e) => this.changeImageWhenUpload(e);
        document.getElementById("save_setting_btn").onclick = (e) => this.updateEvent(e);
      });
    });
  }
}

customElements.define("settings-page", SettingsPage);
