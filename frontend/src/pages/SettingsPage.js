import { SettingsUserForm } from "../components/settings/SettingsUserForm.js";
import { SettingsUserPFP } from "../components/settings/SettingsUserPFP.js";
import { ComfirmPasswordPopUp } from "../components/settings/ComfirmPasswordPopUp.js";
import { LanguageComponent } from "../components/settings/LanguageComponent.js";
import Toast from "../components/Toast.js";
import userInfo from "../utils/services/userInfo.services.js";
import ApiWrapper from "../utils/ApiWrapper.js";
import { MessageBox } from "../components/MessageBox.js";

export class SettingsPage extends HTMLElement {
  constructor() {
    super();
    this.updateProfile = this.updateProfile.bind(this);
    this.userData = {};
    this.is2FAEnable = false; //tmp, TODO: get boolean from backedn
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
    document.getElementsByClassName("settings_pfp_image")[0].src =
      "http://localhost:8000" + data.pfp;
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
    } else {
      // todo: save server error message somewhere and display it in a toast
      this.userData = null;
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
      banner: document.getElementById("settings_banner_upload").files[0],
    };
    return data;
  }

  async updateProfile(e) {
    if (this.userData.intra_id) {
      document.getElementById("save_setting_btn").innerHTML =
        "<preloader-mini></preloader-mini>";
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
      const confirmPassword = document.querySelector(".msg-box-input").value;
      formData.append("confirm_password", confirmPassword);
    }
    console.log("formData -> ", formData.get("banner"))
    try {
      const res = await ApiWrapper.post("/user/update", formData, false);
      const data = await res.json();
      if (res.ok) {
        Toast.success(data.detail);
      } else {
        Toast.error(Array.isArray(data.detail) ? data.detail[0] : data.detail);
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
      if (data[key]) {
        document.getElementsByClassName("user_" + key + "_err")[0].innerHTML = "";
      }
    }
    const optionKeys = ["password", "pfp", "banner"]
    for (const key in data) {
      if (!data[key] &&  !optionKeys.find((option) => option === key) === undefined) {
        document.getElementsByClassName(
          "user_" + key + "_err"
        )[0].innerHTML = `${key} is required and can't be empty`;
        return false;
      }

      if (key === "pfp") {
        const file = data[key];
        if (!file) return true;
        if (file.size > 5000000) {
          document.getElementsByClassName("user_pfp_err")[0].innerHTML =
            "Image size must be less than 2MB";
          return false;
        } else if (!file.type.includes("image")) {
          document.getElementsByClassName("user_pfp_err")[0].innerHTML =
            "Invalid file type, only images are allowed";
          return false;
        }
      }
    }
    return true;
  }

  updateEvent(e) {
    this.validateForm().then((isValid) => {
      if (!isValid) return;
      if (this.userData.intra_id) {
        this.updateProfile(null).then(() => {
          document.getElementById("save_setting_btn").innerHTML = "Save";
          document.getElementById("save_setting_btn").onclick = (e) =>
            this.updateEvent(e);
        });
        return;
      }
      new MessageBox(
        "Confirm password",
        "Please enter your password",
        "Confirm",
        this.updateProfile,
        "",
        "",
        "Confirm password", true
      ).show();
    });
  }

  handle2FA() {
    this.is2FAEnable = !this.is2FAEnable; //tmp, TODO: set the boolean to backedn
    this.connectedCallback();
  }

  async saveBanner(file) {
    let formData = new FormData();
    formData.append("banner", file)
    const res = await ApiWrapper.post("/user/update", formData, false)
    const json = await res.json();
    if (res.ok) {
      Toast.success("Banner Updated Successfuly")
    } else {
      console.log(json.detail);
      Toast.error(json.detail)
    }
  }

  changeBanner(e) {
    const file = e.target.files[0];
    if (file.size > 5000000) {
      Toast.error("Banner too long")
      return;
    } else if (!file.type.includes("image")) {
      Toast.error("Banner should be an image")
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
        const bgSet = document.getElementById("settings_bg_");
        bgSet.style.backgroundImage = `url(${reader.result}), linear-gradient(to right, #212535, #212535)`;
    };
    reader.readAsDataURL(file);
  }
  connectedCallback() {
    this.fechUserInfo()
      .then(() => {
        if (!this.userData)
          throw new Error(
            "An error occured fetching user info from the server"
          );
        this.innerHTML = `
          <div class="settings_">
                <div ${this.userData.banner && (`style="background-image: url(http://localhost:8000${this.userData.banner})"`)} id="settings_bg_" class="settings_bg_">
                  <div class="upload_banner_btn" id="upload_banner_btn">
                    <div class="user_banner_err"></div>
                    <img src="../../assets/icons/camra.png" />
                    <input class="banner_input" id="settings_banner_upload" type="file" />
                    </div>
                    <div class="gr_bg_banner"></div>
                </div>
                <div class="settings_content_body">
                    <div class="settings_text_desc">
                        <div>
                          <h2 id="banner_title">Account settings</h2>
                          <p id="banner_desc">Please be aware that you can only change your info 2 times a day</p>
                        </div>
                        <language-component></language-component>
                    </div>
                    <div class="settings_form_data">
                        <user-settings-form-page ></user-settings-form-page>
                        <user-settings-pfp></user-settings-pfp>
                    </div>
                    <div class="settings_2fa_auth">
                      <h3>Two-Factor Authentication</h3>
                      <div class="settings_two_actor_manage">
                          <p>Two-factor authentication is currently ${
                            this.is2FAEnable ? "Enabled" : "Disabled"
                          }</p>
                          <button id="twoFactorBtn">${
                            this.is2FAEnable ? "Disable" : "Enable"
                          }</button>
                      </div>
                    </div>
                </div>
          </div>
        `;
        this.setInputsValues(); 
        document.getElementById("pfp").onchange = (e) => this.changeImageWhenUpload(e);
        document.getElementById("settings_banner_upload").onchange = (e) => this.changeBanner(e);
        document.getElementById("save_setting_btn").onclick = (e) => this.updateEvent(e);
        document.getElementById("twoFactorBtn").onclick = (e) => this.handle2FA(e);
      })
      .catch((err) => {
        Toast.error(err);
        this.innerHTML = `
          <div class="settings__faild">
            <div class="settings_err_faild">
              <img src="../../assets/images/broken.webp" alt="broken" />
              <p>Something went wrong...</p>
            </div>
          </div>
        `;
      });
  }
}

customElements.define("settings-page", SettingsPage);
