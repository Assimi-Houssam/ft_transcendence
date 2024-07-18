import { SettingsUserForm } from "../components/settings/SettingsUserForm.js";
import { SettingsUserPFP } from "../components/settings/SettingsUserPFP.js";
import { ComfirmPasswordPopUp } from "../components/settings/ComfirmPasswordPopUp.js";
import Toast from "../components/Toast.js";
import userInfo from "../utils/services/userInfo.services.js";
import ApiWrapper from "../utils/ApiWrapper.js";

export class SettingsPage extends HTMLElement {
  constructor() {
    super();
    this.updateProfile = this.updateProfile.bind(this);
    this.userData = {};
  }

  /**
   * @function setInputsValues
   * @returns {void}
   * @description to set the data from the server to the inputs in component
   */
  setInputsValues() {
    const data = this.userData;
    document.getElementById("username").value = data.username;
    document.getElementById("email").value = data.email;
    // todo: make the server return the full url instead of generating it locally?
    document.getElementsByClassName("settings_pfp_image")[0].src = "http://localhost:8000" + data.pfp;
  }

  /**
   * @function fechUserInfo
   * @returns {void}
   * @description fetch the user info from the server
   * @returns {object} user data
   */
  async fechUserInfo() {
    const req = await ApiWrapper.get("/me");
    if (req.ok) {
      const data = await req.json();
      this.userData = data;
    }
    else {
      // todo: save server error message somewhere and display it in a toast
      this.userData = null;
    }
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
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      pfp: document.getElementById("pfp").files[0],
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
    if (event ) {
      event.preventDefault();
      document.getElementById("settings_popup_conf_psw").innerHTML = "<preloader-mini></preloader-mini>";
      document.getElementById("settings_popup_conf_psw").onclick = () => {};
    }else {
      document.getElementById("save_setting_btn").innerHTML = "<preloader-mini></preloader-mini>";
      document.getElementById("save_setting_btn").onclick = () => {};
    }
  
    const data = this.getFormData();
    let formData = new FormData();
  
    for (const key in data) {
      if (data[key])
        formData.append(key, data[key]);
    }
    formData.append("user_id", this.userData.id);
    if (!this.userData.intra_id) {
      const confirmPassword = document.getElementById("settings_password_confirmation").value;
      if (confirmPassword === "") {
        document.getElementsByClassName("confirm_password_err")[0].innerHTML =
          "Password is required, can't be empty";
        return;
      }
      formData.append("confirm_password", confirmPassword);
    }

    try {
      const res  = await ApiWrapper.post("/user/update", formData, false);
      const data = await res.json();
      if (res.ok) {
        Toast.success(data.detail);
        this.removePopup();
        // todo: this is broken, fix it
        // this.updateNavbar();
      } else {
        Toast.error(data.detail[0]);
      }
    }
    catch(err) {
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
      if (data[key]) {
        document.getElementsByClassName("user_" + key + "_err")[0].innerHTML = "";
      }
    }
    let isValid = true;
    for (const key in data) {
      if (!data[key] && key !== "password" && key !== "pfp") {
        document.getElementsByClassName("user_" + key + "_err")[0].innerHTML = `${key} is required and can't be empty`;
        isValid = false;
      }

      if (key  === "pfp") {
        const file = data[key];
        if (file) {
          if (file.size > 5000000) {
            document.getElementsByClassName("user_pfp_err")[0].innerHTML = "Image size must be less than 2MB";
            isValid = false;
          }else if (!file.type.includes("image")) {
            document.getElementsByClassName("user_pfp_err")[0].innerHTML = "Invalid file type, only images are allowed";
            isValid = false;
          }
        }
      }
    }
    return isValid;
  }
  updateEvent(e) {
    this.validateForm().then((isValid) => {
      if (isValid && !this.userData.intra_id) {
        this.showPopupSetting();
        const settings_popup_conf_psw = document.getElementById("settings_popup_conf_psw");
        settings_popup_conf_psw.onclick = (e) => this.updateProfile(e)
        .then(() => {
          settings_popup_conf_psw.innerHTML = "Confirme"
          settings_popup_conf_psw.onclick = (e) => this.updateEvent(e);
        })
      } else if (this.userData.intra_id && isValid) {
        this.updateProfile(null).then(() => {
          document.getElementById("save_setting_btn").innerHTML = "Save";
          document.getElementById("save_setting_btn").onclick = (e) => this.updateEvent(e);
        });
      }
    });
  }
  connectedCallback() {
      this.fechUserInfo().then(() => {
      if (!this.userData)
        throw new Error("An error occured fetching user info from the server");
      this.innerHTML = `
          <div class="settings_">
                <div class="settings_bg_"></div>
                <div class="settings_content_body">
                    <div class="settings_text_desc">
                        <h2>Account settings</h2>
                        <p>Edit your name, avatar, email, etc...</p>
                    </div>
                    <div class="settings_form_data">
                        <user-settings-form-page ></user-settings-form-page>
                        <user-settings-pfp></user-settings-pfp>
                    </div>
                </div>
          </div>
        `;
        this.setInputsValues();
        document.getElementById("pfp").onchange = (e) => this.changeImageWhenUpload(e);
        document.getElementById("save_setting_btn").onclick = (e) => this.updateEvent(e);
      }).catch((err) => {
        Toast.error(err);
        this.innerHTML = `
          <div class="settings__faild">
            <div class="settings_err_faild">
              <img src="../../assets/images/broken.webp" alt="broken" />
              <p>Something went wrong...</p>
            </div>
          </div>
        `
    });
  }
}

customElements.define("settings-page", SettingsPage);